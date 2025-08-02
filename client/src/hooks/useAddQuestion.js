import { useCallback, useState } from "react";
import { parseUnits } from "ethers"; // For ethers v6
import { useLearnBlock } from "@/context/LearnBlockContext";
import { toast } from "react-toastify";

const useAddQuizQuestion = () => {
  const { contract, readOnlyContract, addQuizQuestionToState } = useLearnBlock();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [error, setError] = useState(null);

  const addQuizQuestion = useCallback(
    async (questionData) => {
      if (!contract) {
        setError("Contract instance not available");
        toast.error("Smart contract not initialized.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      if (!questionData.contentId || questionData.options.length < 2 || questionData.correctAnswer >= questionData.options.length) {
        setError("Invalid question data: Check content ID, options, or correct answer index.");
        toast.error("Invalid question data. Ensure content ID is valid, at least 2 options are provided, and correct answer index is valid.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      setIsAddingQuestion(true);
      setError(null);

      try {
        // Validate contentId exists
        console.log("Validating contentId:", questionData.contentId);
        const content = await readOnlyContract.getContent(questionData.contentId);
        console.log("Content fetched:", content);
        if (!content.exists) {
          throw new Error("Content not found");
        }

        // Prepare transaction data
        console.log("Submitting transaction with data:", questionData);
        const tx = await contract.addQuizQuestion(
          questionData.contentId,
          questionData.question,
          questionData.options,
          parseUnits(questionData.correctAnswer.toString(), 0)
        );

        // Wait for transaction to be mined
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Transaction mined");

        // Store question in context
        addQuizQuestionToState(questionData.contentId, {
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
        });

        toast.success("Quiz question added successfully!", {
          position: "top-right",
          autoClose: 5000,
        });

        return true;
      } catch (err) {
        console.error("Error adding quiz question:", {
          message: err.message,
          reason: err.reason,
          code: err.code,
          data: err.data,
        });
        const errorMsg = err.reason || "Failed to add quiz question. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsAddingQuestion(false);
      }
    },
    [contract, readOnlyContract, addQuizQuestionToState]
  );

  return { addQuizQuestion, isAddingQuestion, error };
};

export default useAddQuizQuestion;