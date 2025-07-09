import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin';

// Opt-in to the Node.js runtime to allow firebase-admin to be used in middleware.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('__session')?.value

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password');
  const isLandingPage = pathname === '/';

  // Allow access to public pages like landing and pricing
  if (isLandingPage || pathname.startsWith('/pricing')) {
    return NextResponse.next();
  }

  // If there's no session cookie, and the page is not a public/auth page, redirect to login
  if (!sessionCookie && !isAuthPage && !isLandingPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // If there is a session cookie, verify it
  if(sessionCookie) {
    try {
        await adminAuth.verifySessionCookie(sessionCookie, true);
        // If user is authenticated and tries to access an auth page, redirect to dashboard
        if (isAuthPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    } catch (error) {
        // If cookie is invalid, redirect to login
        if (!isAuthPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            const response = NextResponse.redirect(url);
            response.cookies.delete('__session'); // Clean up invalid cookie
            return response;
        }
    }
  }

  return NextResponse.next()
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
