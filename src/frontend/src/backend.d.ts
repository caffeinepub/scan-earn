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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCanister(id: Principal): Promise<void>;
    getAllCanisters(): Promise<Array<[Principal, string]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCanister(id: Principal): Promise<string | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCTRRegistered(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerCTR(ctr: Principal): Promise<void>;
    registerCanister(id: Principal, name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCanisterName(id: Principal, newName: string): Promise<void>;
}
