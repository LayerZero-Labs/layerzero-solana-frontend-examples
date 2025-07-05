import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { CONTRACTS } from "../config/contracts";

export default function SolanaOftCard() {
  const wallet = useWallet();
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setIsMinting(true);
    try {
      // TODO: Implement actual minting logic using Solana SDK
      console.log("Minting Solana OFT tokens...");
      // Placeholder for minting logic
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async operation
      console.log("Minted successfully");
    } catch (error) {
      console.error("Error minting:", error);
    } finally {
      setIsMinting(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Solana OFT
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Connect your Solana wallet to view OFT balance and mint tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Solana OFT
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Balance</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            0 OFT
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">Mint:</span> <span className="font-mono text-xs">{CONTRACTS.SOLANA_OFT_MINT_ADDRESS}</span>
          </p>
        </div>

        <button
          onClick={handleMint}
          disabled={isMinting}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isMinting ? 'Minting...' : 'Mint OFT Tokens'}
        </button>
      </div>
    </div>
  );
} 