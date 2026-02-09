import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BankAccount } from '../backend';

export const queryKeys = {
  isConnected: ['user', 'connected'],
  coinBalance: ['user', 'coinBalance'],
  bankAccount: ['user', 'bankAccount'],
  rewardTiers: ['rewardTiers'],
  transactionHistory: ['user', 'transactionHistory'],
};

export function useIsUserConnected() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.isConnected,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isUserConnected();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useConnectPhone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.connectPhoneNumber(phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.isConnected });
      queryClient.invalidateQueries({ queryKey: queryKeys.coinBalance });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount });
    },
  });
}

export function useCoinBalance() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.coinBalance,
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCoinBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRewardTiers() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.rewardTiers,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRewardTiers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBankAccount() {
  const { actor, isFetching } = useActor();

  return useQuery<BankAccount | null>({
    queryKey: queryKeys.bankAccount,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBankAccount();
    },
    enabled: !!actor && !isFetching,
  });
}

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
      await actor.addBankAccount(
        data.accountHolderName,
        data.bankName,
        data.accountNumber,
        data.ifsc
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount });
    },
  });
}

export function useAddFunds() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { transactionId: string; tierCoins: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addFunds(data.transactionId, BigInt(data.tierCoins));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coinBalance });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionHistory });
    },
  });
}

