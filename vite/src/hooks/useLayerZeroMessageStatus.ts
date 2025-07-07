import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  fetchMessageStatus, 
  type LayerZeroMessage
} from '../utils/layerzero-scan';
import { type LayerZeroEnvironment } from '../config/contracts';

interface UseLayerZeroMessageStatusProps {
  txHash?: string;
  environment?: LayerZeroEnvironment;
  enablePolling?: boolean;
  pollingInterval?: number;
  maxPollingAttempts?: number;
}

interface UseLayerZeroMessageStatusReturn {
  message: LayerZeroMessage | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFinalized: boolean;
  status: 'LOADING' | 'INFLIGHT' | 'PENDING' | 'DELIVERED' | 'FAILED' | 'SUCCEEDED' | 'NOT_FOUND' | 'ERROR';
}

export function useLayerZeroMessageStatus({
  txHash,
  environment = 'TESTNET',
  enablePolling = true,
  pollingInterval = 3000, // 3 seconds as requested
  maxPollingAttempts = 100 // Poll for ~5 minutes max
}: UseLayerZeroMessageStatusProps): UseLayerZeroMessageStatusReturn {
  const [message, setMessage] = useState<LayerZeroMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'LOADING' | 'INFLIGHT' | 'PENDING' | 'DELIVERED' | 'FAILED' | 'SUCCEEDED' | 'NOT_FOUND' | 'ERROR'>('LOADING');
  const pollAttempts = useRef(0);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const startPolling = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
    
    pollInterval.current = setInterval(async () => {
      pollAttempts.current++;
      
      if (!txHash) return;
      
      try {
        const result = await fetchMessageStatus(txHash, environment);
        
        if (result) {
          setMessage(result);
          setStatus(result.status.name);
          setError(null);
          
          // Stop polling if message is finalized
          if (result.status.name === 'DELIVERED' || result.status.name === 'FAILED') {
            if (pollInterval.current) {
              clearInterval(pollInterval.current);
              pollInterval.current = null;
            }
          }
        } else {
          // Message still not found, continue polling if under max attempts
          if (pollAttempts.current >= maxPollingAttempts) {
            setStatus('NOT_FOUND');
            setError('Message not found after maximum polling attempts');
            if (pollInterval.current) {
              clearInterval(pollInterval.current);
              pollInterval.current = null;
            }
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Continue polling on error unless we've exceeded max attempts
        if (pollAttempts.current >= maxPollingAttempts) {
          setStatus('ERROR');
          setError('Failed to fetch message status after maximum attempts');
          if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
          }
        }
      }
    }, pollingInterval);
  }, [txHash, environment, pollingInterval, maxPollingAttempts]);

  const fetchMessage = useCallback(async (isRetry = false) => {
    if (!txHash) {
      setMessage(null);
      setError(null);
      setStatus('NOT_FOUND');
      return;
    }

    if (!isRetry) {
      setIsLoading(true);
      setError(null);
      setStatus('LOADING');
    }

    try {
      const result = await fetchMessageStatus(txHash, environment);
      
      if (result) {
        setMessage(result);
        setStatus(result.status.name);
        setError(null);
        
        // Stop polling if message is finalized
        if (result.status.name === 'DELIVERED' || result.status.name === 'FAILED') {
          if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
          }
        }
      } else {
        // Message not found (404) - this is normal initially
        if (pollAttempts.current === 0) {
          setStatus('INFLIGHT'); // Show as INFLIGHT initially when not found
        }
        
        // Continue polling if enabled and under max attempts
        if (enablePolling && pollAttempts.current < maxPollingAttempts) {
          if (!pollInterval.current) {
            // Start polling for the first time
            startPolling();
          }
        } else if (pollAttempts.current >= maxPollingAttempts) {
          setStatus('NOT_FOUND');
          setError('Message not found after maximum polling attempts');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch message status';
      setError(errorMessage);
      setStatus('ERROR');
      console.error('Error fetching message status:', err);
    } finally {
      if (!isRetry) {
        setIsLoading(false);
      }
    }
  }, [txHash, environment, enablePolling, maxPollingAttempts]);

  const stopPolling = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  }, []);

  // Initial fetch when txHash changes
  useEffect(() => {
    if (txHash) {
      pollAttempts.current = 0;
      stopPolling();
      fetchMessage();
    } else {
      stopPolling();
      setMessage(null);
      setError(null);
      setStatus('NOT_FOUND');
    }
  }, [txHash, fetchMessage, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const isFinalized = message ? 
    (message.status.name === 'DELIVERED' || message.status.name === 'FAILED') : 
    false;

  return {
    message,
    isLoading,
    error,
    refetch: () => {
      pollAttempts.current = 0;
      stopPolling();
      return fetchMessage();
    },
    isFinalized,
    status
  };
} 