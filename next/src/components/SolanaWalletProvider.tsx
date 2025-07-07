import {
  ConnectionProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { FC } from 'react';

type Props = {
  readonly children: React.ReactNode;
};

const endpoint = clusterApiUrl('devnet'); // default to devnet

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      
        {children}
      
    </ConnectionProvider>
  );
};