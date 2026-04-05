import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-session-secret-at-least-32-chars-long'
);
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-jwt-secret-at-least-32-chars-long'
);

export type UserRole = 'SUPER_ADMIN' | 'SUB_ADMIN' | 'ALUMNI';

export interface AuthSession {
  userId: string;
  role: UserRole;
  email: string;
  schoolId?: string;
}

// Password utility
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// Session management (for Admins)
export async function encryptSession(payload: AuthSession) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SESSION_SECRET);
}

export async function decryptSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as AuthSession;
  } catch (error) {
    return null;
  }
}

// JWT management (for Alumni)
export async function createAlumniToken(payload: AuthSession) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(JWT_SECRET);
}

export async function verifyAlumniToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as AuthSession;
  } catch (error) {
    return null;
  }
}

// Cookie helpers
export async function setSessionCookie(token: string, role: string) {
    const cookieStore = await cookies();
    const cookieName = role === 'ALUMNI' ? 'alumni-token' : 'admin-session';
    cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: role === 'ALUMNI' ? 60 * 60 * 12 : 60 * 60 * 24, // 12h for alumni, 24h for admins
    });
}

export async function getSessionFromCookies(role: 'ADMIN' | 'ALUMNI') {
    const cookieStore = await cookies();
    const cookieName = role === 'ALUMNI' ? 'alumni-token' : 'admin-session';
    const token = cookieStore.get(cookieName)?.value;
    if (!token) return null;
    return role === 'ALUMNI' ? await verifyAlumniToken(token) : await decryptSession(token);
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin-session');
    cookieStore.delete('alumni-token');
}
