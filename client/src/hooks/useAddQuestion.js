// hooks/useAddQuizQuestion.js
import { useCallback, useState } from "react";
import { useLearnBlock } from "@/context/learnBlockContext";

const useAddQuizQuestion = () => {
  const { contract } = useLearnBlock();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [error, setError] = useState(null);

  const addQuizQuestion = async ({ contentId, question, options, correctAnswer }) => {
    if (!contract) return false;
    setIsAddingQuestion(true);
    try {
      const tx = await contract.addQuizQuestion(contentId, question, options, correctAnswer);
      await tx.wait();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsAddingQuestion(false);
    }
  };

  return { addQuizQuestion, isAddingQuestion, error };
};

export default useAddQuizQuestion;