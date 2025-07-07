import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { FC } from 'react';

type Props = {
  readonly children: React.ReactNode;
};

// Use environment variable or default to devnet to match contract deployment
const endpoint = import.meta.env.VITE_SOLANA_RPC_ENDPOINT || clusterApiUrl('devnet');

const wallets = [];

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};