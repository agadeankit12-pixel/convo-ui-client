import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Route Protection ─────────────────────────────────────────────────────────
// This middleware runs on EVERY request before the page renders.
// It reads the JWT cookie and redirects to /login if missing.
//
// Note: We only check cookie EXISTENCE here (middleware can't verify JWTs
// because it runs in the Edge runtime which doesn't have Node.js crypto).
// The actual verification happens server-side when the API is called.

// Routes that should redirect to /chat if already logged in
const AUTH_ROUTES = ['/login', '/register']

// Routes that require authentication
const PROTECTED_ROUTES = ['/chat']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // If user has a token and tries to visit login/register → redirect to /chat
  if (token && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  // If user has no token and tries to visit a protected route → redirect to /login
  if (!token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname) // remember where they were going
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Tell Next.js which paths this middleware should run on
// Exclude static files, images, and Next.js internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
