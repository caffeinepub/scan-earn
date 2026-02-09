import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type TransactionId = Text;
  type PhoneNumber = Text;
  type CoinBalance = Nat;

  type UserProfile = {
    phoneNumber : PhoneNumber;
    coinBalance : CoinBalance;
    bankAccount : ?BankAccount;
    transactionHistory : [TransactionId];
  };

  type BankAccount = {
    accountHolderName : Text;
    bankName : Text;
    accountNumber : Text;
    ifsc : Text;
  };

  let users = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func connectPhoneNumber(phoneNumber : Text) : async () {
    if (users.containsKey(caller)) {
      Runtime.trap("Phone number already connected");
    };

    let userProfile : UserProfile = {
      phoneNumber;
      coinBalance = 0;
      bankAccount = null;
      transactionHistory = [];
    };

    users.add(caller, userProfile);
  };

  public shared ({ caller }) func addFunds(transactionId : TransactionId, tier : Nat) : async () {
    switch (users.get(caller)) {
      case (?profile) {
        let transactionExists = profile.transactionHistory.find(func(tx) { tx == transactionId });
        if (transactionExists != null) {
          Runtime.trap("Transaction ID already used");
        };

        let updatedProfile : UserProfile = {
          profile with
          coinBalance = profile.coinBalance + tier;
          transactionHistory = profile.transactionHistory.concat([transactionId]);
        };

        users.add(caller, updatedProfile);
      };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  public shared ({ caller }) func addBankAccount(accountHolderName : Text, bankName : Text, accountNumber : Text, ifsc : Text) : async () {
    switch (users.get(caller)) {
      case (?profile) {
        let bankDetails : BankAccount = {
          accountHolderName;
          bankName;
          accountNumber;
          ifsc;
        };

        let updatedProfile : UserProfile = {
          profile with bankAccount = ?bankDetails;
        };

        users.add(caller, updatedProfile);
      };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  public query ({ caller }) func getCoinBalance() : async CoinBalance {
    switch (users.get(caller)) {
      case (?profile) { profile.coinBalance };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getBankAccount() : async ?BankAccount {
    switch (users.get(caller)) {
      case (?profile) { profile.bankAccount };
      case (null) { null };
    };
  };

  public query ({ caller }) func getTransactionHistory() : async [TransactionId] {
    switch (users.get(caller)) {
      case (?profile) { profile.transactionHistory };
      case (null) { [] };
    };
  };

  public query ({ caller }) func isUserConnected() : async Bool {
    users.containsKey(caller);
  };

  public query ({ caller }) func getRewardTiers() : async [(Nat, Nat)] {
    let tiersList = List.fromArray<(Nat, Nat)>([(10, 15), (30, 55), (50, 95), (180, 390), (500, 1045), (1000, 2200)]);
    tiersList.toArray();
  };

  public query ({ caller }) func getTransactionHistoryForUser(user : Principal) : async [TransactionId] {
    switch (users.get(user)) {
      case (?profile) { profile.transactionHistory };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updatePhoneNumber(newPhoneNumber : PhoneNumber) : async Bool {
    switch (users.get(caller)) {
      case (?profile) {
        let updatedProfile : UserProfile = {
          profile with phoneNumber = newPhoneNumber;
        };
        users.add(caller, updatedProfile);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func withdrawCoins() : async CoinBalance {
    switch (users.get(caller)) {
      case (?profile) {
        if (profile.coinBalance == 0) { Runtime.trap("No coins to withdraw") };

        users.add(
          caller,
          {
            profile with coinBalance = 0;
          },
        );

        profile.coinBalance;
      };
      case (null) { Runtime.trap("User does not exist") };
    };
  };

  public shared ({ caller }) func transferCoins(toUser : Principal, amount : CoinBalance) : async () {
    switch (users.get(caller)) {
      case (?senderProfile) {
        if (senderProfile.coinBalance < amount) {
          Runtime.trap("Not enough coins to transfer");
        };

        switch (users.get(toUser)) {
          case (?receiverProfile) {
            let updatedSender : UserProfile = {
              senderProfile with coinBalance = senderProfile.coinBalance - amount;
            };
            users.add(caller, updatedSender);

            let updatedReceiver : UserProfile = {
              receiverProfile with coinBalance = receiverProfile.coinBalance + amount;
            };
            users.add(toUser, updatedReceiver);
          };
          case (null) { Runtime.trap("Receiver does not exist") };
        };
      };
      case (null) { Runtime.trap("Sender does not exist") };
    };
  };

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    users.entries().toArray();
  };
};
