"use client";
import { useSolanaToEvm } from '../../hooks/useSolanaToEvm'

export default function SolanaToEvmCard() {
  const {
    isClient,
    wallet,
    chainId,
    getNetworkName,
    amount,
    setAmount,
    recipientAddress,
    setRecipientAddress,
    nativeFee,
    sendState,
    onClickQuote,
    onClickSend,
  } = useSolanaToEvm()

  if (!isClient) return null; // Prevent rendering mismatched content

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-layerzero-white mb-2">
              Amount to Send
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              className="lz-input w-full"
              placeholder="Enter amount"
              disabled={sendState.isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-layerzero-white mb-2">
              Recipient Address ({getNetworkName(chainId)})
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="lz-input w-full"
              placeholder="Enter Ethereum address"
              disabled={sendState.isLoading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onClickQuote}
          className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!wallet.connected || !wallet.publicKey || !amount || !recipientAddress || sendState.isLoading}
        >
          Get Quote
        </button>

        {nativeFee !== null && (
          <button 
            onClick={onClickSend}
            className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!wallet.connected || !wallet.publicKey || !amount || !recipientAddress || sendState.isLoading || nativeFee === null}
          >
            {sendState.isLoading ? "Sending..." : "Send OFT"}
          </button>
        )}
      </div>

      {!recipientAddress && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
          <p className="text-sm text-yellow-400">
            Please enter a recipient address for the destination network.
          </p>
        </div>
      )}

      {nativeFee !== null && (
        <div className="mt-6 p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
          <p className="text-sm text-green-400">
            <span className="font-medium">Quote Result (Native Fee):</span> {nativeFee.toString()}
          </p>
        </div>
      )}

      {sendState.error && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-red-400 rounded-none">
          <p className="text-sm text-red-400">
            <span className="font-medium">Error:</span> {sendState.error}
          </p>
        </div>
      )}

      {sendState.txHash && (
        <div className="mt-4 p-3 bg-layerzero-gray-800 border border-blue-400 rounded-none">
          <p className="text-sm text-blue-400">
            <span className="font-medium">Transaction Hash:</span> 
            <span className="font-mono text-xs ml-2">{sendState.txHash}</span>
          </p>
          <div className="flex gap-4 mt-2">
            <a 
              href={`https://solscan.io/tx/${sendState.txHash}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline hover:no-underline"
            >
              View on Solscan
            </a>
            <a 
              href={`https://testnet.layerzeroscan.com/tx/${sendState.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 underline hover:no-underline"
            >
              View on LayerZero Scan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
