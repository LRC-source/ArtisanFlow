import { useTier } from '../context/TierContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useFeatureGate = (featureKey: string) => {
  const { hasAccess, incrementLolaUsage, isTierLoading } = useTier();
  const navigate = useNavigate();

  const isLocked = !hasAccess(featureKey);

  const executeAction = async (action: () => void | Promise<void>, isMetered = false) => {
    if (isLocked) {
      toast.error('Feature locked. Please upgrade your subscription tier.');
      navigate('/settings/subscription');
      return;
    }

    if (isMetered) {
      const allowed = incrementLolaUsage();
      if (!allowed) {
        navigate('/settings/subscription');
        return;
      }
    }

    await action();
  };

  return { isLocked, executeAction, isTierLoading };
};
