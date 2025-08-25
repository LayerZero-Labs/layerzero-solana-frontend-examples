import { useState, useRef, useCallback } from "react";

/**
 * Hook for managing loading states with prevention of multiple simultaneous calls
 */
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const loadingRef = useRef(false);

  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: {
      skipIfLoading?: boolean;
      logName?: string;
    }
  ): Promise<T | undefined> => {
    const { skipIfLoading = true, logName = "operation" } = options || {};
    
    // Prevent multiple simultaneous calls if requested
    if (skipIfLoading && (loadingRef.current || isLoading)) {
      console.log(`${logName} already in progress, skipping`);
      return undefined;
    }

    loadingRef.current = true;
    setIsLoading(true);

    try {
      console.log(`🚀 Starting ${logName}...`);
      const result = await operation();
      console.log(`✅ ${logName} completed successfully`);
      return result;
    } catch (error) {
      console.error(`❌ ${logName} failed:`, error);
      throw error;
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    isLoading,
    withLoading,
    loadingRef,
  };
}

/**
 * Hook for managing multiple loading states
 */
export function useMultipleLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const loadingRefs = useRef<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    loadingRefs.current[key] = loading;
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    options?: {
      skipIfLoading?: boolean;
      logName?: string;
    }
  ): Promise<T | undefined> => {
    const { skipIfLoading = true, logName = key } = options || {};
    
    // Prevent multiple simultaneous calls if requested
    if (skipIfLoading && (loadingRefs.current[key] || loadingStates[key])) {
      console.log(`${logName} already in progress, skipping`);
      return undefined;
    }

    setLoading(key, true);

    try {
      console.log(`🚀 Starting ${logName}...`);
      const result = await operation();
      console.log(`✅ ${logName} completed successfully`);
      return result;
    } catch (error) {
      console.error(`❌ ${logName} failed:`, error);
      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [loadingStates, setLoading]);

  return {
    loadingStates,
    isLoading,
    withLoading,
  };
} 