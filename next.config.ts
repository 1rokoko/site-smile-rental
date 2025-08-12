import type { NextConfig } from "next";

// Enhanced Security Headers for Google Ads compliance
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()'
  },
  // CSP header is set dynamically in src/middleware.ts (dev vs prod). Removed here to avoid duplicates/conflicts.
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'unsafe-none'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin-allow-popups'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin'
  }
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',
  compress: true,
  poweredByHeader: false,

  // Performance optimizations and security enhancements
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@/components', '@/utils'],
    // Temporarily disabled due to critters dependency issue
    // optimizeCss: true,
    gzipSize: true,
    // SECURITY FIX: Enable strict mode for better security
    strictNextHead: true,
  },

  // Webpack optimizations for better performance
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize chunks for better caching and loading
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              maxSize: 244000,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
              maxSize: 244000,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 20,
              maxSize: 244000,
            },
            lucideReact: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide-react',
              chunks: 'all',
              priority: 20,
              maxSize: 244000,
            },
          },
        },
        // SECURITY FIX: Minimize bundle size and potential security issues
        usedExports: true,
        sideEffects: false,
      };
    }
    return config;
  },

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Long-term cache for Next static assets
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public images for a week
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },

  // HTTPS redirects for security (disabled in development)
  async redirects() {
    // Only redirect to HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://smilerentalphuket.com/:path*',
          permanent: true,
        },
      ];
    }
    return [];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'photos.app.goo.gl',
        port: '',
        pathname: '/**',
      },

    ],
  },

  // SECURITY FIX: Enhanced settings for Google Ads compliance
  compiler: {
    // Remove console logs in production for cleaner code
    removeConsole: process.env.NODE_ENV === 'production',
    // Remove React DevTools and data-testid attributes in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },





};

export default nextConfig;
