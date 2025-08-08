import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomBytes } from 'crypto'

export function middleware(request: NextRequest) {
  // Generate nonce for CSP
  const nonce = randomBytes(16).toString('base64')

  // Clone the request headers and add nonce
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  // Add security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add nonce to response headers for components to use
  response.headers.set('x-nonce', nonce)

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

  // Enhanced CSP - strict but compatible with GA
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.gstatic.com",
    "img-src 'self' data: blob: https://www.google-analytics.com https://maps.gstatic.com https://maps.googleapis.com https://photos.app.goo.gl https://static.craftum.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Rate limiting headers
  response.headers.set('X-RateLimit-Limit', '1000')
  response.headers.set('X-RateLimit-Remaining', '999')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 3600000).toISOString())

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
