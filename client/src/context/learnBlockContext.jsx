// LearnBlockContext.jsx
import { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useContractInstance from "../hooks/useContractInstance";
import useRegister from "../hooks/useRegister";

const LearnBlockContext = createContext();

export const LearnBlockProvider = ({ children }) => {
  const { address, isConnected } = useAppKitAccount();
  const { contract, readOnlyContract } = useContractInstance();
  const {
    registerUser,
    checkRegistration,
    getUserProfile,
    getUnredeemedPoints,
    isRegistering,
    isCheckingRegistration,
    registrationError,
    isPendingRegistration,
  } = useRegister();

  const [learnBlocks, setLearnBlocks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isTrustee, setIsTrustee] = useState(false); // New state for trustee status
  const [unredeemedPoints, setUnredeemedPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState({});

  const refreshTimeout = useRef(null);

  // Check if the user is a trustee
  const checkIsTrustee = useCallback(async () => {
    if (!readOnlyContract || !address) return false;
    try {
      const isTrustee = await readOnlyContract.isTrustee(address); // Adjust based on your contract's method
      return isTrustee;
    } catch (error) {
      console.error("Error checking trustee status:", error);
      return false;
    }
  }, [readOnlyContract, address]);

  const getContent = useCallback(
    async (contentId) => {
      if (!readOnlyContract) return null;
      try {
        const content = await readOnlyContract.getContent(contentId);
        return {
          id: contentId,
          title: content.title,
          body: content.body,
          sources: content.sources,
          pointReward: content.pointReward.toString(),
        };
      } catch (error) {
        console.error("Error fetching content:", error);
        return null;
      }
    },
    [readOnlyContract]
  );

  const loadAllContentIds = useCallback(async () => {
    if (!contract) return [];
    const ids = await contract.getAllContentIds();
    const blocks = await Promise.all(
      ids.map(async (id) => {
        const [title, body, sources, pointReward] = await contract.getContent(id.toString());
        return { id: id.toString(), title, body, sources, pointReward };
      })
    );
    setLearnBlocks(blocks);
    return ids;
  }, [contract]);

  const addQuizQuestionToState = useCallback(
    (contentId, questionData) => {
      setQuizQuestions((prev) => ({
        ...prev,
        [contentId]: [
          ...(prev[contentId] || []),
          {
            question: questionData.question,
            options: questionData.options,
            correctAnswer: questionData.correctAnswerIndex,
          },
        ],
      }));
    },
    []
  );

  const getQuizQuestions = useCallback(
    (contentId) => {
      return quizQuestions[contentId] || [];
    },
    [quizQuestions]
  );

  const refreshUserProfile = useCallback(async () => {
    if (!address || !readOnlyContract || isLoading) return;
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);

    setIsLoading(true);
    try {
      const profile = await getUserProfile();
      setUserProfile((prev) => profile || prev || { userId: "0", articlesRead: "0" });
      const points = await getUnredeemedPoints();
      setUnredeemedPoints(points || unredeemedPoints || "0");
      const isRegistered = await checkRegistration();
      setIsUserRegistered(isRegistered);
      const trusteeStatus = await checkIsTrustee();
      setIsTrustee(trusteeStatus);
    } catch (error) {
      console.error("Error in refreshUserProfile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    readOnlyContract,
    getUserProfile,
    getUnredeemedPoints,
    checkRegistration,
    checkIsTrustee,
    isLoading,
    unredeemedPoints,
  ]);

  const handleUserRegistration = useCallback(async () => {
    try {
      const success = await registerUser();
      if (success) {
        await refreshUserProfile();
      }
      return success;
    } catch (error) {
      console.error("Error in handleUserRegistration:", JSON.stringify(error, null, 2));
      return false;
    }
  }, [registerUser, refreshUserProfile]);

  useEffect(() => {
    if (isConnected && address && !isLoading) {
      refreshUserProfile();
    }
  }, [isConnected, address, isLoading, refreshUserProfile]);

  useEffect(() => {
    if (readOnlyContract) {
      loadAllContentIds();
    }
  }, [readOnlyContract, loadAllContentIds]);

  useEffect(() => {
    if (!contract) return;

    const handleContentRegistered = () => {
      loadAllContentIds();
    };
    contract.on("ContentRegistered", handleContentRegistered);

    const articleReadFilter = contract.filters.ArticleRead();
    const quizTakenFilter = contract.filters.QuizTaken();

    const handleArticleRead = (userAddress, contentId) => {
      if (address && userAddress.toLowerCase() === address.toLowerCase()) {
        refreshTimeout.current = setTimeout(refreshUserProfile, 500);
      }
    };

    const handleQuizTaken = (userAddress, contentId, points) => { 
      if (address && userAddress.toLowerCase() === address.toLowerCase()) {
        refreshTimeout.current = setTimeout(refreshUserProfile, 500);
      }
    };

    contract.on(articleReadFilter, handleArticleRead);
    contract.on(quizTakenFilter, handleQuizTaken);

    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
      contract.off("ContentRegistered", handleContentRegistered);
      contract.off(articleReadFilter, handleArticleRead);
      contract.off(quizTakenFilter, handleQuizTaken);
    };
  }, [contract, address, refreshUserProfile, loadAllContentIds, readOnlyContract]);

  const contextValue = {
    learnBlocks,
    userProfile,
    isUserRegistered,
    isTrustee, // Add isTrustee to context
    unredeemedPoints,
    registerUser: handleUserRegistration,
    refreshUserProfile,
    getContent,
    loadAllContentIds,
    addQuizQuestionToState,
    getQuizQuestions,
    isLoading: isLoading || isRegistering || isCheckingRegistration,
    isRegistering,
    isCheckingRegistration,
    registrationError,
    isPendingRegistration,
    address,
    isConnected,
    contract,
    readOnlyContract,
  };

  return (
    <LearnBlockContext.Provider value={contextValue}>
      {children}
    </LearnBlockContext.Provider>
  );
};

export const useLearnBlock = () => {
  const context = useContext(LearnBlockContext);
  if (!context) {
    throw new Error("useLearnBlock must be used within a LearnBlockProvider");
  }
  return context;
};

export default LearnBlockContext;