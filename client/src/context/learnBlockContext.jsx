import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
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
    getUserBadgeIds,
    getUserCompletedContent,
    isRegistering,
    isCheckingRegistration,
    registrationError,
    isPendingRegistration,
  } = useRegister();

  // State with persistence
  const [learnBlocks, setLearnBlocks] = useState([]);
  const [allContentIds, setAllContentIds] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userBadgeIds, setUserBadgeIds] = useState([]);
  const [completedContent, setCompletedContent] = useState([]);
  const [unredeemedPoints, setUnredeemedPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState({});

  // Debounce ref
  const refreshTimeout = useRef(null);

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
    if (!readOnlyContract) return;
    try {
      const ids = await readOnlyContract.getAllContentIds();
      const contentIds = ids.map((id) => id.toString());
      setAllContentIds(contentIds);
      const contentPromises = contentIds.map(async (id) => {
        const content = await getContent(id);
        return content ? { id, ...content } : null;
      });
      const contents = await Promise.all(contentPromises);
      setLearnBlocks(contents.filter((content) => content !== null));
    } catch (error) {
      console.error("Error loading content IDs:", error);
    }
  }, [readOnlyContract, getContent]);

  const addQuizQuestionToState = useCallback(
    (contentId, questionData) => {
      setQuizQuestions((prev) => ({
        ...prev,
        [contentId]: [...(prev[contentId] || []), {
          question: questionData.question,
          options: questionData.options,
          correctAnswer: questionData.correctAnswerIndex,
        }],
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
    console.log("Starting refreshUserProfile for address:", address);
    try {
      const profile = await getUserProfile();
      console.log("Fetched user profile:", profile);
      setUserProfile((prev) => profile || prev || { userId: "0", articlesRead: "0" });
      const points = await getUnredeemedPoints();
      console.log("Fetched unredeemed points:", points);
      setUnredeemedPoints(points || unredeemedPoints || "0");
      const isRegistered = await checkRegistration();
      setIsUserRegistered(isRegistered);
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
      console.log("ContentRegistered event detected, refreshing content list");
      loadAllContentIds();
    };
    contract.on("ContentRegistered", handleContentRegistered);

    // Use contract.filters for event topics
    const articleReadFilter = contract.filters.ArticleRead();
    const quizTakenFilter = contract.filters.QuizTaken();

    const handleArticleRead = (userAddress, contentId) => {
      console.log("ArticleRead event detected:", {
        userAddress: userAddress.toLowerCase(),
        address: address?.toLowerCase(),
        contentId: contentId.toString(),
      });
      if (address && userAddress.toLowerCase() === address.toLowerCase()) {
        refreshTimeout.current = setTimeout(refreshUserProfile, 500);
      }
    };

    const handleQuizTaken = (userAddress, contentId, points) => {
      console.log("QuizTaken event detected:", {
        userAddress: userAddress.toLowerCase(),
        address: address?.toLowerCase(),
        contentId: contentId.toString(),
        points: points.toString(),
      });
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
    allContentIds,
    userProfile,
    isUserRegistered,
    userBadgeIds,
    completedContent,
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