import { useCallback, useState } from 'react';
import { useLearnBlock } from '@/context/LearnBlockContext';
import { toast } from 'react-toastify';

const contentMetadata = {};

const useCreateContent = () => {
  const { contract, address, isConnected, loadAllContentIds } = useLearnBlock();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const createContent = useCallback(
    async (contentData) => {
      if (!isConnected || !address) {
        setError('Wallet not connected');
        toast.error('Please connect your wallet to create content.', {
          position: 'top-right',
          autoClose: 5000,
        });
        return false;
      }

      if (!contract) {
        setError('Contract not initialized');
        toast.error('Smart contract not initialized.', {
          position: 'top-right',
          autoClose: 5000,
        });
        return false;
      }

      setIsCreating(true);
      setError(null);

      try {
        const { title, body, sources, pointReward, description, readTime, difficulty, category, contentId } = contentData;
        const sourcesArray = sources ? sources.split(',').map((s) => s.trim()) : [];
        
        const tx = await contract.registerContent(title, body, sourcesArray, pointReward);
        const receipt = await tx.wait();
        
        const contentIdFromEvent = receipt.events.find((e) => e.event === 'ContentRegistered')?.args.contentId.toString();
        
        contentMetadata[contentIdFromEvent] = {
          description,
          readTime,
          difficulty,
          category,
        };

        toast.success('Content created successfully!', {
          position: 'top-right',
          autoClose: 5000,
        });
        await loadAllContentIds(); 
        return contentIdFromEvent;
      } catch (error) {
        console.error('Error creating content:', error);
        const errorMsg = error.reason || 'Failed to create content. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, {
          position: 'top-right',
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [contract, address, isConnected, loadAllContentIds]
  );

  const getContentMetadata = useCallback((contentId) => {
    return contentMetadata[contentId] || {};
  }, []);

  return { createContent, isCreating, error, getContentMetadata };
};

export default useCreateContent;