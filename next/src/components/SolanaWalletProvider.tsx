import { Adapter } from '@solana/wallet-adapter-base';
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { FC } from 'react';

type Props = {
  readonly children: React.ReactNode;
};

const endpoint = clusterApiUrl('devnet'); // default to devnet

const wallets: Adapter[] = [];

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};