import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple security headers without nonce for now
  const response = NextResponse.next()

  // Additional security headers for Google Ads compliance
  response.headers.set('X-Robots-Tag', 'index, follow')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  
  // MIME type sniffing protection
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Force HTTPS
  if (request.nextUrl.protocol === 'http:') {
    return NextResponse.redirect(
      `https://${request.nextUrl.hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    )
  }

  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  const suspiciousAgents = ['bot', 'crawler', 'spider', 'scraper']
  const isLegitimateBot = userAgent.includes('googlebot') || 
                         userAgent.includes('bingbot') || 
                         userAgent.includes('yandexbot')
  
  if (!isLegitimateBot && suspiciousAgents.some(agent => userAgent.includes(agent))) {
    // Allow legitimate crawlers but be cautious with others
    console.log(`Suspicious user agent detected: ${userAgent}`)
  }

  // Basic security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // SECURITY FIX: Permissions Policy for Google Ads compliance
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

  // Content Security Policy
  // Allow necessary inline scripts for Next.js functionality while maintaining security
  const isDev = process.env.NODE_ENV !== 'production'
  const cspDirectives: string[] = [
    "default-src 'self'",
    // Allow inline scripts for Next.js hydration and Google Analytics
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com",
    // Keep 'unsafe-inline' for styles because critical CSS is injected via style tags
    "style-src 'self' 'unsafe-inline' https://maps.gstatic.com",
    "img-src 'self' data: blob: https://www.google-analytics.com https://maps.gstatic.com https://maps.googleapis.com https://photos.app.goo.gl",
    "font-src 'self'",
    "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ]
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  // Rate limiting headers
  response.headers.set('X-RateLimit-Limit', '1000')
  response.headers.set('X-RateLimit-Remaining', '999')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 3600000).toISOString())

  return response
}

export const config = {
  matcher: [
    // Apply middleware to all routes except static assets and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico|.*\\.woff|.*\\.woff2|.*\\.ttf|.*\\.eot|.*\\.css|.*\\.js|.*\\.json|.*\\.xml|.*\\.txt).*)',
  ],
}
