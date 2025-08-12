'use client';

import { useEffect } from 'react';
import { initializeSecureCSS } from '@/utils/critical-css-loader';

/**
 * Security-compliant CSS loader component
 * Replaces dangerouslySetInnerHTML with safe client-side injection
 * Google Ads compliant implementation
 */
export const SecureCSSLoader: React.FC = () => {
  useEffect(() => {
    // Initialize secure CSS loading on component mount
    initializeSecureCSS();
  }, []);

  // This component doesn't render anything visible
  return null;
};