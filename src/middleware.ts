import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { adminAuth } from '@/lib/firebase-admin'; // Removido para diagnóstico

// Opt-in to the Node.js runtime.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  // A lógica do middleware foi temporariamente desativada para isolar um erro de compilação.
  // Isso permite que todas as páginas sejam acessadas sem verificação de autenticação.
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
