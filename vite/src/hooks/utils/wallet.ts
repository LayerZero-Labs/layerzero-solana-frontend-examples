import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { umi } from "../../config/umi";

/**
 * Stable wallet info that only changes when wallet connection state actually changes
 */
export function useStableWalletInfo() {
  const wallet = useWallet();

  return useMemo(() => {
    return {
      connected: wallet.connected,
      publicKey: wallet.publicKey?.toString() || null,
      hasSignTransaction: !!wallet.signTransaction,
    };
  }, [wallet.connected, wallet.publicKey?.toString(), wallet.signTransaction]);
}

/**
 * Create a UMI instance with wallet identity applied
 */
export function useUmiWithWallet() {
  const wallet = useWallet();
  const stableWalletInfo = useStableWalletInfo();

  return useMemo(() => {
    if (!stableWalletInfo.connected || !stableWalletInfo.publicKey || !stableWalletInfo.hasSignTransaction) {
      return null;
    }
    
    try {
      // Create a stable wallet adapter that doesn't depend on the changing wallet object
      const stableWalletAdapter = {
        publicKey: wallet.publicKey!,
        signTransaction: wallet.signTransaction!,
        signAllTransactions: wallet.signAllTransactions || (async (txs) => {
          const signedTxs = [];
          for (const tx of txs) {
            signedTxs.push(await wallet.signTransaction!(tx));
          }
          return signedTxs;
        }),
      };
      
      // Apply the wallet identity to the stable UMI instance
      return umi.use(walletAdapterIdentity(stableWalletAdapter));
    } catch (error) {
      console.error('Failed to apply wallet identity to UMI:', error);
      return null;
    }
  }, [stableWalletInfo.connected, stableWalletInfo.publicKey, stableWalletInfo.hasSignTransaction]);
}

/**
 * Check if wallet is ready for transactions
 */
export function useWalletReady() {
  const stableWalletInfo = useStableWalletInfo();
  
  return {
    isReady: stableWalletInfo.connected && !!stableWalletInfo.publicKey && stableWalletInfo.hasSignTransaction,
    ...stableWalletInfo,
  };
} 