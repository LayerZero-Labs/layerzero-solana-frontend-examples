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

        {/* Wallet-specific functionality */}
        {!wallet ? (
          <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
            <p className="text-sm text-layerzero-gray-400 text-center">
              Connect your Solana wallet to view balance and mint tokens
            </p>
          </div>
        ) : (
          <>
            {/* Balance section - Only when wallet connected */}
            <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
              <h4 className="font-medium text-layerzero-white mb-2">
                Your Balance
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
            </div>

            {/* Mint functionality - Only when wallet connected */}
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
          </>
        )}
      </div>
    </div>
  );
}
