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

        // Return error component
        return {
          default: () => {
            return React.createElement('div',
              { className: "p-4 text-red-600 bg-red-50 rounded-lg" },
              React.createElement('p', null, `Failed to load component: ${componentPath}`),
              React.createElement('p',
                { className: "text-sm mt-2" },
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            );
          }
        };
      }
    },
    {
      ssr,
      loading: loading || (() => {
        return React.createElement('div',
          { className: "animate-pulse bg-gray-100 rounded-lg h-32 flex items-center justify-center" },
          React.createElement('span', { className: "text-gray-500" }, 'Loading...')
        );
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
        return React.createElement('div',
          { className: "h-96 animate-pulse bg-gray-100 rounded-lg mx-4 md:mx-8" },
          React.createElement('div',
            { className: "flex items-center justify-center h-full" },
            React.createElement('div', { className: "text-gray-500" }, 'Loading scooters...')
          )
        );
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
        return React.createElement('div',
          { className: "h-48 animate-pulse bg-orange-50 rounded-lg mx-4 md:mx-8" }
        );
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
        return React.createElement('div',
          { className: "h-64 animate-pulse bg-blue-50 rounded-lg mx-4 md:mx-8" }
        );
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
        return React.createElement('div',
          { className: "h-32 animate-pulse bg-gray-100 rounded-lg mx-4 md:mx-8" }
        );
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