import { useMemo } from "react";
import useSignerOrProvider from "./useSignerOrProvider";
import { Contract } from "ethers";
import ABI from "../ABI/learnBlock.json"

const useContractInstance = () => {
  const { signer, readOnlyProvider } = useSignerOrProvider();

  const contract = useMemo(() => {
      if (!signer) {
          console.warn("Signer not available, returning null for writeable contract");
          return null;
      }
      return new Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          ABI,
          signer
      );
  }, [signer]);

  const readOnlyContract = useMemo(() => {
      if (!readOnlyProvider) {
          console.warn("readOnlyProvider not available, returning null for read-only contract");
          return null;
      }
      return new Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          ABI,
          readOnlyProvider
      );
  }, [readOnlyProvider]);

  return { contract, readOnlyContract };
};

export default useContractInstance;