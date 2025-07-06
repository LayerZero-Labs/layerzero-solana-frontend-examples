import { useSolanaOft } from "../hooks/useSolanaOft";

export default function SolanaOftCard() {
  const {
    wallet,
    balance,
    isLoadingBalance,
    isMinting,
    error,
    tokenMint,
    programId,
    oftStore,
    fetchBalance,
    handleMint,
  } = useSolanaOft();

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  if (!tokenMint || !programId || !oftStore) {
    return (
      <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
        <h3 className="text-lg font-medium text-layerzero-white mb-4">
          Solana OFT
        </h3>
        <p className="text-sm text-layerzero-gray-400">
          Loading contract configuration...
        </p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
        <h3 className="text-lg font-medium text-layerzero-white mb-4">
          Solana OFT
        </h3>
        <p className="text-sm text-layerzero-gray-400">
          Connect your wallet to view and mint OFT tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
      <h3 className="text-lg font-medium text-layerzero-white mb-4">
        Solana OFT
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-layerzero-gray-800 border border-red-400 text-red-400 rounded-none">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <h4 className="font-medium text-layerzero-white mb-2">
            Balance
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-layerzero-white">
              {isLoadingBalance
                ? "Loading..."
                : `${balance.uiAmount.toLocaleString()} OFT`}
            </p>
            <button
              onClick={fetchBalance}
              disabled={isLoadingBalance}
              className="lz-button text-xs py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingBalance ? "Loading..." : "Refresh"}
            </button>
          </div>
          <p className="text-sm text-layerzero-gray-400 mt-1">
            <span className="font-medium">Mint:</span>
            <span className="font-mono text-xs ml-1">{tokenMint.toString()}</span>
          </p>
          {oftStore && (
            <p className="text-sm text-layerzero-gray-400 mt-1">
              <span className="font-medium">OFT Store:</span>
              <span className="font-mono text-xs ml-1">{oftStore.toString()}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleMint}
            disabled={isMinting}
            className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? "Minting OFT Tokens..." : "Mint OFT Tokens"}
          </button>

          <p className="text-xs text-layerzero-gray-500 text-center">
            Using the OFT Program's mock mint function (public)
          </p>
        </div>
      </div>
    </div>
  );
}
