import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

// Local type definitions for missing backend types
// TODO: These should be moved to backend once implemented
export interface BankAccount {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export interface WithdrawalRequest {
  amountRequested: bigint;
  fee: bigint;
  timestamp: bigint;
  status: 'pending' | 'completed' | 'rejected';
}

export interface RewardTier {
  inr: number;
  coins: number;
}

export const queryKeys = {
  isConnected: ['user', 'connected'],
  coinBalance: ['user', 'coinBalance'],
  bankAccount: ['user', 'bankAccount'],
  rewardTiers: ['rewardTiers'],
  transactionHistory: ['user', 'transactionHistory'],
  withdrawalRequests: ['user', 'withdrawalRequests'],
};

// Check if user has registered a CTR
export function useIsUserConnected() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.isConnected,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCTRRegistered();
    },
    enabled: !!actor && !isFetching,
  });
}

// Connect/register a CTR ID
export function useConnectCtrId() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ctrId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      // Convert the 7-digit CTR ID string to a Principal
      // For demo purposes, we'll create a principal from the CTR ID
      const ctrPrincipal = Principal.fromText(
        Principal.anonymous().toText()
      );
      await actor.registerCTR(ctrPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.isConnected });
      queryClient.invalidateQueries({ queryKey: queryKeys.coinBalance });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount });
    },
  });
}

// Stub implementation - returns 0 until backend is implemented
export function useCoinBalance() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.coinBalance,
    queryFn: async () => {
      if (!actor) return BigInt(0);
      // TODO: Backend method not implemented yet
      // return actor.getCoinBalance();
      return BigInt(0);
    },
    enabled: !!actor && !isFetching,
  });
}

// Stub implementation - returns empty array until backend is implemented
export function useRewardTiers() {
  const { actor, isFetching } = useActor();

  return useQuery<RewardTier[]>({
    queryKey: queryKeys.rewardTiers,
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Backend method not implemented yet
      // return actor.getRewardTiers();
      return [
        { inr: 100, coins: 1000 },
        { inr: 500, coins: 5500 },
        { inr: 1000, coins: 12000 },
        { inr: 2000, coins: 25000 },
      ];
    },
    enabled: !!actor && !isFetching,
  });
}

// Stub implementation - returns null until backend is implemented
export function useBankAccount() {
  const { actor, isFetching } = useActor();

  return useQuery<BankAccount | null>({
    queryKey: queryKeys.bankAccount,
    queryFn: async () => {
      if (!actor) return null;
      // TODO: Backend method not implemented yet
      // return actor.getBankAccount();
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

// Stub implementation - throws error until backend is implemented
export function useAddBankAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifsc: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      // TODO: Backend method not implemented yet
      // await actor.addBankAccount(
      //   data.accountHolderName,
      //   data.bankName,
      //   data.accountNumber,
      //   data.ifsc
      // );
      throw new Error('Backend method addBankAccount not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount });
    },
  });
}

// Stub implementation - throws error until backend is implemented
export function useAddFunds() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { transactionId: string; tierCoins: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      // TODO: Backend method not implemented yet
      // await actor.addFunds(data.transactionId, BigInt(data.tierCoins));
      throw new Error('Backend method addFunds not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coinBalance });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionHistory });
    },
  });
}

// Stub implementation - throws error until backend is implemented
export function useRequestWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error('Actor not initialized');
      // TODO: Backend method not implemented yet
      // const result = await actor.requestWithdrawal(BigInt(amount));
      // return result;
      throw new Error('Backend method requestWithdrawal not implemented yet');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coinBalance });
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawalRequests });
    },
  });
}

// Stub implementation - returns empty array until backend is implemented
export function useWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, WithdrawalRequest]>>({
    queryKey: queryKeys.withdrawalRequests,
    queryFn: async () => {
      if (!actor) return [];
      // TODO: Backend method not implemented yet
      // return actor.getWithdrawalRequests();
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
