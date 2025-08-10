import type { NextConfig } from "next";

// Development-friendly configuration without HTTPS redirects
const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',

  // Minimal headers for development
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

  images: {
    unoptimized: true,
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

};

export default nextConfig;
