import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// We only import the Edge-safe version of getCurrentUser
import { getEdgeCurrentUser } from '@/app/actions/auth-helpers';

export const runtime = 'edge';

const PROTECTED_ROUTES = ['/dashboard', '/admin'];
const PUBLIC_ONLY_ROUTES = ['/login', '/register', '/forgot-password', '/'];
const ADMIN_ROUTES = ['/admin'];
const USER_ROUTES = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to /install and static assets needed for it.
  if (pathname.startsWith('/install') || pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const currentUser = await getEdgeCurrentUser();

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isUserRoute = USER_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some((route) => pathname === route);

  // If trying to access a protected route without being logged in, redirect to login
  if (isProtectedRoute && !currentUser) {
    const absoluteURL = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  
  // If trying to access an admin route without being an admin, redirect to dashboard
  if (isAdminRoute && currentUser?.role !== 'admin') {
     const absoluteURL = new URL('/dashboard', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // If a regular user tries to access an admin route, redirect them to their dashboard
  if (currentUser && currentUser.role !== 'admin' && isAdminRoute) {
      const absoluteURL = new URL('/dashboard', request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
  }
  
  // If an admin user tries to access a user-only route, redirect them to the admin panel
  if (currentUser && currentUser.role === 'admin' && isUserRoute) {
      const absoluteURL = new URL('/admin', request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
  }

  // If a logged-in user tries to access a public-only page (like login/register), redirect them
  if (isPublicOnlyRoute && currentUser) {
    const targetDashboard = currentUser.role === 'admin' ? '/admin' : '/dashboard';
    const absoluteURL = new URL(targetDashboard, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - track.js (tracking script)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|track.js).*)',
  ],
}
