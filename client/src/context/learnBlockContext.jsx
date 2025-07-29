import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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

  // State
  const [learnBlocks, setLearnBlocks] = useState([]);
  const [allContentIds, setAllContentIds] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userBadgeIds, setUserBadgeIds] = useState([]);
  const [completedContent, setCompletedContent] = useState([]);
  const [unredeemedPoints, setUnredeemedPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getContent = useCallback(
    async (contentId) => {
      if (!readOnlyContract) return null;
      try {
        const content = await readOnlyContract.getContent(contentId);
        return {
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

  const refreshUserProfile = useCallback(async () => {
    if (!address || !readOnlyContract) {
      console.log("Skipping refresh: No address or readOnlyContract", {
        address,
        readOnlyContract,
      });
      return;
    }
    setIsLoading(true);
    console.log("Starting refreshUserProfile for address:", address);
    try {
      const profile = await getUserProfile();
      console.log("Fetched user profile:", profile);
      setUserProfile(profile || { userId: "0", articlesRead: "0" });
      const points = await getUnredeemedPoints();
      console.log("Fetched unredeemed points:", points);
      setUnredeemedPoints(points || "0");
      const isRegistered = await checkRegistration();
      setIsUserRegistered(isRegistered);
      if (isRegistered) setIsPendingRegistration(false);

      const badgeIds = await getUserBadgeIds();
      setUserBadgeIds(badgeIds || []);
      const completed = await getUserCompletedContent();
      const parsedCompleted =
        completed && typeof completed === "object" && !Array.isArray(completed)
          ? Object.values(completed)
          : completed || [];
      setCompletedContent(parsedCompleted);
    } catch (error) {
      console.error("Critical error in refreshUserProfile:", error);
      setUserProfile({ userId: "0", articlesRead: "0" });
      setUnredeemedPoints("0");
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    readOnlyContract,
    getUserProfile,
    getUnredeemedPoints,
    checkRegistration,
    getUserBadgeIds,
    getUserCompletedContent,
  ]);

  const handleUserRegistration = useCallback(async () => {
    try {
      const success = await registerUser();
      if (success) {
        await refreshUserProfile();
      }
      return success;
    } catch (error) {
      console.error(
        "Error in handleUserRegistration:",
        JSON.stringify(error, null, 2)
      );
      return false;
    }
  }, [registerUser, refreshUserProfile]);

  useEffect(() => {
    if (isConnected && address && !isLoading) {
      console.log(
        "Initial trigger of refreshUserProfile for address:",
        address
      );
      refreshUserProfile();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (readOnlyContract) {
      loadAllContentIds();
    }
  }, [readOnlyContract, loadAllContentIds]);

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
