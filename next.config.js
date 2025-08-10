/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['smilerentalphuket.com'],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Отключаем строгий режим для совместимости
  reactStrictMode: false,
  // Настройки для production
  poweredByHeader: false,
  compress: true,
  // Настройки для статических файлов
  trailingSlash: false,
  // Настройки для сборки
  swcMinify: true,
}

module.exports = nextConfig
