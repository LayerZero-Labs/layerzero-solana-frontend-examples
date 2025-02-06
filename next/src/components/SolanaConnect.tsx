import { FC } from "react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaConnect: FC = () => {
  return (
    <WalletModalProvider>
      <div className="flex gap-4">
        <WalletMultiButton />

        <WalletDisconnectButton />
      </div>
    </WalletModalProvider>
  );
};
