import { useLayerZeroMessageStatus } from '../hooks/useLayerZeroMessageStatus';
import { LAYERZERO_SCAN_CONFIG } from '../config/contracts';
import { LayerZeroMessage } from '../utils/layerzero-scan';

interface MessageStatusDisplayProps {
  txHash?: string;
  environment?: 'MAINNET' | 'TESTNET';
  className?: string;
}

export function MessageStatusDisplay({ 
  txHash, 
  environment = 'TESTNET',
  className = ''
}: MessageStatusDisplayProps) {
  const { message, isLoading, error, status } = useLayerZeroMessageStatus({
    txHash,
    environment,
    enablePolling: true,
    pollingInterval: 3000
  });

  if (!txHash) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'SUCCEEDED':
        return 'text-green-400 border-green-400';
      case 'FAILED':
        return 'text-red-400 border-red-400';
      case 'INFLIGHT':
        return 'text-blue-400 border-blue-400';
      case 'INDEXING':
        return 'text-blue-400 border-blue-400';
      case 'PENDING':
        return 'text-yellow-400 border-yellow-400';
      case 'LOADING':
        return 'text-blue-400 border-blue-400';
      case 'ERROR':
        return 'text-red-400 border-red-400';
      case 'NOT_FOUND':
        return 'text-gray-400 border-gray-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'LOADING':
        return 'Searching for message...';
      case 'INDEXING':
        return 'Indexing cross-chain message...';
      case 'INFLIGHT':
        return 'Processing cross-chain message...';
      case 'PENDING':
        return 'Message pending';
      case 'DELIVERED':
        return 'Message delivered successfully';
      case 'SUCCEEDED':
        return 'Transaction completed';
      case 'FAILED':
        return 'Message failed';
      case 'ERROR':
        return 'Error checking status';
      case 'NOT_FOUND':
        return 'Message not found';
      default:
        return status;
    }
  };

  const getDvnStatus = (message: LayerZeroMessage) => {
    if (!message?.verification?.dvn?.status) {
      return 'WAITING';
    }
    return message.verification.dvn.status === 'SUCCEEDED' ? 'VERIFIED' : 'WAITING';
  };

  const getDvnStatusColor = (dvnStatus: string) => {
    switch (dvnStatus) {
      case 'VERIFIED':
        return 'text-green-400';
      case 'WAITING':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const dvnStatus = message ? getDvnStatus(message) : 'WAITING';
  const dvnStatusColor = getDvnStatusColor(dvnStatus);

  const explorerUrl = LAYERZERO_SCAN_CONFIG[environment].explorerUrl;

  // Map chain names to their explorer URLs
  const getChainExplorerUrl = (chainName: string, txHash: string) => {
    switch (chainName) {
      case 'solana-testnet':
        return `https://solscan.io/tx/${txHash}?cluster=testnet`;
      case 'solana-mainnet':
        return `https://solscan.io/tx/${txHash}`;
      case 'optimism-sepolia':
        return `https://sepolia-optimism.etherscan.io/tx/${txHash}`;
      case 'optimism-mainnet':
        return `https://optimistic.etherscan.io/tx/${txHash}`;
      case 'ethereum-sepolia':
        return `https://sepolia.etherscan.io/tx/${txHash}`;
      case 'ethereum-mainnet':
        return `https://etherscan.io/tx/${txHash}`;
      case 'arbitrum-sepolia':
        return `https://sepolia.arbiscan.io/tx/${txHash}`;
      case 'arbitrum-mainnet':
        return `https://arbiscan.io/tx/${txHash}`;
      case 'base-sepolia':
        return `https://sepolia.basescan.org/tx/${txHash}`;
      case 'base-mainnet':
        return `https://basescan.org/tx/${txHash}`;
      default:
        return `https://solscan.io/tx/${txHash}?cluster=testnet`; // fallback
    }
  };

  const destinationChain = message?.pathway?.receiver?.chain;
  const destinationTxHash = message?.destination?.tx?.txHash;
  const destinationExplorerUrl = destinationChain && destinationTxHash 
    ? getChainExplorerUrl(destinationChain, destinationTxHash)
    : null;

  return (
    <div className={`p-4 bg-layerzero-gray-800 border rounded-none ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-layerzero-white">
          Cross-Chain Message Status
        </h3>
        {(isLoading || status === 'INDEXING') && !message && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <span className="text-xs text-gray-400">
              {status === 'INDEXING' ? 'Indexing...' : 'Loading...'}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-400 mb-2">
          Error: {error}
        </div>
      )}

      <div className="space-y-2">
        <div className={`inline-flex items-center px-2 py-1 rounded border ${getStatusColor(status)}`}>
          <span className="text-xs font-medium">
            {status}
          </span>
          {(status === 'LOADING' || status === 'INDEXING' || status === 'INFLIGHT' || status === 'PENDING') && (
            <div className="ml-2 animate-pulse">
              <div className="w-2 h-2 bg-current rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          {getStatusDisplay(status)}
        </div>

        {/* DVN Verification Status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">DVN Verification:</span>
          <span className={`font-medium ${dvnStatusColor}`}>
            {dvnStatus}
          </span>
          {dvnStatus === 'WAITING' && (
            <div className="animate-pulse">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
          )}
        </div>

        {message && message.destination.tx?.txHash && (
          <div className="text-xs text-gray-400">
            <span className="font-medium">Destination Tx ({destinationChain}):</span>
            <span className="font-mono ml-1">{message.destination.tx.txHash.slice(0, 10)}...{message.destination.tx.txHash.slice(-8)}</span>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <a 
            href={`${explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 underline hover:no-underline"
          >
            View on LayerZero Scan
          </a>
          {destinationExplorerUrl && (
            <a 
              href={destinationExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 underline hover:no-underline"
            >
              View Destination Txn
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 