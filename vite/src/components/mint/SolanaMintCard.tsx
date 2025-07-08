import { useSolanaOft } from "../../hooks/useSolanaOft";

export default function SolanaMintCard() {
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
    isMintTokenInstructionAvailable,
    isChecking,
    checkMintTokenExists,
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

  // Show loading state while checking mintToken availability
  if (wallet.connected && isMintTokenInstructionAvailable === null && isChecking) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-layerzero-gray-800 border border-layerzero-gray-700 rounded-none">
          <p className="text-sm text-layerzero-gray-400 text-center">
            Checking program capabilities...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="mb-4 p-3 bg-layerzero-gray-800 border border-red-400 text-red-400 rounded-none">
          {error}
        </div>
      )}

      {/* Show warning if mintToken is not available */}
      {wallet.connected && isMintTokenInstructionAvailable === false && (
        <div className="mb-4 p-3 bg-layerzero-gray-800 border border-yellow-400 text-yellow-400 rounded-none">
          <p className="text-sm">
            ⚠️ The mintToken method is not available on this program.
          </p>
          <button
            onClick={checkMintTokenExists}
            className="mt-2 text-xs underline hover:no-underline"
          >
            Recheck program capabilities
          </button>
        </div>
      )}

        {/* Wallet-specific functionality */}
        {!wallet.connected ? (
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
                disabled={isMinting || isMintTokenInstructionAvailable === false}
                className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMinting 
                  ? "Minting 1 OFT token..." 
                  : isMintTokenInstructionAvailable === false
                  ? "Mint function not available"
                  : "Mint 1 OFT token"}
              </button>

              <p className="text-xs text-layerzero-gray-500 text-center">
                {isMintTokenInstructionAvailable === false
                  ? "The mintToken method is not supported by this program"
                  : "Using the OFT Program's mock mint function (public)"}
              </p>
            </div>
          </>
        )}
      </div>
  );
} 