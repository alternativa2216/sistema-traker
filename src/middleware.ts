import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/app/actions/auth'

// Opt-in to the Node.js runtime.
export const runtime = 'nodejs';

const PROTECTED_ROUTES = ['/dashboard', '/admin'];
const PUBLIC_ONLY_ROUTES = ['/login', '/register', '/forgot-password'];
const ADMIN_ROUTES = ['/admin'];

export async function middleware(request: NextRequest) {
  const currentUser = await getCurrentUser();
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  // Allow access to /install page regardless of auth status
  if (pathname.startsWith('/install')) {
    return NextResponse.next();
  }

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

  // If a regular user tries to access /admin, redirect them to /dashboard
  if (currentUser && currentUser.role !== 'admin' && pathname.startsWith('/admin')) {
      const absoluteURL = new URL('/dashboard', request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
  }
  
  // If an admin user tries to access /dashboard, redirect them to /admin
  if (currentUser && currentUser.role === 'admin' && pathname.startsWith('/dashboard')) {
      const absoluteURL = new URL('/admin', request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
  }

  // If logged in, redirect from public-only routes to the appropriate dashboard
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
