// Default contract addresses and configuration
export const DEFAULT_CONTRACTS = {
  // Solana Program and Accounts
  SOLANA_PROGRAM_ID: 'GAYKSbSP6S14sg9SEp9qtdQmhgpSL86qUK53r8svofc',
  SOLANA_MINT: 'JCC3neA7C6x7vi5aizug5zKmi9NyQ62vCAaGW8ytmamq',
  SOLANA_OFT_STORE: '2uWbuRdAPxwU6XJ4mF3DfFL3vvrqE2qwbkUqYN2YmYBF',
  SOLANA_MINT_AUTHORITY: '2uWbuRdAPxwU6XJ4mF3DfFL3vvrqE2qwbkUqYN2YmYBF',
  
  // OP Sepolia Contract
  OP_SEPOLIA_OFT: '0x2e42D5b38559b209b30815B692AC98641e7560b2',
  
  // Default wallet addresses
  DEFAULT_SEPOLIA_WALLET: '2uWbuRdAPxwU6XJ4mF3DfFL3vvrqE2qwbkUqYN2YmYBF',
} as const

// Environment variable getters with fallbacks
export const getContractAddresses = () => {
  // Use default values if environment variables are not defined or empty
  const solanaProgram = import.meta.env?.VITE_SOLANA_PROGRAM_ADDRESS || DEFAULT_CONTRACTS.SOLANA_PROGRAM_ID;
  const solanaMint = import.meta.env?.VITE_SOLANA_OFT_MINT_ADDRESS || DEFAULT_CONTRACTS.SOLANA_MINT;
  const solanaOftStore = import.meta.env?.VITE_SOLANA_OFT_STORE_ADDRESS || DEFAULT_CONTRACTS.SOLANA_OFT_STORE;
  const sepoliaOft = import.meta.env?.VITE_SEPOLIA_OFT_ADDRESS || DEFAULT_CONTRACTS.OP_SEPOLIA_OFT;
  const sepoliaWallet = import.meta.env?.VITE_SEPOLIA_WALLET || DEFAULT_CONTRACTS.DEFAULT_SEPOLIA_WALLET;

  return {
    // Solana addresses
    SOLANA_PROGRAM_ADDRESS: solanaProgram,
    SOLANA_OFT_MINT_ADDRESS: solanaMint,
    SOLANA_OFT_STORE_ADDRESS: solanaOftStore,
    
    // OP Sepolia addresses
    SEPOLIA_OFT_ADDRESS: sepoliaOft,
    SEPOLIA_WALLET: sepoliaWallet,
  };
}

// Typed contract addresses
export const CONTRACTS = getContractAddresses() 