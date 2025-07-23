import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import {SwitchToCrossFi} from "../../SwitchToCrossFi";
const Home = () => {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-800 to-black text-white px-6 py-12 relative">
      {/* Top-right Connect Button when connected */}
      {isConnected && (
        <div className="absolute top-4 right-6 z-50">
          <ConnectButton />
        </div>
      )}

  <h1>Welcome to my CrossFi App!</h1>
      <SwitchToCrossFi />
      {/* Centered hero section */}
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Learn & Earn with Web3
        </h1>
        <p className="text-lg md:text-xl mb-8 font-light">
          Connect your wallet to start reading, earning tokens, and minting NFTs.
        </p>

        {/* Connect Button centered only if NOT connected */}
        {!isConnected && (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        )}

        {/* Show 'Visit Articles' if connected */}
        {isConnected && (
          <Link to="/articles" className="mt-8">
     <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-6 py-3 rounded-xl shadow-md transition duration-200">
  🚀 Visit Articles
</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
