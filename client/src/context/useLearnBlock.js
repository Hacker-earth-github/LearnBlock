import { useContext } from "react";
import { LearnBlockContext } from "./learnBlockContext";

export const useLearnBlock = () => {
  const context = useContext(LearnBlockContext);
  if (!context) {
    throw new Error("useLearnBlock must be used within a LearnBlockProvider");
  }
  return context;
}; 