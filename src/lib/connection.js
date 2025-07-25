import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";

// 1. Get projectId
const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

const crossFiTestnet = defineChain({
  id: 4157,
  caipNetworkId: "eip155:4157",
  chainNamespace: "eip155",
  name: "CrossFi Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.ms"],
    },
  },
  blockExplorers: {
    default: {
      name: "XFI Scan",
      url: "https://test.xfiscan.com",
    },
  },
  contracts: {
    // Add the contracts here
  },
});
// 2. Set the networks
const networks = [crossFiTestnet];

const metadata = {
  name: "Learn-Block",
  description: "Official Website of Learn-Block",
  url: "https://www.earthfi.xyz",

};

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  chainImages: {
    [crossFiTestnet.id]:
      "https://s2.coinmarketcap.com/static/img/coins/64x64/26202.png",
  },
  metadata,
  projectId,
  allWallets: "SHOW",
    wallets: ["metamask", "walletConnect"],
  defaultNetwork: crossFiTestnet,
  enableEIP6963: true,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#F29F05",
    "--w3m-border-radius-master": "1px",
  },
  features: {
    analytics: true,
    legalCheckbox: true,
  },
});