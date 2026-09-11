import React, { createContext, useContext, useState, useEffect } from 'react';
import { useArtisanData } from '../components/DataContext';
import { toast } from 'sonner';

export type TierName = 'Free Trial' | 'Basic Artisan' | 'Pro Artisan' | 'Master Artisan';

export interface TierConfig {
  name: TierName;
  monthlyPrice: number;
  yearlyPrice: number;
  lolaDailyLimit: number;
  allowedLolaModes: ('FAST' | 'THINK' | 'SEARCH')[];
  features: string[];
  caps: {
    images: number;
    videos: number;
    articles: number;
    posts: number;
  };
}

export const TIER_CONFIGS: Record<TierName, TierConfig> = {
  'Free Trial': {
    name: 'Free Trial',
    monthlyPrice: 0,
    yearlyPrice: 0,
    lolaDailyLimit: 25,
    allowedLolaModes: ['FAST', 'THINK'], // Trial gets Pro features
    features: ['operations', 'finance', 'marketing', 'profit_guard'],
    caps: {
      images: 50,
      videos: 2,
      articles: 15,
      posts: 50
    }
  },
  'Basic Artisan': {
    name: 'Basic Artisan',
    monthlyPrice: 15,
    yearlyPrice: 147,
    lolaDailyLimit: 15,
    allowedLolaModes: ['FAST'],
    features: ['operations', 'finance', 'marketing'], // No Profit Guard
    caps: {
      images: 50,
      videos: 2,
      articles: 10,
      posts: 30
    }
  },
  'Pro Artisan': {
    name: 'Pro Artisan',
    monthlyPrice: 29,
    yearlyPrice: 297,
    lolaDailyLimit: 50,
    allowedLolaModes: ['FAST', 'THINK'],
    features: ['operations', 'finance', 'marketing', 'profit_guard'],
    caps: {
      images: 100,
      videos: 5,
      articles: 30,
      posts: 100
    }
  },
  'Master Artisan': {
    name: 'Master Artisan',
    monthlyPrice: 79,
    yearlyPrice: 797,
    lolaDailyLimit: 150,
    allowedLolaModes: ['FAST', 'THINK', 'SEARCH'],
    features: ['operations', 'finance', 'marketing', 'profit_guard', 'all_future_modules', 'priority_support'],
    caps: {
      images: 200,
      videos: 10,
      articles: 60,
      posts: 200
    }
  }
};

interface TierContextType {
  currentTier: TierName;
  tierConfig: TierConfig;
  lolaUsage: number;
  incrementLolaUsage: () => boolean;
  hasAccess: (feature: string) => boolean;
  isTrialActive: boolean;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { businessProfile, isAuthenticated } = useArtisanData();
  const [lolaUsage, setLolaUsage] = useState<number>(0);

  // Default to Free Trial if not authenticated or no tier
  let currentTier = (businessProfile?.tier as TierName) || 'Free Trial';
  
  // Enforce tier normalization just in case bad data exists
  if (!TIER_CONFIGS[currentTier]) {
    // Migration logic for old names
    if (currentTier as any === 'Free Trial') currentTier = 'Free Trial';
    else if (currentTier as any === 'Basic Artisan') currentTier = 'Basic Artisan';
    else if (currentTier as any === 'Pro Artisan') currentTier = 'Pro Artisan';
    else if (currentTier as any === 'Master Artisan') currentTier = 'Master Artisan';
    else currentTier = 'Free Trial';
  }

  // Determine Trial Status
  const trialEndsAt = businessProfile?.trialEndsAt ? new Date(businessProfile.trialEndsAt) : null;
  const isTrialActive = trialEndsAt !== null && trialEndsAt > new Date();

  const tierConfig = TIER_CONFIGS[currentTier];

  const hasAccess = (feature: string) => {
    // Admins get everything
    if (businessProfile?.role === 'admin') return true;
    return tierConfig.features.includes(feature);
  };

  const incrementLolaUsage = () => {
    if (lolaUsage >= tierConfig.lolaDailyLimit && businessProfile?.role !== 'admin') {
      toast.error(`Daily Lola AI limit reached (${tierConfig.lolaDailyLimit}/${tierConfig.lolaDailyLimit}). Please upgrade your tier for more questions.`);
      return false;
    }
    setLolaUsage(prev => prev + 1);
    return true;
  };

  return (
    <TierContext.Provider value={{
      currentTier,
      tierConfig,
      lolaUsage,
      incrementLolaUsage,
      hasAccess,
      isTrialActive
    }}>
      {children}
    </TierContext.Provider>
  );
};

export const useTier = () => {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
};
