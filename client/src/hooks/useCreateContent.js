import { useState } from "react";
import { useLearnBlock } from "@/context/useLearnBlock";

const useCreateContent = () => {
  const { contract } = useLearnBlock();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [contentMetadata, setContentMetadata] = useState({});

  const createContent = async ({ title, body, sources, pointReward, readTime, difficulty, category }) => {
    if (!contract) {
      setError("Contract not initialized");
      return null;
    }
    try {
      setIsCreating(true);
      setError(null);
      const tx = await contract.registerContent(title, body, sources, pointReward);
      const receipt = await tx.wait();
      const newContentId = receipt.events.find((e) => e.event === "ContentRegistered")?.args.contentId.toNumber();
      setContentMetadata((prev) => ({
        ...prev,
        [newContentId]: { readTime, difficulty, category },
      }));
      return { contentId: newContentId };
    } catch (err) {
      console.error("Error creating content:", err);
      setError(err.message || "Failed to create content");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const updateContent = async ({ title, body, sources, pointReward, readTime, difficulty, category }) => {
    // Note: Contract doesn't support update, so we'll overwrite by creating new content
    // If update functionality is added to contract, modify this accordingly
    return createContent({ title, body, sources, pointReward, readTime, difficulty, category });
  };

  const deleteContent = async () => {
    // Note: Contract doesn't support delete, so this is a placeholder
    setIsDeleting(true);
    setError(null);
    try {
      // Implement delete logic if contract supports it
      console.log("Delete functionality not implemented in contract");
      return true;
    } catch (err) {
      console.error("Error deleting content:", err);
      setError(err.message || "Failed to delete content");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const getContentMetadata = (contentId) => {
    return contentMetadata[contentId] || {};
  };

  return { createContent, updateContent, deleteContent, isCreating, isDeleting, error, getContentMetadata };
};

export default useCreateContent;