import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// PUBLIC PATHS:
const PUBLIC_FILE = /\.(.*)$/;
const PUBLIC_PATHS = ['/login', '/'];

// Load JWT secret key:
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply middleware to specific pages
  if (
    PUBLIC_FILE.test(pathname) ||
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next();
  }

  // Try to get the token from the HttpOnly cookie
  const token = req.cookies.get('authToken')?.value;
  const loginUrl = new URL('/login', req.url);

  // If not logged in requesting protected page, 
  // Then redirect to login
  if (!token) {
    console.log(`No token found: ${pathname}. Redirecting to login.`);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token with jose module
  try {
    await jwtVerify(token, getJwtSecretKey());

    // If valid token,
    // Then allow access
    console.log(`Valid token: ${pathname}. Access permitted.`);
    return NextResponse.next();

  } catch (error) {
    console.error(`Invalid token: ${pathname}:`, error);
    const response = NextResponse.redirect(loginUrl);
    // Invalidate existing cookie
    response.cookies.set('authToken', '', { maxAge: -1, path: '/' });
    return response;
  }
}


/*
 * Apply middleware to these routes:
 */
export const config = {
  matcher: [  
    '/quiz',
    '/flavors/:path*',
  ],
};
