import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActorResilient } from './useActorResilient';
import type { UserProfile, Transaction } from '../backend';
import { parseICError } from '../lib/icErrorParser';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActorResilient();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

// Coin Balance Query
export function useGetCoinBalance() {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<bigint>({
    queryKey: ['coinBalance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCoinBalance();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}

// Add Funds Mutation
export function useAddFunds() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, coins }: { transactionId: string; coins: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFunds(transactionId, coins);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['addFundsHistory'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

// Withdraw Mutation
export function useWithdraw() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ transactionId, amount }: { transactionId: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.withdraw(transactionId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawalHistory'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

// Transaction History Queries
export function useGetAddFundsHistory() {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<Transaction[]>({
    queryKey: ['addFundsHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAddFundsHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWithdrawalHistory() {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<Transaction[]>({
    queryKey: ['withdrawalHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWithdrawalHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}
