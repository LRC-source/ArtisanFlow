import { useTierContext } from '../context/TierContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useFeatureGate = (featureKey: string) => {
  const { checkAccess, incrementUsage, isTierLoading } = useTierContext();
  const navigate = useNavigate();

  const isLocked = !isTierLoading && !checkAccess(featureKey);

  const executeAction = async (action: () => void | Promise<void>, isMetered = false) => {
    if (isLocked) {
      toast.error('Feature locked. Please upgrade your subscription tier.');
      navigate('/settings'); // Adjust to wherever subscription status lives
      return;
    }

    if (isMetered) {
      const allowed = await incrementUsage(featureKey);
      if (!allowed) {
        navigate('/settings');
        return;
      }
    }

    await action();
  };

  return { isLocked, executeAction, isTierLoading };
};
