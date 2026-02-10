import { useEffect, useState } from 'react';
import { useActorResilient } from './useActorResilient';

interface UseBackendReachabilityReturn {
  isReachable: boolean | null;
  isChecking: boolean;
  error: Error | null;
  retry: () => void;
}

/**
 * Hook to check backend reachability using a lightweight anonymous health check
 */
export function useBackendReachability(): UseBackendReachabilityReturn {
  const { actor, isFetching } = useActorResilient();
  const [isReachable, setIsReachable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    // Skip if actor is not ready (still fetching) or not available
    if (isFetching || !actor) {
      setIsReachable(null);
      setIsChecking(false);
      return;
    }

    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkReachability = async () => {
      setIsChecking(true);
      setError(null);

      try {
        // Create a promise that rejects after timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Backend reachability check timed out. The canister may be stopped or unreachable.'));
          }, 8000); // 8 second timeout for fail-fast behavior
        });

        // Race between the health check and timeout
        await Promise.race([
          actor.isAvailableForAnonymous(),
          timeoutPromise
        ]);

        if (mounted) {
          clearTimeout(timeoutId);
          setIsReachable(true);
          setIsChecking(false);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          clearTimeout(timeoutId);
          setIsReachable(false);
          setIsChecking(false);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    checkReachability();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [actor, isFetching, retryTrigger]);

  const retry = () => {
    setRetryTrigger(prev => prev + 1);
  };

  return {
    isReachable,
    isChecking,
    error,
    retry,
  };
}
