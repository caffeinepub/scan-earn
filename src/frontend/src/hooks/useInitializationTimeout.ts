import { useEffect, useState } from 'react';

const INITIALIZATION_TIMEOUT_MS = 10000; // 10 seconds

export interface UseInitializationTimeoutReturn {
  hasTimedOut: boolean;
  reset: () => void;
}

/**
 * Hook to track if initialization is taking too long
 * Starts timer when isInitializing is true, resets when it becomes false
 */
export function useInitializationTimeout(
  isInitializing: boolean,
  timeoutMs: number = INITIALIZATION_TIMEOUT_MS
): UseInitializationTimeoutReturn {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!isInitializing) {
      // Reset timeout when initialization completes
      setHasTimedOut(false);
      return;
    }

    // Start timeout timer
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, timeoutMs);

    return () => {
      clearTimeout(timer);
    };
  }, [isInitializing, timeoutMs]);

  const reset = () => {
    setHasTimedOut(false);
  };

  return {
    hasTimedOut,
    reset,
  };
}
