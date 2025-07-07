import { useEvmToSolana } from '../../hooks/useEvmToSolana'
import { MessageStatusDisplay } from '../MessageStatusDisplay'

export default function EvmToSolanaCard() {
  const {
    isConnected,
    isCorrectNetwork,
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
        Please connect your Ethereum wallet to use this feature.
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
      
      {!isCorrectNetwork && (
        <div className="p-4 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-400">
                Wrong Network
              </p>
              <p className="text-xs text-layerzero-gray-400 mt-1">
                Please switch to OP Sepolia to send tokens
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

      <div className="flex gap-3">
        <button
          onClick={getQuote}
          disabled={!isCorrectNetwork || isQuoting || !amount || !recipientAddress}
          className="flex-1 lz-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isCorrectNetwork ? 'Wrong Network' : isQuoting ? 'Getting Quote...' : 'Get Quote'}
        </button>

        <button
          onClick={sendTokens}
          disabled={!isCorrectNetwork || !formattedQuoteFee || isPending || isConfirming}
          className="flex-1 lz-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isCorrectNetwork ? 'Switch to OP Sepolia' : 
           isPending ? 'Confirming...' : 
           isConfirming ? 'Sending...' : 
           `Send ${amount} Tokens`}
        </button>
      </div>

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
            <p className="text-sm text-green-400">
              <span className="font-medium">Transaction Hash:</span>
              {hash && (
                <span className="font-mono text-xs ml-2">{hash}</span>
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
                  View on OP Sepolia Explorer
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