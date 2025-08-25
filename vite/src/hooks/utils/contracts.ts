import { useMemo } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import { CONTRACTS } from "../../config/contracts";

/**
 * Stable Solana contract values using UMI PublicKey format
 */
export function useStableSolanaContracts() {
  return useMemo(() => {
    return {
      mint: publicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS),
      storePda: publicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS),
      programId: publicKey(CONTRACTS.SOLANA_PROGRAM_ADDRESS),
    };
  }, []);
}

/**
 * Stable Solana contract values using web3.js PublicKey format (for Anchor/SPL usage)
 */
export function useStableSolanaContractsWeb3() {
  return useMemo(() => {
    try {
      return {
        tokenMint: new PublicKey(CONTRACTS.SOLANA_OFT_MINT_ADDRESS),
        programId: new PublicKey(CONTRACTS.SOLANA_PROGRAM_ADDRESS),
        oftStore: new PublicKey(CONTRACTS.SOLANA_OFT_STORE_ADDRESS),
      };
    } catch (error) {
      console.error("Error parsing contract addresses:", error);
      return {
        tokenMint: null,
        programId: null,
        oftStore: null,
      } as const;
    }
  }, []);
}

/**
 * Get EVM contract addresses
 */
export function getEvmContracts() {
  return {
    sepoliaOft: CONTRACTS.SEPOLIA_OFT_ADDRESS as `0x${string}`,
    // Add more EVM contracts as needed
  };
}

/**
 * Validate that all required contract addresses are present
 */
export function validateContractAddresses(): { isValid: boolean; missing: string[] } {
  const required = [
    'SOLANA_OFT_MINT_ADDRESS',
    'SOLANA_OFT_STORE_ADDRESS', 
    'SOLANA_PROGRAM_ADDRESS',
    'SEPOLIA_OFT_ADDRESS',
  ];

  const missing = required.filter(key => !CONTRACTS[key as keyof typeof CONTRACTS]);

  return {
    isValid: missing.length === 0,
    missing,
  };
} 