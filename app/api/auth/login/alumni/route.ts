import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, createAlumniToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await query('SELECT * FROM "Alumni" WHERE email = $1', [email]);
    const alumni = result.rows[0];

    if (!alumni || !(await comparePassword(password, alumni.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createAlumniToken({
      userId: alumni.id,
      role: 'ALUMNI',
      email: alumni.email,
      schoolId: alumni.schoolId,
    });

    await setSessionCookie(token, 'ALUMNI');

    return NextResponse.json({ success: true, redirectTo: '/alumni/dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
