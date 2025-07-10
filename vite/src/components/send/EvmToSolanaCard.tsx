import { useEvmToSolana } from '../../hooks/useEvmToSolana'
import { MessageStatusDisplay } from '../MessageStatusDisplay'

export default function EvmToSolanaCard({ networkName, isWrongNetwork }: { networkName: string, isWrongNetwork: boolean }) {
  
  const {
    isConnected,
    amount,
    setAmount,
    recipientAddress,
    setRecipientAddress,
    formattedQuoteFee,
    isQuoting,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    getQuote,
    handleSwitchNetwork,
    sendTokens,
  } = useEvmToSolana()

  if (!isConnected) {
    return (
      <p className="text-layerzero-gray-400">
        Please connect your {networkName} wallet to use this feature.
      </p>
    )
  }

  return (
    <div className="space-y-4 mb-6">
      {error && (
        <div className="p-3 bg-layerzero-gray-800 border border-red-400 text-red-400 rounded-none">
          {error}
        </div>
      )}
      
      {isWrongNetwork && (
        <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">
                Wrong Network
              </p>
              <p className="text-xs text-layerzero-gray-400 mt-1">
                Please switch to {networkName} to send tokens
              </p>
            </div>
            <button
              onClick={handleSwitchNetwork}
              className="lz-button text-xs py-2 px-3"
            >
              Switch Network
            </button>
          </div>
        </div>
      )}

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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-layerzero-white mb-2">
            Recipient Address (Solana)
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="lz-input w-full"
            placeholder="Enter Solana address"
          />
        </div>
      </div>

      <button
        onClick={sendTokens}
        disabled={isWrongNetwork || !amount || !recipientAddress || isPending || isConfirming || isQuoting}
        className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isWrongNetwork ? `Switch to ${networkName}` : 
         isPending ? 'Confirming...' : 
         isConfirming ? 'Sending...' : 
         isQuoting ? 'Getting quote...' :
         `Send ${amount} Tokens`}
      </button>

      <p className="text-xs text-layerzero-gray-500 text-center">
        The send button will trigger a call to quote, so it's not necessary for you to manually call quote via the Get Quote button. It is there purely for demonstration purposes.
      </p>

      <button
        onClick={getQuote}
        disabled={isWrongNetwork || isQuoting || !amount || !recipientAddress}
        className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isWrongNetwork ? 'Wrong Network' : isQuoting ? 'Getting Quote...' : 'Get Quote'}
      </button>

      {formattedQuoteFee && (
        <div className="p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
          <p className="text-sm text-green-400">
            <span className="font-medium">Quote Result (Native Fee):</span> {formattedQuoteFee} ETH
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="space-y-4">
          <div className="p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
            <p className="text-sm text-green-400 flex items-start gap-2">
              <span className="font-medium">Transaction Hash:</span>
              {hash && (
                <span
                  className="font-mono text-xs ml-2 break-all select-all bg-layerzero-gray-900 px-1 py-0.5 rounded cursor-pointer"
                  title="Click to copy"
                  onClick={() => {
                    navigator.clipboard.writeText(hash);
                  }}
                >
                  {hash}
                </span>
              )}
              {hash && (
                <button
                  className="ml-2 px-2 py-0.5 text-xs bg-layerzero-gray-700 text-green-400 border border-green-400 rounded hover:bg-green-400 hover:text-layerzero-gray-900 transition-colors"
                  onClick={() => navigator.clipboard.writeText(hash)}
                  title="Copy hash to clipboard"
                >
                  Copy
                </button>
              )}
            </p>
            {hash && (
              <div className="flex gap-4 mt-2">
                <a 
                  href={`https://optimism-sepolia.blockscout.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 underline hover:no-underline"
                >
                  View on {networkName} Explorer
                </a>
                <a 
                  href={`https://testnet.layerzeroscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-400 underline hover:no-underline"
                >
                  View on LayerZero Scan
                </a>
              </div>
            )}
          </div>
          
          {/* Cross-Chain Message Status */}
          {hash && (
            <MessageStatusDisplay 
              txHash={hash}
              environment="TESTNET"
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  )
} 