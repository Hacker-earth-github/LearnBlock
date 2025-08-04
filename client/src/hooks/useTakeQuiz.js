// hooks/useTakeQuiz.js
import { useState } from "react";
import { useLearnBlock } from "@/context/LearnBlockContext";

const useTakeQuiz = () => {
  const { contract, address } = useLearnBlock();
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [error, setError] = useState(null);

  const takeQuiz = async (contentId) => {
    if (!contract || !address) {
      setError("Wallet not connected or contract not initialized.");
      return false;
    }

    setIsTakingQuiz(true);
    try {
      const tx = await contract.takeQuiz(contentId, {
        from: address,
        gasLimit: 300000, // Manual gas limit as a workaround
      });
      await tx.wait();
      setError(null);
      return true;
    } catch (err) {
      if (err.code === "CALL_EXCEPTION") {
        setError(`Error taking quiz: ${err.message}. Check if contentId ${contentId} is valid or quiz already taken.`);
      } else {
        setError(`Error taking quiz: ${err.message}`);
      }
      return false;
    } finally {
      setIsTakingQuiz(false);
    }
  };

  return { takeQuiz, isTakingQuiz, error };
};

export default useTakeQuiz;