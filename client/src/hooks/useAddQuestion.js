import { useState } from "react";
import { useLearnBlock } from "@/context/LearnBlockContext";

const useAddQuizQuestion = () => {
  const { contract } = useLearnBlock();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [error, setError] = useState(null);

  const addQuizQuestion = async ({ contentId, question, options, correctAnswer }) => {
    if (!contract) {
      setError("Contract not initialized");
      return false;
    }
    try {
      setIsAddingQuestion(true);
      setError(null);
      console.log("Adding quiz question:", { contentId, question, options, correctAnswer });
      const tx = await contract.addQuizQuestion(contentId, question, options, correctAnswer);
      await tx.wait();
      return true;
    } catch (err) {
      console.error("Error adding quiz question:", err);
      setError(err.message || "Failed to add quiz question");
      return false;
    } finally {
      setIsAddingQuestion(false);
    }
  };

  return { addQuizQuestion, isAddingQuestion, error };
};

export default useAddQuizQuestion;