import { useCallback, useState } from "react";
import { parseUnits } from "ethers"; // For ethers v6
import { useLearnBlock } from "@/context/LearnBlockContext";
import { toast } from "react-toastify";

const useTakeQuiz = () => {
  const { contract, address, isConnected, refreshUserProfile } = useLearnBlock();
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [error, setError] = useState(null);

  const takeQuiz = useCallback(
    async (contentId) => {
      if (!isConnected || !address) {
        setError("Wallet not connected");
        toast.error("Please connect your wallet to take the quiz.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      if (!contract) {
        setError("Contract not initialized");
        toast.error("Smart contract not initialized.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      setIsTakingQuiz(true);
      setError(null);

      try {
        const tx = await contract.takeQuiz(parseUnits(contentId.toString(), 0));
        await tx.wait();
        toast.success("Quiz completed successfully! Points claimed.", {
          position: "top-right",
          autoClose: 5000,
        });
        await refreshUserProfile();
        return true;
      } catch (error) {
        console.error("Error taking quiz:", error);
        const errorMsg = error.reason || "Failed to complete quiz. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsTakingQuiz(false);
      }
    },
    [contract, address, isConnected, refreshUserProfile]
  );

  return { takeQuiz, isTakingQuiz, error };
};

export default useTakeQuiz;