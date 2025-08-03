import { useState, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useContractInstance from "./useContractInstance";

const useRegister = () => {
  const { address, isConnected } = useAppKitAccount();
  const { contract, readOnlyContract } = useContractInstance();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [isPendingRegistration, setIsPendingRegistration] = useState(false);

  const checkRegistration = useCallback(async () => {
    if (!address || !readOnlyContract) return false;
    try {
      setIsCheckingRegistration(true);
      setRegistrationError(null);
      const isRegistered = await readOnlyContract.isUserRegistered(address);
      if (isRegistered) setIsPendingRegistration(false);
      return isRegistered;
    } catch (error) {
      console.error("Error checking registration:", error);
      setRegistrationError(error);
      return false;
    } finally {
      setIsCheckingRegistration(false);
    }
  }, [address, readOnlyContract]);

  const checkContentExists = useCallback(async () => {
    if (!readOnlyContract) return false;
    try {
      const contentIds = await readOnlyContract.getAllContentIds();
      for (let id of contentIds) {
        try {
          const content = await readOnlyContract.getContent(id);
          if (content.exists) return true;
        } catch (error) {
          console.error(`Error checking content ID ${id}:`, error);
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching content IDs:", error);
      return false;
    }
  }, [readOnlyContract]);

  const getValidContentId = useCallback(async () => {
    if (!readOnlyContract) return null;
    try {
      const contentIds = await readOnlyContract.getAllContentIds();
      for (let id of contentIds) {
        const content = await readOnlyContract.getContent(id);
        if (content.exists) return id.toString();
      }
      return null;
    } catch (error) {
      console.error("Error fetching valid content ID:", error);
      return null;
    }
  }, [readOnlyContract]);

  const registerUser = useCallback(async () => {
    if (!address || !isConnected || !contract) {
      setRegistrationError(new Error("Wallet not connected or contract not available"));
      return { success: false, error: "Wallet not connected or contract not available" };
    }

    try {
      setIsRegistering(true);
      setRegistrationError(null);

      const isAlreadyRegistered = await checkRegistration();
      if (isAlreadyRegistered) {
        setIsPendingRegistration(false);
        return { success: true };
      }

      const contentExists = await checkContentExists();
      if (!contentExists) {
        setIsPendingRegistration(true);
        return { success: true, pending: true };
      }

      const contentId = await getValidContentId();
      if (!contentId) {
        setIsPendingRegistration(true);
        return { success: true, pending: true };
      }

      const tx = await contract.readArticle(contentId);
      await tx.wait();
      setIsPendingRegistration(false);
      return { success: true };
    } catch (error) {
      console.error("Error registering user:", JSON.stringify(error, null, 2));
      setRegistrationError(error);
      return { success: false, error: error.message };
    } finally {
      setIsRegistering(false);
    }
  }, [address, isConnected, contract, checkRegistration, checkContentExists, getValidContentId]);

  const getUserProfile = useCallback(async () => {
    if (!address || !readOnlyContract) return null;
    try {
      const profile = await readOnlyContract.getUserProfile(address);
      return {
        userId: profile.userId?.toString() || "0",
        articlesRead: profile.articlesRead?.toString() || "0",
        quizzesTaken: profile.quizzesTaken?.toString() || "0",
        totalPointsEarned: profile.totalPointsEarned?.toString() || "0",
        totalPointsRedeemed: profile.totalPointsRedeemed?.toString() || "0",
        badges: profile.badges?.toString() || "0",
        goldenBadgeClaimed: profile.goldenBadgeClaimed || false,
      };
    } catch (error) {
      console.error("getUserProfile error:", error);
      return null;
    }
  }, [address, readOnlyContract]);

  const getUnredeemedPoints = useCallback(async () => {
    if (!address || !readOnlyContract) return "0";
    try {
      const points = await readOnlyContract.getUnredeemedPoints(address);
      return points.toString();
    } catch (error) {
      console.error("Error getting unredeemed points:", error);
      return "0";
    }
  }, [address, readOnlyContract]);

  const getUserBadgeIds = useCallback(async () => {
    if (!address || !readOnlyContract) return [];
    try {
      const badgeIds = await readOnlyContract.getUserBadgeIds(address);
      return badgeIds.map((id) => id.toString());
    } catch (error) {
      console.error("Error getting user badge IDs:", error);
      return [];
    }
  }, [address, readOnlyContract]);

  const getUserCompletedContent = useCallback(async () => {
    if (!address || !readOnlyContract) return [];
    try {
      const completed = await readOnlyContract.getUserCompletedContent(address);
      return completed.map((id) => id.toString());
    } catch (error) {
      console.error("Error getting completed content:", error);
      return [];
    }
  }, [address, readOnlyContract]);

  return {
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
    clearError: () => setRegistrationError(null),
  };
};

export default useRegister;