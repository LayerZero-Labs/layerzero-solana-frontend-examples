// Default contract addresses and configuration
export const DEFAULT_CONTRACTS = {
  // Solana Program and Accounts
  SOLANA_PROGRAM_ID: 'GAYKSbSP6S14sg9SEp9qtdQmhgpSL86qUK53r8svofc',
  SOLANA_MINT: 'JCC3neA7C6x7vi5aizug5zKmi9NyQ62vCAaGW8ytmamq',
  SOLANA_ESCROW: 'BdsusD4mCRpwG66mP8zcmSXAG4yvpJKWLutcoGZSVVJD',
  SOLANA_MINT_AUTHORITY: '2uWbuRdAPxwU6XJ4mF3DfFL3vvrqE2qwbkUqYN2YmYBF',
  
  // OP Sepolia Contract
  OP_SEPOLIA_OFT: '0x2e42D5b38559b209b30815B692AC98641e7560b2',
  
  // Default wallet addresses
  DEFAULT_SEPOLIA_WALLET: '2uWbuRdAPxwU6XJ4mF3DfFL3vvrqE2qwbkUqYN2YmYBF',
} as const

// Environment variable getters with fallbacks
export const getContractAddresses = () => ({
  // Solana addresses
  SOLANA_PROGRAM_ADDRESS: import.meta.env.VITE_SOLANA_PROGRAM_ADDRESS || DEFAULT_CONTRACTS.SOLANA_PROGRAM_ID,
  SOLANA_OFT_MINT_ADDRESS: import.meta.env.VITE_SOLANA_OFT_MINT_ADDRESS || DEFAULT_CONTRACTS.SOLANA_MINT,
  SOLANA_ESCROW_ADDRESS: import.meta.env.VITE_SOLANA_ESCROW_ADDRESS || DEFAULT_CONTRACTS.SOLANA_ESCROW,
  
  // OP Sepolia addresses
  SEPOLIA_OFT_ADDRESS: import.meta.env.VITE_SEPOLIA_OFT_ADDRESS || DEFAULT_CONTRACTS.OP_SEPOLIA_OFT,
  SEPOLIA_WALLET: import.meta.env.VITE_SEPOLIA_WALLET || DEFAULT_CONTRACTS.DEFAULT_SEPOLIA_WALLET,
})

// Typed contract addresses
export const CONTRACTS = getContractAddresses() 