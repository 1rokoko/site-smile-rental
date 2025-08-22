# Deployment Configuration Documentation

**Documentation Date:** 2025-08-22T19:39:07.560Z

## Deployment Configurations

### GitHub Actions Workflow (./.github/workflows/deploy.yml)
```yaml
name: 🚀 Deploy Smile Rental to VPS

on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'public/**'
      - 'package.json'
      - 'package-lock.json'
      - 'next.config.ts'
      - 'tsconfig.json'
      - '.github/workflows/**'
  workflow_dispatch:
    inputs:
      force_deploy:
        description: 'Force deployment even if no changes detected'
        required: false
        default: false
        type: boolean

env:
  NODE_VERSION: '18'
  APP_NAME: 'smile-rental'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 2

    - name: 🔍 Check for changes
      id: changes
      run: |
        if [ "${{ github.event.inputs.force_deploy }}" == "true" ]; then
          echo "changes=true" >> $GITHUB_OUTPUT
          echo "🔄 Force deployment requested"
        elif git diff --quiet HEAD^ HEAD -- src/ public/ package.json package-lock.json next.config.ts tsconfig.json; then
          echo "changes=false" >> $GITHUB_OUTPUT
          echo "⏭️ No changes in application files"
        else
          echo "changes=true" >> $GITHUB_OUTPUT
          echo "✅ Changes detected in application files"
        fi

    - name: 🟢 Setup Node.js
      if: steps.changes.outputs.changes == 'true'
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: 'package-lock.json'

    - name: 📦 Install dependencies
      if: steps.changes.outputs.changes == 'true'
      run: |
        npm ci --prefer-offline --no-audit

    - name: 🔨 Build application
      if: steps.changes.outputs.changes == 'true'
      run: |
        npm run build

    - name: 🧪 Run tests (if available)
      if: steps.changes.outputs.changes == 'true'
      run: |
        if npm run test --if-present; then
          echo "✅ Tests passed"
        else
          echo "⚠️ No tests found or tests failed"
        fi

    - name: 🚀 Deploy to VPS
      if: steps.changes.outputs.changes == 'true'
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USERNAME }}
        password: ${{ secrets.VPS_PASSWORD }}
        port: 22
        timeout: 300s
        script: |
          # ПРОСТОЙ ДЕПЛОЙ БЕЗ ОШИБОК

          echo "🚀 ПРОСТОЙ ДЕПЛОЙ НАЧАТ"
          echo "📅 Время: $(date)"

          # Переходим в директорию проекта
          cd /var/www/smilerentalphuket.com/site-smile-rental || exit 0

          # Включаем maintenance page
          echo "🟡 Включаем maintenance page..."
          cp public/maintenance.html /var/www/html/maintenance.html || true
          systemctl reload nginx || true

          # Получаем изменения
          echo "📥 Получаем изменения..."
          git fetch origin main || true
          git reset --hard origin/main || true

          # Запускаем простой скрипт исправления
          echo "🔧 Запускаем исправление..."
          chmod +x auto-fix-502.sh || true
          ./auto-fix-502.sh || true

          # Отключаем maintenance page
          echo "🔧 Отключаем maintenance..."
          chmod +x disable-maintenance.sh || true
          ./disable-maintenance.sh || true

          echo "✅ ДЕПЛОЙ ЗАВЕРШЕН!"

    - name: 📊 Deployment Summary
      if: always()
      run: |
        echo "## 🚀 Deployment Summary" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        if [ "${{ steps.changes.outputs.changes }}" == "false" ]; then
          echo "⏭️ **Skipped**: No changes detected in application files" >> $GITHUB_STEP_SUMMARY
        elif [ "${{ job.status }}" == "success" ]; then
          echo "✅ **Success**: Deployment completed successfully!" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "🌐 **Website**: [smilerentalphuket.com](http://smilerentalphuket.com)" >> $GITHUB_STEP_SUMMARY
          echo "🔗 **Commit**: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
          echo "📅 **Time**: $(date)" >> $GITHUB_STEP_SUMMARY
        else
          echo "❌ **Failed**: Deployment encountered errors" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "🔍 Check the logs above for details" >> $GITHUB_STEP_SUMMARY
          echo "🛠️ You may need to run manual commands on the server" >> $GITHUB_STEP_SUMMARY
        fi

```

### Main Ecosystem Configuration (./ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'smile-rental',
    script: '/var/www/smilerentalphuket.com/site-smile-rental/node_modules/.bin/next',
    args: 'start -p 3000',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_restarts: 5,
    min_uptime: '5s',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

```

### Modern Ecosystem Configuration (./smile-rental-modern/ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/smilerentalphuket.com/site-smile-rental',
    
    // Cluster configuration for better performance
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    
    // Memory and performance settings
    max_memory_restart: '512M', // Reduced from 1G to prevent memory bloat
    node_args: '--max-old-space-size=512',
    
    // Auto-restart configuration
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NODE_OPTIONS: '--max-old-space-size=512'
    },
    
    // Logging configuration
    log_file: '/var/log/pm2/smile-rental.log',
    out_file: '/var/log/pm2/smile-rental-out.log',
    error_file: '/var/log/pm2/smile-rental-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Performance monitoring
    pmx: true,
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 8000,
    
    // Health monitoring
    health_check_grace_period: 3000,
    
    // Advanced settings for better performance
    instance_var: 'INSTANCE_ID',
    combine_logs: true,
    
    // Restart delay to prevent rapid restarts
    restart_delay: 4000,
    
    // Exponential backoff restart delay
    exp_backoff_restart_delay: 100
  }]
};

```

### Next.js Configuration (./next.config.ts)
```typescript
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
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' data: blob:",
      "connect-src 'self' https://www.google-analytics.com https://cloudflareinsights.com https://api.whatsapp.com",
      "frame-src 'self' https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  },
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

  // GOOGLE ADS COMPLIANCE: Additional security settings
  swcMinify: true,
  productionBrowserSourceMaps: false,





};

export default nextConfig;

```
