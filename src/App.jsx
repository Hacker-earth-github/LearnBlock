import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';

import { WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './frontend/pages/Home';
import Login from './frontend/pages/Login';
import RequireAuth from './frontend/components/RequireAuth';
import authStore from './frontend/stores/authStore';
import axios from 'axios';

axios.defaults.withCredentials = true;

const crossFiTestnet = defineChain({
  id: 4157,
  caipNetworkId: 'eip155:4157',
  chainNamespace: 'eip155',
  name: 'CrossFi Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XFI',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.crossfi.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'XFI Scan',
      url: 'https://test.xfiscan.com',
    },
  },
  contracts: {},
});



const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [crossFiTestnet],
  projectId,
  metadata: {
    name: 'LearnBlock',
    description: 'Official Website of LearnBlock',
    url: 'https://www.learnblock.xyz',
  },
  chainImages: {
    [crossFiTestnet.id]: 'https://s2.coinmarketcap.com/static/img/coins/64x64/26202.png',
  },
  allWallets: 'SHOW',
  defaultNetwork: crossFiTestnet,
  enableEIP6963: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#F29F05',
    '--w3m-border-radius-master': '1px',
  },
  features: {
    analytics: true,
    legalCheckbox: true,
  },
});

const config = getDefaultConfig({
  appName: 'LearnBlock',
  projectId,
  chains: [crossFiTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

function App() {
  const s = authStore();

  useEffect(() => {
    s.init();
  }, []);

  if (!s.ready) return <div>Loading...</div>;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[crossFiTestnet]}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route index element={<RequireAuth element={<Home />} />} />
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const rootNode = document.getElementById('app');
if (rootNode) {
  const root = ReactDOM.createRoot(rootNode);
  root.render(<App />);
}

export default App;
