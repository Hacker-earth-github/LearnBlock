import React from 'react';
import { crossfiTestnet } from './chains/switchToCrossfi'; // ✅ matches your filename
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [crossfiTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'MindConnect',
  projectId: 'YOUR_PROJECT_ID', // Replace with real WalletConnect project ID
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const Wagmi = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Wagmi;
