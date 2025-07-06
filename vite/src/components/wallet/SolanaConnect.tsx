import { FC } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaConnect: FC = () => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  // Get cluster info from the connection endpoint
  const getClusterName = (endpoint: string) => {
    if (endpoint.includes('devnet')) return 'Devnet';
    if (endpoint.includes('testnet')) return 'Testnet';
    if (endpoint.includes('mainnet')) return 'Mainnet';
    return 'Custom';
  };

  const clusterName = getClusterName(connection.rpcEndpoint);

  return (
    <WalletModalProvider>
      <div className="bg-layerzero-gray-900 border border-layerzero-gray-800 rounded-none p-6">
        <style>
          {`
            .wallet-buttons-container {
              display: flex !important;
              align-items: center !important;
              gap: 1rem !important;
              flex-wrap: wrap !important;
            }
            .wallet-buttons-container > * {
              display: inline-flex !important;
              margin: 0 !important;
            }
            .wallet-adapter-button {
              display: inline-flex !important;
              margin: 0 !important;
              background-color: #000000 !important;
              border: 1px solid #FFFFFF !important;
              color: #FFFFFF !important;
              border-radius: 0 !important;
              padding: 0.75rem 1.5rem !important;
              font-size: 0.875rem !important;
              font-weight: 500 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              transition: all 0.2s ease !important;
            }
            .wallet-adapter-button:hover {
              background-color: #FFFFFF !important;
              color: #000000 !important;
            }
            .wallet-adapter-button:disabled {
              opacity: 0.5 !important;
              cursor: not-allowed !important;
            }
          `}
        </style>
        <h2 className="text-xl font-medium text-layerzero-white mb-4">
          {connected ? "Solana Wallet Connected" : "Solana Wallet"}
        </h2>
        
        {connected ? (
          <div className="space-y-3">
            <div className="text-sm text-layerzero-gray-400">
              <span className="font-medium">Address:</span> {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}
            </div>
            <div className="text-sm">
              <span className="font-medium text-layerzero-gray-400">Cluster:</span>{' '}
              <span className="font-medium text-blue-400">
                {clusterName}
              </span>
            </div>
            <div className="wallet-buttons-container flex items-center gap-4 flex-wrap">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
          </div>
        ) : (
          <div className="wallet-buttons-container flex items-center gap-4 flex-wrap">
            <WalletMultiButton />
          </div>
        )}
      </div>
    </WalletModalProvider>
  );
};
