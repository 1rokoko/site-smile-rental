import type { NextConfig } from "next";

// Security Headers for Google Ads compliance
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
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.gstatic.com",
      "img-src 'self' data: blob: https://www.google-analytics.com https://maps.gstatic.com https://maps.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // HTTPS redirects for security
  async redirects() {
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
