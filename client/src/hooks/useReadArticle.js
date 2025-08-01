import { useCallback, useState } from 'react';
import { useLearnBlock } from '@/context/LearnBlockContext';
import { toast } from 'react-toastify';

const useReadArticle = () => {
  const { contract, address, isConnected, refreshUserProfile } = useLearnBlock();
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState(null);

  const readArticle = useCallback(
    async (contentId) => {
      if (!isConnected || !address) {
        setError('Wallet not connected');
        toast.error('Please connect your wallet to read the article.', {
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

      setIsReading(true);
      setError(null);

      try {
        const tx = await contract.readArticle(contentId);
        await tx.wait();
        toast.success('Article read successfully!', {
          position: 'top-right',
          autoClose: 5000,
        });
        await refreshUserProfile();
        return true;
      } catch (error) {
        console.error('Error reading article:', error);
        const errorMsg = error.reason || 'Failed to read article. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg, {
          position: 'top-right',
          autoClose: 5000,
        });
        return false;
      } finally {
        setIsReading(false);
      }
    },
    [contract, address, isConnected, refreshUserProfile]
  );

  return { readArticle, isReading, error };
};

export default useReadArticle;