import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // UserProfiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // Coin Management
  public type TransactionType = {
    #addFunds;
    #withdrawal;
  };

  public type Transaction = {
    transactionId : Text;
    user : Principal;
    amount : Nat;
    transactionType : TransactionType;
  };

  let coinBalances = Map.empty<Principal, Nat>();
  let transactions = Map.empty<Text, Transaction>();

  public shared ({ caller }) func addFunds(transactionId : Text, tierCoins : Nat) : async Bool {
    switch (transactions.get(transactionId)) {
      case (null) {
        let currentBalance = switch (coinBalances.get(caller)) {
          case (null) { 0 };
          case (?balance) { balance };
        };

        let newTransaction : Transaction = {
          transactionId;
          user = caller;
          amount = tierCoins;
          transactionType = #addFunds;
        };

        transactions.add(transactionId, newTransaction);
        coinBalances.add(caller, currentBalance + tierCoins);
        true;
      };
      case (?transaction) {
        if (transaction.user == caller and transaction.transactionType == #addFunds) {
          return false; // Duplicate transaction by the same user is allowed to be idempotent
        } else {
          return false; // In this relaxed system, just return false for any conflicting transaction ID
        };
      };
    };
  };

  public shared ({ caller }) func withdraw(transactionId : Text, amount : Nat) : async () {
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
          // Idempotent, ignore and process as success
          ();
        } else {
          ();
        };
      };
    };
  };

  public query ({ caller }) func getCoinBalance() : async Nat {
    switch (coinBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance };
    };
  };

  public query ({ caller }) func getAddFundsHistory() : async [Transaction] {
    transactions.filter(func(_id, transaction) { transaction.user == caller and transaction.transactionType == #addFunds }).values().toArray();
  };

  public query ({ caller }) func getWithdrawalHistory() : async [Transaction] {
    transactions.filter(func(_id, transaction) { transaction.user == caller and transaction.transactionType == #withdrawal }).values().toArray();
  };

  public query ({ caller }) func isAvailableForAnonymous() : async () {
    ();
  };
};
