import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let canisters = Map.empty<Principal, Text>();

  // Map to store CTR registrations (principal -> CTR principal)
  let ctrRegistrations = Map.empty<Principal, Principal>();
  let ctrToPrincipal = Map.empty<Principal, Principal>();

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

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Register a CTR canister for a user.
  public shared ({ caller }) func registerCTR(ctr : Principal) : async () {
    if (ctrRegistrations.containsKey(caller)) {
      Runtime.trap("Caller is already registered with a CTR");
    };
    if (ctrToPrincipal.containsKey(ctr)) {
      Runtime.trap("CTR is already registered with another principal");
    };
    ctrRegistrations.add(caller, ctr);
    ctrToPrincipal.add(ctr, caller);
  };

  // Check if the caller has a registered CTR.
  public query ({ caller }) func isCTRRegistered() : async Bool {
    ctrRegistrations.containsKey(caller);
  };

  public shared ({ caller }) func registerCanister(id : Principal, name : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can register canisters");
    };
    canisters.add(id, name);
  };

  public query ({ caller }) func getCanister(id : Principal) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view canisters");
    };
    canisters.get(id);
  };

  public query ({ caller }) func getAllCanisters() : async [(Principal, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view canisters");
    };
    canisters.toArray();
  };

  public shared ({ caller }) func deleteCanister(id : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete canisters");
    };
    canisters.remove(id);
  };

  public shared ({ caller }) func updateCanisterName(id : Principal, newName : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update canisters");
    };
    switch (canisters.get(id)) {
      case (?_) { canisters.add(id, newName) };
      case (null) { Runtime.trap("Canister not found") };
    };
  };
};
