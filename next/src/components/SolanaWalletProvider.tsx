import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { FC } from 'react';

type Props = {
  readonly children: React.ReactNode;
};

const endpoint = clusterApiUrl('devnet');

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={true}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};