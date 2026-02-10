import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Transaction {
    transactionType: TransactionType;
    user: Principal;
    amount: bigint;
    transactionId: string;
}
export enum TransactionType {
    addFunds = "addFunds",
    withdrawal = "withdrawal"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFunds(transactionId: string, tierCoins: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAddFundsHistory(): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoinBalance(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalHistory(): Promise<Array<Transaction>>;
    isAvailableForAnonymous(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    withdraw(transactionId: string, amount: bigint): Promise<void>;
}
