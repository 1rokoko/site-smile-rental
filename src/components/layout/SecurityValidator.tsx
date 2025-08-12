'use client';

import { useEffect } from 'react';
import { validateGoogleAdsCompliance } from '@/utils/security-validator';

/**
 * Security validator component for Google Ads compliance
 * Runs security checks in development mode
 */
export function SecurityValidator() {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV === 'development') {
      // Wait for DOM to be fully loaded
      const timer = setTimeout(() => {
        const isCompliant = validateGoogleAdsCompliance();
        
        if (isCompliant) {
          console.log('🎉 Google Ads Compliance: PASSED');
        } else {
          console.warn('⚠️ Google Ads Compliance: ISSUES DETECTED');
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
