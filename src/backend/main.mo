import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Set "mo:core/Set";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

// Apply migration

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // UserProfiles
  public type UserProfile = {
    name : Text;
  };

  // Transactions
  public type TransactionType = {
    #addFunds;
    #withdrawal;
  };

  public type PaymentStatus = {
    #pending;
    #approved;
    #declined;
  };

  public type Transaction = {
    transactionId : Text;
    user : Principal;
    amount : Nat;
    transactionType : TransactionType;
  };

  public type PaymentRequest = {
    transactionId : Text;
    user : Principal;
    amount : Nat;
    utrId : ?Text;
    receipt : ?Storage.ExternalBlob;
    status : PaymentStatus;
    flagged : Bool;
    flagReason : ?Text;
    submittedAt : Int;
  };

  // Chat Messages
  public type Message = {
    id : Nat;
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Int;
    isAdminReply : Bool;
  };

  public type UserMessageThread = {
    user : Principal;
    messages : [Message];
    lastMessageTime : Int;
  };

  // Persistent Data Stores
  let userProfiles = Map.empty<Principal, UserProfile>();
  let coinBalances = Map.empty<Principal, Nat>();
  let transactions = Map.empty<Text, Transaction>();
  let paymentRequests = Map.empty<Text, PaymentRequest>();
  let messages = Map.empty<Principal, List.List<Message>>();
  let blockedUsers = Set.empty<Principal>();
  let userSubmissionCount = Map.empty<Principal, Nat>();
  let userLastSubmission = Map.empty<Principal, Int>();
  var messageIdCounter : Nat = 0;

  // Helper function to check if user is blocked
  func isUserBlocked(user : Principal) : Bool {
    blockedUsers.contains(user);
  };

  // Helper function to detect suspicious add-funds activity
  func detectSuspiciousActivity(caller : Principal, transactionId : Text, tierCoins : Nat, utrId : ?Text) : (Bool, ?Text) {
    var flagged = false;
    var reason : ?Text = null;

    // Check for missing required fields
    if (transactionId.size() == 0) {
      flagged := true;
      reason := ?"Missing transaction ID";
    } else if (tierCoins == 0) {
      flagged := true;
      reason := ?"Invalid amount (zero)";
    } else if (utrId == null or (switch (utrId) { case (?id) { id.size() == 0 }; case (null) { true } })) {
      flagged := true;
      reason := ?"Missing UTR ID";
    };

    // Check for repeated submissions (rate limiting)
    let submissionCount = switch (userSubmissionCount.get(caller)) {
      case (null) { 0 };
      case (?count) { count };
    };

    let lastSubmission = switch (userLastSubmission.get(caller)) {
      case (null) { 0 };
      case (?time) { time };
    };

    let currentTime = Time.now();
    let timeSinceLastSubmission = currentTime - lastSubmission;
    let fiveMinutesInNanos : Int = 5 * 60 * 1_000_000_000;

    // Flag if more than 3 submissions in 5 minutes
    if (timeSinceLastSubmission < fiveMinutesInNanos and submissionCount >= 3) {
      flagged := true;
      reason := ?"Excessive submission rate detected";
    };

    // Check for duplicate transaction ID
    switch (paymentRequests.get(transactionId)) {
      case (?existing) {
        flagged := true;
        reason := ?"Duplicate transaction ID";
      };
      case (null) {};
    };

    (flagged, reason);
  };

  // User Profile Functions
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (isUserBlocked(caller)) {
      Runtime.trap("User is blocked");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Coin Management Functions
  public shared ({ caller }) func addFunds(transactionId : Text, tierCoins : Nat, utrId : ?Text, receipt : ?Storage.ExternalBlob) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add funds");
    };
    if (isUserBlocked(caller)) {
      Runtime.trap("User is blocked");
    };

    // Detect suspicious activity
    let (flagged, flagReason) = detectSuspiciousActivity(caller, transactionId, tierCoins, utrId);

    // Update submission tracking
    let submissionCount = switch (userSubmissionCount.get(caller)) {
      case (null) { 1 };
      case (?count) { count + 1 };
    };
    userSubmissionCount.add(caller, submissionCount);
    userLastSubmission.add(caller, Time.now());

    // Create payment request for admin review
    let paymentRequest : PaymentRequest = {
      transactionId;
      user = caller;
      amount = tierCoins;
      utrId;
      receipt;
      status = #pending;
      flagged;
      flagReason;
      submittedAt = Time.now();
    };

    switch (paymentRequests.get(transactionId)) {
      case (null) {
        paymentRequests.add(transactionId, paymentRequest);
        true;
      };
      case (?existing) {
        if (existing.user == caller) {
          false; // Duplicate, idempotent
        } else {
          false;
        };
      };
    };
  };

  public shared ({ caller }) func withdraw(transactionId : Text, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can withdraw funds");
    };
    if (isUserBlocked(caller)) {
      Runtime.trap("User is blocked");
    };

    let currentBalance = switch (coinBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };

    switch (transactions.get(transactionId)) {
      case (null) {
        if (amount <= currentBalance) {
          let newTransaction : Transaction = {
            transactionId;
            user = caller;
            amount;
            transactionType = #withdrawal;
          };

          transactions.add(transactionId, newTransaction);
          coinBalances.add(caller, currentBalance - amount);
        };
      };
      case (?transaction) {
        if (transaction.user == caller and transaction.transactionType == #withdrawal and transaction.amount == amount) {
          ();
        } else {
          ();
        };
      };
    };
  };

  public query ({ caller }) func getCoinBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view coin balance");
    };

    switch (coinBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  // Query Functions
  public query ({ caller }) func getAddFundsHistory() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transaction history");
    };

    transactions.filter(func(_id, transaction) { transaction.user == caller and transaction.transactionType == #addFunds }).values().toArray();
  };

  public query ({ caller }) func getWithdrawalHistory() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transaction history");
    };

    transactions.filter(func(_id, transaction) { transaction.user == caller and transaction.transactionType == #withdrawal }).values().toArray();
  };

  // Messaging Functions
  public shared ({ caller }) func sendMessage(receiver : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    if (isUserBlocked(caller)) {
      Runtime.trap("User is blocked");
    };

    messageIdCounter += 1;
    let message : Message = {
      id = messageIdCounter;
      sender = caller;
      receiver;
      content;
      timestamp = Time.now();
      isAdminReply = false;
    };

    let receiverMessages = switch (messages.get(caller)) {
      case (null) {
        List.fromArray<Message>([message]);
      };
      case (?existingMessages) {
        List.fromArray<Message>(existingMessages.toArray().concat([message]));
      };
    };

    messages.add(caller, receiverMessages);
  };

  public query ({ caller }) func getMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    let userMessages = switch (messages.get(caller)) {
      case (null) { List.empty<Message>() };
      case (?list) { list };
    };
    userMessages.toArray();
  };

  // Admin Messaging Functions
  public shared ({ caller }) func adminReplyToUser(user : Principal, content : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reply to users");
    };

    messageIdCounter += 1;
    let message : Message = {
      id = messageIdCounter;
      sender = caller;
      receiver = user;
      content;
      timestamp = Time.now();
      isAdminReply = true;
    };

    let userMessages = switch (messages.get(user)) {
      case (null) {
        List.fromArray<Message>([message]);
      };
      case (?existingMessages) {
        List.fromArray<Message>(existingMessages.toArray().concat([message]));
      };
    };

    messages.add(user, userMessages);
  };

  public query ({ caller }) func adminGetAllUserMessages() : async [UserMessageThread] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all messages");
    };

    let threads = Map.empty<Principal, UserMessageThread>();
    
    for ((user, messageList) in messages.entries()) {
      let messagesArray = messageList.toArray();
      if (messagesArray.size() > 0) {
        let lastMessage = messagesArray[messagesArray.size() - 1];
        let thread : UserMessageThread = {
          user;
          messages = messagesArray;
          lastMessageTime = lastMessage.timestamp;
        };
        threads.add(user, thread);
      };
    };

    threads.values().toArray();
  };

  public query ({ caller }) func adminGetUserMessages(user : Principal) : async [Message] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view user messages");
    };

    let userMessages = switch (messages.get(user)) {
      case (null) { List.empty<Message>() };
      case (?list) { list };
    };
    userMessages.toArray();
  };

  // Admin User Management Functions
  public shared ({ caller }) func blockUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can block users");
    };
    blockedUsers.add(user);
  };

  public shared ({ caller }) func unblockUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can unblock users");
    };
    blockedUsers.remove(user);
  };

  public query ({ caller }) func adminIsUserBlocked(user : Principal) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can check block status");
    };
    blockedUsers.contains(user);
  };

  public query ({ caller }) func adminGetAllUsers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.keys().toArray();
  };

  public query ({ caller }) func adminGetBlockedUsers() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view blocked users");
    };
    blockedUsers.toArray();
  };

  // Admin Payment Review Functions
  public query ({ caller }) func adminGetPendingPayments() : async [PaymentRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending payments");
    };
    paymentRequests.filter(func(_id, req) { req.status == #pending }).values().toArray();
  };

  public query ({ caller }) func adminGetFlaggedPayments() : async [PaymentRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view flagged payments");
    };
    paymentRequests.filter(func(_id, req) { req.flagged }).values().toArray();
  };

  public query ({ caller }) func adminGetAllPaymentRequests() : async [PaymentRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all payment requests");
    };
    paymentRequests.values().toArray();
  };

  public shared ({ caller }) func adminApprovePayment(transactionId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve payments");
    };

    switch (paymentRequests.get(transactionId)) {
      case (null) {
        Runtime.trap("Payment request not found");
      };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Payment already processed");
        };

        // Update payment status
        let updatedRequest : PaymentRequest = {
          request with status = #approved
        };
        paymentRequests.add(transactionId, updatedRequest);

        // Add funds to user balance
        let currentBalance = switch (coinBalances.get(request.user)) {
          case (null) { 0 };
          case (?balance) { balance };
        };
        coinBalances.add(request.user, currentBalance + request.amount);

        // Record transaction
        let transaction : Transaction = {
          transactionId;
          user = request.user;
          amount = request.amount;
          transactionType = #addFunds;
        };
        transactions.add(transactionId, transaction);
      };
    };
  };

  public shared ({ caller }) func adminDeclinePayment(transactionId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can decline payments");
    };

    switch (paymentRequests.get(transactionId)) {
      case (null) {
        Runtime.trap("Payment request not found");
      };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Payment already processed");
        };

        let updatedRequest : PaymentRequest = {
          request with status = #declined
        };
        paymentRequests.add(transactionId, updatedRequest);
      };
    };
  };

  // Public endpoint for anonymous access
  public query ({ caller }) func isAvailableForAnonymous() : async () {};
};

