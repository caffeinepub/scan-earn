import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActorResilient } from './useActorResilient';
import type { UserProfile, Transaction, ExternalBlob, PaymentRequest, UserMessageThread, Message } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';
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
    mutationFn: async ({ 
      transactionId, 
      coins, 
      utrId, 
      receipt 
    }: { 
      transactionId: string; 
      coins: bigint;
      utrId?: string;
      receipt?: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFunds(
        transactionId, 
        coins, 
        utrId || null, 
        receipt || null
      );
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

// Messaging Queries
export function useGetMessages() {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMessages();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver, content }: { receiver: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(receiver, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

// Admin User Management
export function useAdminGetAllUsers(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<Principal[]>({
    queryKey: ['adminAllUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllUsers();
    },
    enabled: !!actor && !actorFetching && enabled,
  });
}

export function useAdminGetBlockedUsers(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<Principal[]>({
    queryKey: ['adminBlockedUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetBlockedUsers();
    },
    enabled: !!actor && !actorFetching && enabled,
  });
}

export function useAdminBlockUser() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.blockUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlockedUsers'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

export function useAdminUnblockUser() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unblockUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlockedUsers'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

// Admin Payment Management
export function useAdminGetAllPaymentRequests(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<PaymentRequest[]>({
    queryKey: ['adminAllPayments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllPaymentRequests();
    },
    enabled: !!actor && !actorFetching && enabled,
    refetchInterval: 10000,
  });
}

export function useAdminGetFlaggedPayments(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<PaymentRequest[]>({
    queryKey: ['adminFlaggedPayments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetFlaggedPayments();
    },
    enabled: !!actor && !actorFetching && enabled,
    refetchInterval: 10000,
  });
}

export function useAdminApprovePayment() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminApprovePayment(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllPayments'] });
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedPayments'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

export function useAdminDeclinePayment() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminDeclinePayment(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllPayments'] });
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedPayments'] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}

// Admin Messaging
export function useAdminGetAllUserMessages(enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<UserMessageThread[]>({
    queryKey: ['adminAllUserMessages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllUserMessages();
    },
    enabled: !!actor && !actorFetching && enabled,
    refetchInterval: 5000,
  });
}

export function useAdminGetUserMessages(user: Principal | null, enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActorResilient();

  return useQuery<Message[]>({
    queryKey: ['adminUserMessages', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) throw new Error('Actor or user not available');
      return actor.adminGetUserMessages(user);
    },
    enabled: !!actor && !actorFetching && !!user && enabled,
    refetchInterval: 3000,
  });
}

export function useAdminReplyToUser() {
  const { actor } = useActorResilient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, content }: { user: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminReplyToUser(user, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminAllUserMessages'] });
      queryClient.invalidateQueries({ queryKey: ['adminUserMessages', variables.user.toString()] });
    },
    onError: (error) => {
      const parsed = parseICError(error);
      throw new Error(parsed.message);
    },
  });
}
