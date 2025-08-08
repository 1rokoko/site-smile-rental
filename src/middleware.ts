import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

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
