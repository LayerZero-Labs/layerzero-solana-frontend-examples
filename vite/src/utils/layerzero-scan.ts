// LayerZero Scan API utility for fetching message status
// Based on the LZ Scan API documentation and response structure

import { LAYERZERO_SCAN_CONFIG, type LayerZeroEnvironment } from '../config/contracts';

// Types for the actual API response structure
export interface LayerZeroMessage {
  pathway: {
    srcEid: number;
    dstEid: number;
    sender: {
      address: string;
      chain: string;
    };
    receiver: {
      address: string;
      chain: string;
    };
    id: string;
    nonce: number;
  };
  source: {
    status: string;
    tx: {
      txHash: string;
      blockHash: string;
      blockNumber: string;
      blockTimestamp: number;
      from: string;
      payload: string;
      readinessTimestamp: number;
      options: Record<string, unknown>;
    };
  };
  destination: {
    status: string;
    tx?: {
      txHash: string;
      blockHash: string;
      blockNumber: number;
      blockTimestamp: number;
    };
    nativeDrop?: {
      status: string;
    };
    lzCompose?: {
      status: string;
    };
  };
  verification: {
    dvn: {
      status: string;
      dvns: Record<string, unknown>;
    };
    sealer: {
      status: string;
      tx: Record<string, unknown>;
    };
  };
  status: {
    name: 'INFLIGHT' | 'DELIVERED' | 'FAILED' | 'PENDING' | 'SUCCEEDED';
    message: string;
  };
  guid: string;
  config: Record<string, unknown>;
  created: string;
  updated: string;
}

export interface LayerZeroScanResponse {
  data: LayerZeroMessage[];
}

// Default to testnet for development
const DEFAULT_ENVIRONMENT: LayerZeroEnvironment = 'TESTNET';

/**
 * Fetches message status from LayerZero Scan API by transaction hash
 * @param txHash - The transaction hash to look up
 * @param environment - The LayerZero environment (MAINNET or TESTNET)
 * @returns Promise<LayerZeroMessage | null> - The message data or null if not found
 */
export async function fetchMessageStatus(
  txHash: string,
  environment: LayerZeroEnvironment = DEFAULT_ENVIRONMENT
): Promise<LayerZeroMessage | null> {
  if (!txHash || typeof txHash !== 'string') {
    throw new Error('Valid transaction hash is required');
  }

  const config = LAYERZERO_SCAN_CONFIG[environment];
  const url = `${config.baseUrl}/messages/tx/${txHash}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Message not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LayerZeroScanResponse = await response.json();
    
    // Return the first message if available
    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching message status:', error);
    throw error;
  }
}

/**
 * Fetches multiple messages by transaction hashes
 * @param txHashes - Array of transaction hashes
 * @param environment - The LayerZero environment
 * @returns Promise<LayerZeroMessage[]> - Array of found messages
 */
export async function fetchMultipleMessageStatus(
  txHashes: string[],
  environment: LayerZeroEnvironment = DEFAULT_ENVIRONMENT
): Promise<LayerZeroMessage[]> {
  const promises = txHashes.map(hash => 
    fetchMessageStatus(hash, environment).catch(() => null)
  );
  
  const results = await Promise.all(promises);
  return results.filter((message): message is LayerZeroMessage => message !== null);
}

/**
 * Polls for message status until it's delivered or failed
 * @param txHash - The transaction hash to poll
 * @param environment - The LayerZero environment
 * @param maxAttempts - Maximum number of polling attempts (default: 30)
 * @param intervalMs - Polling interval in milliseconds (default: 5000)
 * @returns Promise<LayerZeroMessage | null> - The final message status
 */
export async function pollMessageStatus(
  txHash: string,
  environment: LayerZeroEnvironment = DEFAULT_ENVIRONMENT,
  maxAttempts: number = 30,
  intervalMs: number = 5000
): Promise<LayerZeroMessage | null> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const message = await fetchMessageStatus(txHash, environment);
      
      if (!message) {
        // Message not found yet, continue polling
        attempts++;
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        continue;
      }
      
      // Check if message is in final state
      if (message.status.name === 'DELIVERED' || message.status.name === 'FAILED') {
        return message;
      }
      
      // Message is still in progress, continue polling
      attempts++;
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    } catch (error) {
      console.error(`Polling attempt ${attempts + 1} failed:`, error);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  throw new Error(`Polling timeout after ${maxAttempts} attempts`);
}

/**
 * Checks if a message is in a final state (delivered or failed)
 * @param message - The LayerZero message
 * @returns boolean - True if message is in final state
 */
export function isMessageFinalized(message: LayerZeroMessage): boolean {
  return message.status.name === 'DELIVERED' || message.status.name === 'FAILED';
}

/**
 * Gets a human-readable status description
 * @param status - The message status name
 * @returns string - Human-readable status description
 */
export function getStatusDescription(status: string): string {
  switch (status) {
    case 'INFLIGHT':
      return 'Message is being processed';
    case 'DELIVERED':
      return 'Message successfully delivered';
    case 'FAILED':
      return 'Message delivery failed';
    case 'PENDING':
      return 'Message is pending processing';
    case 'SUCCEEDED':
      return 'Transaction succeeded';
    default:
      return 'Unknown status';
  }
}

/**
 * Formats message data for display
 * @param message - The LayerZero message
 * @returns Formatted message data
 */
export function formatMessageForDisplay(message: LayerZeroMessage) {
  return {
    id: message.pathway.id,
    status: message.status.name,
    statusDescription: getStatusDescription(message.status.name),
    srcChain: message.pathway.srcEid,
    dstChain: message.pathway.dstEid,
    srcTxHash: message.source.tx.txHash,
    dstTxHash: message.destination.tx?.txHash,
    isFinalized: isMessageFinalized(message),
    created: new Date(message.created).toLocaleString(),
    updated: new Date(message.updated).toLocaleString(),
    statusMessage: message.status.message,
  };
} 