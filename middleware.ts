import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-session-secret-at-least-32-chars-long'
);
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-jwt-secret-at-least-32-chars-long'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that require authentication
  const isSuperAdminPath = pathname.startsWith('/superadmin') && !pathname.includes('/login');
  const isSubAdminPath = pathname.startsWith('/subadmin') && !pathname.includes('/login');
  const isAlumniPath = pathname.startsWith('/alumni') && !pathname.includes('/login');

  // Skip middleware for non-protected paths
  if (!isSuperAdminPath && !isSubAdminPath && !isAlumniPath) {
    return NextResponse.next();
  }

  // Handle Superadmin/Subadmin (Session-based)
  if (isSuperAdminPath || isSubAdminPath) {
    const sessionToken = request.cookies.get('admin-session')?.value;

    if (!sessionToken) {
        const loginUrl = new URL(isSuperAdminPath ? '/superadmin/login' : '/subadmin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(sessionToken, SESSION_SECRET);
      const role = payload.role as string;

      if (isSuperAdminPath && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/superadmin/login', request.url));
      }

      if (isSubAdminPath && role !== 'SUB_ADMIN' && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/subadmin/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      const loginUrl = new URL(isSuperAdminPath ? '/superadmin/login' : '/subadmin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle Alumni (JWT-based)
  if (isAlumniPath) {
    const alumniToken = request.cookies.get('alumni-token')?.value;

    if (!alumniToken) {
      return NextResponse.redirect(new URL('/alumni/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(alumniToken, JWT_SECRET);
      if (payload.role !== 'ALUMNI') {
        return NextResponse.redirect(new URL('/alumni/login', request.url));
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/alumni/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/superadmin/:path*', '/subadmin/:path*', '/alumni/:path*'],
};
