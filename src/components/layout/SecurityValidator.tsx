'use client';

import { useEffect } from 'react';
import { validateGoogleAdsCompliance } from '@/utils/security-validator';

/**
 * Security validator component for Google Ads compliance
 * Runs security checks in development mode
 */
export function SecurityValidator() {
  useEffect(() => {
    // GOOGLE ADS FIX: Only run in development mode to avoid suspicious DOM scanning in production
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
    // In production: do nothing to avoid triggering security scanners
  }, []);

  // This component doesn't render anything
  return null;
}
