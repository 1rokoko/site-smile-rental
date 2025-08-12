/**
 * Security-compliant dynamic import utilities
 * Replaces complex dynamic import patterns with transparent alternatives
 * Google Ads compliant implementation
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType, ReactElement } from 'react';

/**
 * Security-compliant dynamic component loader
 * Replaces the complex .then(mod => ({ default: mod.ComponentName })) pattern
 */
export function createSecureDynamicComponent<T extends ComponentType<unknown>>(
  componentPath: string,
  options: {
    ssr?: boolean;
    loading?: () => ReactElement | null;
    fallback?: () => ReactElement | null;
  } = {}
): T {
  const { ssr = true, loading, fallback } = options;

  // Validate component path to prevent malicious imports
  if (!isValidComponentPath(componentPath)) {
    throw new Error(`Invalid component path: ${componentPath}`);
  }

  // Create transparent dynamic import with clear error handling
  const DynamicComponent = dynamic(
    async () => {
      try {
        console.log(`🔄 Loading component: ${componentPath}`);

        // Use explicit import with clear error handling
        const moduleImport = await import(componentPath);

        // Validate that the module has a default export
        if (!moduleImport.default) {
          throw new Error(`Component ${componentPath} has no default export`);
        }

        console.log(`✅ Component loaded successfully: ${componentPath}`);
        return moduleImport;
      } catch (error) {
        console.error(`❌ Failed to load component ${componentPath}:`, error);

        // Return fallback component if available
        if (fallback) {
          return { default: fallback };
        }

        // GOOGLE ADS FIX: Return simple error message instead of dynamic DOM creation
        return {
          default: () => {
            console.error(`Failed to load component: ${componentPath}`, error);
            return null; // Return null instead of creating DOM elements
          }
        };
      }
    },
    {
      ssr,
      loading: loading || (() => {
        // GOOGLE ADS FIX: Return simple div instead of null to prevent blank page
        console.log('Loading component...');
        return React.createElement('div', {
          style: {
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5
          }
        }, 'Loading...');
      })
    }
  );

  return DynamicComponent as T;
}

/**
 * Validates component paths to prevent malicious imports
 */
function isValidComponentPath(path: string): boolean {
  // Only allow paths starting with @/ or relative paths
  if (!path.startsWith('@/') && !path.startsWith('./') && !path.startsWith('../')) {
    return false;
  }

  // Block suspicious patterns
  const suspiciousPatterns = [
    '..\\',
    'node_modules',
    'package.json',
    '.env',
    'config',
    'server',
    'api'
  ];

  const lowerPath = path.toLowerCase();
  for (const pattern of suspiciousPatterns) {
    if (lowerPath.includes(pattern)) {
      return false;
    }
  }

  // Only allow TypeScript/JavaScript files
  const allowedExtensions = ['.tsx', '.ts', '.jsx', '.js'];
  const hasValidExtension = allowedExtensions.some(ext => path.endsWith(ext));

  // If no extension, assume it's a directory import (allowed)
  if (!path.includes('.') || hasValidExtension) {
    return true;
  }

  return false;
}

/**
 * Pre-configured secure dynamic components for common use cases
 */
export const SecureDynamicComponents = {
  /**
   * Secure scooter grid component loader
   */
  ScooterGridWithPromo: createSecureDynamicComponent(
    '@/components/sections/ScooterGridWithPromo',
    {
      ssr: true,
      loading: () => {
        // GOOGLE ADS FIX: Return simple loading div
        console.log('Loading ScooterGridWithPromo component...');
        return React.createElement('div', {
          style: { minHeight: '200px', textAlign: 'center', padding: '2rem' }
        }, 'Loading scooters...');
      }
    }
  ),

  /**
   * Secure scam warning component loader
   */
  ScamWarning: createSecureDynamicComponent(
    '@/components/sections/ScamWarning',
    {
      ssr: true,
      loading: () => {
        // GOOGLE ADS FIX: Return simple loading div
        console.log('Loading ScamWarning component...');
        return React.createElement('div', {
          style: { minHeight: '100px', textAlign: 'center', padding: '1rem' }
        }, 'Loading warning...');
      }
    }
  ),

  /**
   * Secure owner testimonial component loader
   */
  OwnerTestimonial: createSecureDynamicComponent(
    '@/components/sections/OwnerTestimonial',
    {
      ssr: true,
      loading: () => {
        // GOOGLE ADS FIX: Return simple loading div
        console.log('Loading OwnerTestimonial component...');
        return React.createElement('div', {
          style: { minHeight: '150px', textAlign: 'center', padding: '1rem' }
        }, 'Loading testimonial...');
      }
    }
  ),

  /**
   * Secure floating contact buttons loader
   */
  FloatingContactButtons: createSecureDynamicComponent(
    '@/components/ui/FloatingContactButtons',
    {
      ssr: false, // Client-side only for better performance
      loading: () => null // No loading state for floating buttons
    }
  ),

  /**
   * Secure footer component loader
   */
  Footer: createSecureDynamicComponent(
    '@/components/sections/Footer',
    {
      ssr: true,
      loading: () => {
        // GOOGLE ADS FIX: Return simple loading div
        console.log('Loading Footer component...');
        return React.createElement('div', {
          style: { minHeight: '100px', textAlign: 'center', padding: '1rem' }
        }, 'Loading footer...');
      }
    }
  )
};

/**
 * Secure preload function for components
 * Replaces manual import() calls with validated preloading
 */
export function securePreloadComponent(componentPath: string): void {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Validate path
  if (!isValidComponentPath(componentPath)) {
    console.error(`Invalid component path for preload: ${componentPath}`);
    return;
  }

  try {
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        import(componentPath)
          .then(() => console.log(`✅ Component preloaded: ${componentPath}`))
          .catch(error => console.error(`❌ Failed to preload component ${componentPath}:`, error));
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        import(componentPath)
          .then(() => console.log(`✅ Component preloaded: ${componentPath}`))
          .catch(error => console.error(`❌ Failed to preload component ${componentPath}:`, error));
      }, 100);
    }
  } catch (error) {
    console.error(`Error in securePreloadComponent for ${componentPath}:`, error);
  }
}