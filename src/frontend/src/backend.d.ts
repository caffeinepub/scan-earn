import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Transaction {
    transactionType: TransactionType;
    user: Principal;
    amount: bigint;
    transactionId: string;
}
export interface UserMessageThread {
    lastMessageTime: bigint;
    messages: Array<Message>;
    user: Principal;
}
export interface Message {
    id: bigint;
    content: string;
    sender: Principal;
    timestamp: bigint;
    receiver: Principal;
    isAdminReply: boolean;
}
export interface PaymentRequest {
    status: PaymentStatus;
    receipt?: ExternalBlob;
    flagReason?: string;
    user: Principal;
    submittedAt: bigint;
    utrId?: string;
    amount: bigint;
    flagged: boolean;
    transactionId: string;
}
export interface UserProfile {
    name: string;
}
export enum PaymentStatus {
    pending = "pending",
    approved = "approved",
    declined = "declined"
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
    addFunds(transactionId: string, tierCoins: bigint, utrId: string | null, receipt: ExternalBlob | null): Promise<boolean>;
    adminApprovePayment(transactionId: string): Promise<void>;
    adminDeclinePayment(transactionId: string): Promise<void>;
    adminGetAllPaymentRequests(): Promise<Array<PaymentRequest>>;
    adminGetAllUserMessages(): Promise<Array<UserMessageThread>>;
    adminGetAllUsers(): Promise<Array<Principal>>;
    adminGetBlockedUsers(): Promise<Array<Principal>>;
    adminGetFlaggedPayments(): Promise<Array<PaymentRequest>>;
    adminGetPendingPayments(): Promise<Array<PaymentRequest>>;
    adminGetUserMessages(user: Principal): Promise<Array<Message>>;
    adminIsUserBlocked(user: Principal): Promise<boolean>;
    adminReplyToUser(user: Principal, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    blockUser(user: Principal): Promise<void>;
    getAddFundsHistory(): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCoinBalance(): Promise<bigint>;
    getMessages(): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalHistory(): Promise<Array<Transaction>>;
    isAvailableForAnonymous(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(receiver: Principal, content: string): Promise<void>;
    unblockUser(user: Principal): Promise<void>;
    withdraw(transactionId: string, amount: bigint): Promise<void>;
}
