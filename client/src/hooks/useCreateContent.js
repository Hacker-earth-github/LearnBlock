import { useCallback, useState } from "react";
import { parseUnits } from "ethers"; // For ethers v6
import { useLearnBlock } from "@/context/LearnBlockContext";
import { toast } from "react-toastify";

const useCreateContent = () => {
  const { contract, readOnlyContract, loadAllContentIds } = useLearnBlock();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({}); // Store metadata off-chain

  const createContent = useCallback(
    async (contentData) => {
      if (!contract) {
        setError("Contract instance not available");
        toast.error("Smart contract not initialized.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      setIsCreating(true);
      setError(null);

      try {
        const sourcesArray = contentData.sources ? contentData.sources.split(",").map((s) => s.trim()) : [];
        const pointReward = parseUnits(contentData.pointReward.toString(), 0);

        console.log("Creating content with data:", { ...contentData, sourcesArray, pointReward });
        const tx = await contract.registerContent(
          contentData.title,
          contentData.body,
          sourcesArray,
          pointReward
        );
        const receipt = await tx.wait();
        console.log("Content created, transaction hash:", tx.hash);

        // Extract contentId from ContentRegistered event (assuming it emits contentId)
        const contentId = receipt.events?.find((e) => e.event === "ContentRegistered")?.args?.contentId?.toString();
        if (!contentId) {
          throw new Error("Failed to retrieve contentId from transaction");
        }

        // Store metadata off-chain
        setMetadata((prev) => ({
          ...prev,
          [contentId]: {
            description: contentData.description,
            readTime: contentData.readTime,
            difficulty: contentData.difficulty,
            category: contentData.category,
          },
        }));

        toast.success("Content created successfully!", {
          position: "top-right",
          autoClose: 5000,
        });

        await loadAllContentIds();
        return true;
      } catch (err) {
        console.error("Error creating content:", {
          message: err.message,
          reason: err.reason,
          code: err.code,
          data: err.data,
        });
        const errorMsg = err.reason || "Failed to create content. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [contract, loadAllContentIds]
  );

  const updateContent = useCallback(
    async (contentId, contentData) => {
      if (!contract) {
        setError("Contract instance not available");
        toast.error("Smart contract not initialized.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      setIsUpdating(true);
      setError(null);

      try {
        const sourcesArray = contentData.sources ? contentData.sources.split(",").map((s) => s.trim()) : [];
        const pointReward = parseUnits(contentData.pointReward.toString(), 0);

        console.log("Updating content with ID:", contentId, "Data:", { ...contentData, sourcesArray, pointReward });
        const tx = await contract.updateContent(
          contentId,
          contentData.title,
          contentData.body,
          sourcesArray,
          pointReward
        );
        await tx.wait();
        console.log("Content updated, transaction hash:", tx.hash);

        // Update metadata
        setMetadata((prev) => ({
          ...prev,
          [contentId]: {
            description: contentData.description,
            readTime: contentData.readTime,
            difficulty: contentData.difficulty,
            category: contentData.category,
          },
        }));

        toast.success("Content updated successfully!", {
          position: "top-right",
          autoClose: 5000,
        });

        await loadAllContentIds();
        return true;
      } catch (err) {
        console.error("Error updating content:", {
          message: err.message,
          reason: err.reason,
          code: err.code,
          data: err.data,
        });
        const errorMsg = err.reason || "Failed to update content. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [contract, loadAllContentIds]
  );

  const deleteContent = useCallback(
    async (contentId) => {
      if (!contract) {
        setError("Contract instance not available");
        toast.error("Smart contract not initialized.", {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      }

      setIsDeleting(true);
      setError(null);

      try {
        console.log("Deleting content with ID:", contentId);
        const tx = await contract.deleteContent(contentId);
        await tx.wait();
        console.log("Content deleted, transaction hash:", tx.hash);

        // Remove metadata
        setMetadata((prev) => {
          const newMetadata = { ...prev };
          delete newMetadata[contentId];
          return newMetadata;
        });

        toast.success("Content deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
        });

        await loadAllContentIds();
        return true;
      } catch (err) {
        console.error("Error deleting content:", {
          message: err.message,
          reason: err.reason,
          code: err.code,
          data: err.data,
        });
        const errorMsg = err.reason || "Failed to delete content. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [contract, loadAllContentIds]
  );

  const getContentMetadata = useCallback(
    (contentId) => {
      return metadata[contentId] || {
        description: "",
        readTime: "",
        difficulty: "Beginner",
        category: "Blockchain",
      };
    },
    [metadata]
  );

  return { createContent, updateContent, deleteContent, isCreating, isUpdating, isDeleting, error, getContentMetadata };
};

export default useCreateContent;