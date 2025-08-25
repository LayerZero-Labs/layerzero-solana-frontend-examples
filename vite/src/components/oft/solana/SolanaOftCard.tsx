import { useSolanaOft } from "../../../hooks/useSolanaOft";
import { FilePathDisplay } from "../../FilePathDisplay";

export default function SolanaOftCard() {
  const {
    tokenMint,
    programId,
    oftStore,
  } = useSolanaOft();

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  if (!tokenMint || !programId || !oftStore) {
    return (
      <p className="text-sm text-layerzero-gray-400">
        Loading contract configuration...
      </p>
    );
  }

  return (
    <div className="space-y-4">
        <FilePathDisplay text="/vite/src/components/oft/solana/SolanaOftCard.tsx" />
        {/* Token Information - Always visible */}
        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <h4 className="font-medium text-layerzero-white mb-3">
            Token Information
          </h4>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">Token Mint:</span>
              </p>
              <p className="font-mono text-xs text-layerzero-white break-all">
                {tokenMint.toString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">Program ID:</span>
              </p>
              <p className="font-mono text-xs text-layerzero-white break-all">
                {programId.toString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">OFT Store:</span>
              </p>
              <p className="font-mono text-xs text-layerzero-white break-all">
                {oftStore.toString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-layerzero-gray-400">
                <span className="font-medium">Network:</span>
              </p>
              <p className="text-xs text-layerzero-white">
                Solana Devnet
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
