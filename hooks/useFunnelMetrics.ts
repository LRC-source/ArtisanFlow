import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type FunnelType = 'makers' | 'apothecaries' | 'scale' | 'unknown';

interface TrackingPayload {
  event: 'pageview' | 'cta_click' | 'signup_start';
  funnel: FunnelType;
  path: string;
  timestamp: string;
  metadata?: any;
}

export const useFunnelMetrics = () => {
  const location = useLocation();
  const hasTrackedPageview = useRef(false);

  const getFunnelType = (path: string): FunnelType => {
    if (path.includes('/makers')) return 'makers';
    if (path.includes('/apothecaries')) return 'apothecaries';
    if (path.includes('/scale')) return 'scale';
    return 'unknown';
  };

  const trackEvent = async (payload: Omit<TrackingPayload, 'timestamp' | 'path' | 'funnel'>) => {
    const fullPayload: TrackingPayload = {
      ...payload,
      funnel: getFunnelType(location.pathname),
      path: location.pathname,
      timestamp: new Date().toISOString()
    };

    try {
      // Send to Vercel Serverless Function
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullPayload)
      });
      // Fallback or local dev doesn't need to throw if it fails
    } catch (e) {
      console.warn("Funnel tracking failed", e);
    }
  };

  // Track pageview on mount
  useEffect(() => {
    if (!hasTrackedPageview.current) {
      trackEvent({ event: 'pageview' });
      hasTrackedPageview.current = true;
    }
  }, [location.pathname]);

  return {
    trackEvent,
    trackCtaClick: (tier: string) => trackEvent({ event: 'cta_click', metadata: { targetTier: tier } })
  };
};
