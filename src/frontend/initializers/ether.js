import { BrowserProvider } from 'ethers';

export const provider = new BrowserProvider(window.ethereum);
export const signer = await provider.getSigner();
