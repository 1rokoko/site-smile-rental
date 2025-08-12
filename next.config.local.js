/** @type {import('next').NextConfig} */
const nextConfig = {
  // Development-specific configuration for localhost:3000
  
  // Ensure proper localhost binding
  experimental: {
    // Enable turbopack for faster development
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Minimal configuration for local development
  trailingSlash: false,
  basePath: '',
  assetPrefix: '',
  compress: false, // Disable compression for faster dev builds
  poweredByHeader: false,

  // Development-friendly headers (minimal)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ];
  },

  // No redirects for local development
  async redirects() {
    return [];
  },

  // Image configuration for development
  images: {
    unoptimized: true, // Faster development builds
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'photos.app.goo.gl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.craftum.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Development server configuration
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // Webpack configuration for development
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Development-specific webpack optimizations
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  // TypeScript configuration
  typescript: {
    // Ignore TypeScript errors during development for faster builds
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Ignore ESLint errors during development for faster builds
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
