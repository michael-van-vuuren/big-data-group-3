import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


// was being used for server-side route protection,
// but currently is being handled client-side
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// OLD ROUTE PROTECTION
// export function middleware(request: NextRequest) {
//     // these are the protected paths
//     const protectedPaths = ['/quiz', '/flavors', '/dashboard'];

//     const { pathname } = request.nextUrl;

//     // check if the current path is protected
//     const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path));

//     // not protected -> allow access
//     if (!isPathProtected) {
//         return NextResponse.next();
//     }

//     // get token from cookie
//     const tokenCookie = request.cookies.get('authToken');

//     // if no token cookie, redirect to login
//     if (!tokenCookie) {
//         const url = request.nextUrl.clone();
//         url.pathname = '/login';
        
//         // use this if you want to redirect to intended page after login
//         url.searchParams.set('redirectedFrom', pathname);

//         return NextResponse.redirect(url);
//     }

//     // 6. if token cookie exists, allow access (backend will verify the token's validity on page loads and api calls)
//     return NextResponse.next();
// }


// export const config = {
//     // protect all request paths except for the ones starting with:
//     // - api (API routes)
//     // - _next/static (static files)
//     // - _next/image (image optimization files)
//     // - favicon.ico (favicon file)
//     // - login (the login page itself)
//     matcher: [
//          '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
//     ],
// }
