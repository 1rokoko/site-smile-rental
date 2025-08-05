import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enabled for static export
  trailingSlash: true,
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '274418.selcdn.ru',
        port: '',
        pathname: '/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/**',
      },
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
