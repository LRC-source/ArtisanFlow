/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useArtisanData } from '../components/DataContext';
import { toast } from 'sonner';

export interface TierPermissions {
  [featureKey: string]: boolean;
}

interface TierContextType {
  currentTier: string;
  permissionsMap: TierPermissions;
  usage: Record<string, number>;
  checkAccess: (featureKey: string) => boolean;
  incrementUsage: (featureKey: string) => Promise<boolean>;
  getProUsageStatus: () => { isPro: boolean; creditsUsed: number; softCap: number; showWarning: boolean };
  isTierLoading: boolean;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { businessProfile, isAuthenticated } = useArtisanData();
  const [currentTier, setCurrentTier] = useState<string>('Free Audit');
  const [permissionsMap, setPermissionsMap] = useState<TierPermissions>({});
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [isTierLoading, setIsTierLoading] = useState<boolean>(true);

  // Fallback defaults in case GAS is unreachable
  const defaultPermissions: TierPermissions = {
    'marketing_studio': true,
    'visual_analysis': true,
    'marketing_creator': true,
    'ai_avatar_studio': false, // Locked for free/basic
    'advanced_synthesis': false,
    'inventory_forecasting': false,
  };

  useEffect(() => {
    const fetchTierData = async () => {
      if (!isAuthenticated || !businessProfile.email) {
        setIsTierLoading(false);
        return;
      }
      
      setIsTierLoading(true);
      const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
      
      if (!gasUrl) {
        console.warn('VITE_GAS_DATABASE_URL is not set. Using fallback tier config.');
        setCurrentTier(businessProfile.tier);
        setPermissionsMap(defaultPermissions);
        setIsTierLoading(false);
        return;
      }

      try {
        const response = await fetch(`${gasUrl}?action=getUserTier&userId=${encodeURIComponent(businessProfile.email)}`);
        const data = await response.json();
        
        if (data.success) {
          setCurrentTier(data.tier);
          setPermissionsMap(data.permissions);
          setUsage(data.usage || {});
        } else {
          setCurrentTier(businessProfile.tier);
          setPermissionsMap(defaultPermissions);
        }
      } catch (error) {
        console.error("Error fetching tier from GAS:", error);
        setCurrentTier(businessProfile.tier);
        setPermissionsMap(defaultPermissions);
      } finally {
        setIsTierLoading(false);
      }
    };

    fetchTierData();
  }, [isAuthenticated, businessProfile.email, businessProfile.tier]);

  const checkAccess = (featureKey: string): boolean => {
    if (businessProfile.role === 'admin') return true; // Admins override everything
    return !!permissionsMap[featureKey];
  };

  const incrementUsage = async (featureKey: string): Promise<boolean> => {
    if (businessProfile.role === 'admin') return true; // Admins unlimited

    const gasUrl = import.meta.env.VITE_GAS_DATABASE_URL;
    if (!gasUrl) {
      return true; // if no url, just simulate success for now
    }

    try {
      const res = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'incrementUsage',
          userId: businessProfile.email,
          featureKey: featureKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsage(prev => ({ ...prev, [featureKey]: (prev[featureKey] || 0) + 1 }));
        return true;
      } else {
        toast.error(`Usage limit reached for ${featureKey}. Please upgrade your tier.`);
        return false;
      }
    } catch (e) {
      console.error("Failed to increment usage", e);
      return false; // Fail safe
    }
  };

  const getProUsageStatus = () => {
    const isPro = currentTier === 'Margin Protection Pro';
    const softCap = 2500;
    // Aggregate total usage across all features (mocked logic for credit count)
    const creditsUsed = Object.values(usage).reduce((a, b) => a + b, 0);
    const showWarning = isPro && creditsUsed >= softCap * 0.9;
    
    return { isPro, creditsUsed, softCap, showWarning };
  };

  return (
    <TierContext.Provider value={{ currentTier, permissionsMap, usage, checkAccess, incrementUsage, getProUsageStatus, isTierLoading }}>
      {children}
    </TierContext.Provider>
  );
};

export const useTierContext = () => {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTierContext must be used within a TierProvider');
  }
  return context;
};
