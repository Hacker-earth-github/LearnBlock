import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';

// 1. Define CrossFi Testnet
const crossfiTestnet = defineChain({
  id: 4157,
  caipNetworkId: 'eip155:4157',
  chainNamespace: 'eip155',
  name: 'CrossFi Testnet',
  nativeCurrency: {
    name: 'XFI',
    symbol: 'XFI',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.ms'],
    },
  },
});

// 2. Get projectId
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// 3. Set the networks
const networks = [crossfiTestnet];

// 4. Create a metadata object - optional
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 5. Create an AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  themeVariables: {
    '--w3m-accent': '#d97706',
    '--w3m-border-radius-master': '1px',
  },
  features: {
    analytics: true,
  },
  // siweConfig: siweConfig,
});