import axios from 'axios';
import { create } from 'zustand';
import { provider, signer } from '../initializers/ether';
import { SiweMessage } from 'siwe';

const authStore = create((set) => ({
  address: '',
  loggedIn: false,
  ready: false,
  init: async () => {
    try {
      const res = await axios.get('/api/validate');
      set({ address: res.data.address, loggedIn: true, ready: true });
    } catch (err) {
      const accounts = await provider.listAccounts();
      if (accounts[0]) {
        set({ ready: true, address: accounts[0] });
      } else {
        set({ ready: true });
      }
    }
  },
  connectWallet: async () => {
    const accounts = await provider
      .send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'));
    if (accounts[0]) {
      set({ address: accounts[0] });
    }
  },
  signin: async () => {
    try {
      const res = await axios.get('/api/nonce');
      const messageRaw = new SiweMessage({
        domain: window.location.host,
        address: await signer.getAddress(),
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce: res.data,
      });
      const message = messageRaw.prepareMessage();
      const signature = await signer.signMessage(message);
      await axios.post('/api/verify', { message, signature });
      set({ loggedIn: true });
    } catch (err) {
      console.error('Signin error:', err);
    }
  },
}));

export default authStore;
