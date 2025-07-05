import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaConnect: FC = () => {
  const { connected } = useWallet();

  return (
    <WalletModalProvider>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
            }
          `}
        </style>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {connected ? "Solana Wallet Connected" : "Solana Wallet"}
        </h2>
        <div className="wallet-buttons-container flex items-center gap-4 flex-wrap">
          <WalletMultiButton />
          {connected && <WalletDisconnectButton />}
        </div>

      </div>
    </WalletModalProvider>
  );
};
