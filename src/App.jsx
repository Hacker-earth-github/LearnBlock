import  { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, sepolia, arbitrum } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './frontend/pages/Home';
import Login from './frontend/pages/Login';
import RequireAuth from './frontend/components/RequireAuth';
import authStore from './frontend/stores/authStore';
import axios from 'axios';

axios.defaults.withCredentials = true;

const config = getDefaultConfig({
  appName: 'My Web3 App',
  projectId: '2b5ac9e72b96320ef9d258088933cabe',
  chains: [mainnet, sepolia, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
  },
  ssr: true,
});

const wagmiAdapter = new WagmiAdapter({
  projectId: '2b5ac9e72b96320ef9d258088933cabe',
  networks: [mainnet, arbitrum],
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  projectId: '2b5ac9e72b96320ef9d258088933cabe',
  features: {
    analytics: true,
  },
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
        <RainbowKitProvider chains={[mainnet, sepolia, arbitrum]}>
      
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
