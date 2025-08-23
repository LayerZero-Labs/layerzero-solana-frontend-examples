import { useSolanaToEvm } from '../../../hooks/useSolanaToEvm'
import { MessageStatusDisplay } from '../../MessageStatusDisplay'
import { FilePathDisplay } from '../../FilePathDisplay'

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
    isQuoting,
    sendState,
    onClickQuote,
    onClickSend,
  } = useSolanaToEvm()

  if (!isClient) return null; // Prevent rendering mismatched content

  return (
    <div className="space-y-4 mb-6">
      <FilePathDisplay text="/vite/src/components/send/solana/SolanaToEvmCard.tsx" />
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
            disabled={sendState.isLoading || isQuoting}
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
            placeholder={`Enter ${getNetworkName(chainId)} address`}
            disabled={sendState.isLoading || isQuoting}
          />
        </div>
      </div>

      <button 
        onClick={onClickSend}
        className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!wallet.connected || !wallet.publicKey || !amount || !recipientAddress || sendState.isLoading || isQuoting}
      >
        {sendState.isLoading ? "Sending..." : 
         isQuoting ? "Getting quote..." : 
         `Send ${amount} Tokens`}
      </button>

      <p className="text-xs text-layerzero-gray-500 text-center">
        The send button will trigger a call to quote, so it's not necessary for you to manually call quote via the Get Quote button. It is there purely for demonstration purposes.
      </p>

      <button 
        onClick={onClickQuote}
        className="w-full lz-button disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!wallet.connected || !wallet.publicKey || !amount || !recipientAddress || sendState.isLoading || isQuoting}
      >
        {isQuoting ? "Getting Quote..." : "Get Quote"}
      </button>

      {!recipientAddress && (
        <div className="p-3 bg-layerzero-gray-800 border border-yellow-400 rounded-none">
          <p className="text-sm text-yellow-400">
            Please enter a recipient address for the destination network.
          </p>
        </div>
      )}

      {isQuoting && (
        <div className="p-3 bg-layerzero-gray-800 border border-blue-400 rounded-none">
          <p className="text-sm text-blue-400">
            <span className="font-medium">Getting quote...</span> Please wait while we fetch the cross-chain fee.
          </p>
        </div>
      )}

      {nativeFee !== null && !isQuoting && (
        <div className="p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
          <p className="text-sm text-green-400">
            <span className="font-medium">Quote Result (Native Fee):</span> {nativeFee.toString()} lamports
          </p>
        </div>
      )}

      {sendState.error && (
        <div className="p-3 bg-layerzero-gray-800 border border-red-400 rounded-none">
          <p className="text-sm text-red-400">
            <span className="font-medium">Error:</span> {sendState.error}
          </p>
        </div>
      )}

      {sendState.txHash && (
        <div className="space-y-4">
          <div className="p-4 bg-layerzero-gray-800 border border-green-400 rounded-none">
            <p className="text-sm text-green-400 flex items-start gap-2">
              <span className="font-medium">Transaction Hash:</span>
              <span
                className="font-mono text-xs ml-2 break-all select-all bg-layerzero-gray-900 px-1 py-0.5 rounded cursor-pointer"
                title="Click to copy"
                onClick={() => {
                  navigator.clipboard.writeText(sendState.txHash!);
                }}
              >
                {sendState.txHash}
              </span>
              <button
                className="ml-2 px-2 py-0.5 text-xs bg-layerzero-gray-700 text-green-400 border border-green-400 rounded hover:bg-green-400 hover:text-layerzero-gray-900 transition-colors"
                onClick={() => navigator.clipboard.writeText(sendState.txHash!)}
                title="Copy hash to clipboard"
              >
                Copy
              </button>
            </p>
            <div className="flex gap-4 mt-2">
              <a 
                href={`https://solscan.io/tx/${sendState.txHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-400 underline hover:no-underline"
              >
                View on Solscan
              </a>
              <a 
                href={`https://testnet.layerzeroscan.com/tx/${sendState.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-400 underline hover:no-underline"
              >
                View on LayerZero Scan
              </a>
            </div>
          </div>
          
          <MessageStatusDisplay 
            txHash={sendState.txHash}
            environment="TESTNET"
          />
        </div>
      )}
    </div>
  );
}
