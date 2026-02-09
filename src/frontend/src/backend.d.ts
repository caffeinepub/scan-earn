import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type PhoneNumber = string;
export interface BankAccount {
    ifsc: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
}
export type TransactionId = string;
export type CoinBalance = bigint;
export interface UserProfile {
    bankAccount?: BankAccount;
    coinBalance: CoinBalance;
    phoneNumber: PhoneNumber;
    transactionHistory: Array<TransactionId>;
}
export interface backendInterface {
    addBankAccount(accountHolderName: string, bankName: string, accountNumber: string, ifsc: string): Promise<void>;
    addFunds(transactionId: TransactionId, tier: bigint): Promise<void>;
    connectPhoneNumber(phoneNumber: string): Promise<void>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getBankAccount(): Promise<BankAccount | null>;
    getCoinBalance(): Promise<CoinBalance>;
    getRewardTiers(): Promise<Array<[bigint, bigint]>>;
    getTransactionHistory(): Promise<Array<TransactionId>>;
    getTransactionHistoryForUser(user: Principal): Promise<Array<TransactionId>>;
    isUserConnected(): Promise<boolean>;
    transferCoins(toUser: Principal, amount: CoinBalance): Promise<void>;
    updatePhoneNumber(newPhoneNumber: PhoneNumber): Promise<boolean>;
    withdrawCoins(): Promise<CoinBalance>;
}
