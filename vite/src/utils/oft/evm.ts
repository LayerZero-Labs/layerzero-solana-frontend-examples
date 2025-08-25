import { formatEther, parseEther } from 'viem';
import { optimismSepolia } from 'wagmi/chains';
import { CONTRACTS } from '../../config/contracts';

/**
 * EVM chain configuration for OFT operations
 */
export const EVM_CHAINS = {
  OPTIMISM_SEPOLIA: {
    id: optimismSepolia.id,
    name: 'OP Sepolia',
    chain: optimismSepolia,
  },
} as const;

/**
 * EVM contract addresses
 */
export function getEvmOftContracts() {
  return {
    sepoliaOft: CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`,
  };
}

/**
 * Get the target chain for EVM OFT operations (default: OP Sepolia)
 */
export function getTargetEvmChain() {
  return EVM_CHAINS.OPTIMISM_SEPOLIA;
}

/**
 * Format token balance for display
 */
export function formatEvmTokenBalance(balance: bigint | undefined): string {
  return balance ? formatEther(balance) : '0';
}

/**
 * Parse token amount from string input
 */
export function parseEvmTokenAmount(amount: string): bigint {
  return parseEther(amount);
}

/**
 * Get mint parameters for OFT tokens
 */
export function getEvmMintParameters(recipientAddress: string, amount: string = '1') {
  const contracts = getEvmOftContracts();
  return {
    address: contracts.sepoliaOft,
    functionName: 'mint' as const,
    args: [recipientAddress as `0x${string}`, parseEvmTokenAmount(amount)] as const,
  };
}

/**
 * Process EVM transaction errors into user-friendly messages
 */
export function processEvmError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Common EVM error patterns
    if (message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    }
    
    if (message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    }
    
    if (message.includes('gas')) {
      return 'Transaction failed due to gas issues. Please try again with higher gas.';
    }
    
    if (message.includes('nonce')) {
      return 'Transaction nonce error. Please try again.';
    }
    
    if (message.includes('revert')) {
      return 'Transaction was reverted by the contract';
    }
    
    return error.message;
  }
  
  return 'Unknown error occurred during transaction';
}

/**
 * Validate token amount input
 */
export function validateEvmTokenAmount(amount: string): { isValid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (numAmount > 1000000) {
    return { isValid: false, error: 'Amount is too large' };
  }
  
  return { isValid: true };
}

/**
 * Get transaction confirmation timeout (in milliseconds)
 */
export function getEvmTransactionTimeout(): number {
  return 60000; // 60 seconds
}

/**
 * Format transaction hash for display
 */
export function formatEvmTransactionHash(hash: string, length: number = 10): string {
  if (!hash) return '';
  return `${hash.slice(0, length)}...${hash.slice(-6)}`;
}

/**
 * Check if address is valid Ethereum address
 */
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
} 