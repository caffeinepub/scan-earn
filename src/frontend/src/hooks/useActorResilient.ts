import { useQuery } from '@tanstack/react-query';
import { createActorWithConfig } from '../config';
import type { backendInterface } from '../backend';

/**
 * Resilient actor initialization hook
 * Creates anonymous actor without authentication
 */
export function useActorResilient() {
  const query = useQuery({
    queryKey: ['actor-resilient'],
    queryFn: async () => {
      // Create anonymous actor without authentication
      const actor = await createActorWithConfig({
        agentOptions: {
          host: 'https://ic0.app',
        },
      }) as backendInterface;

      return { actor };
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    actor: query.data?.actor ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isReady: query.isSuccess,
    error: query.error,
    initError: query.isError ? query.error : null,
    retry: query.refetch,
  };
}
