import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, encryptSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await query('SELECT * FROM "User" WHERE email = $1 AND role = $2', [email, 'SUB_ADMIN']);
    const user = result.rows[0];

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const encryptedSession = await encryptSession({
      userId: user.id,
      role: user.role,
      email: user.email,
      schoolId: user.schoolId,
    });

    await setSessionCookie(encryptedSession, 'SUB_ADMIN');

    return NextResponse.json({ success: true, redirectTo: '/subadmin/dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
