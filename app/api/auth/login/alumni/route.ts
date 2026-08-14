import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword } from '@/lib/auth';
import { startLoginOtp, normalizeLoginEmail } from '@/lib/auth/loginOtp';
import { checkRateLimit, rateLimitResponse } from '@/lib/security/rateLimit';

export async function POST(request: Request) {
  try {
    const limit = await checkRateLimit(request, 'login');
    if (!limit.allowed) return rateLimitResponse(limit.retryAfter);

    const { email, password } = await request.json();
    const cleanEmail = normalizeLoginEmail(email);

    const result = await query('SELECT * FROM "Alumni" WHERE LOWER(email) = $1', [cleanEmail]);
    const alumni = result.rows[0];

    if (!alumni || !(await comparePassword(password, alumni.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await startLoginOtp({
      role: 'ALUMNI',
      email: alumni.email,
      userId: alumni.id,
      schoolId: alumni.schoolId,
      name: alumni.name,
    });

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      role: 'ALUMNI',
      email: alumni.email,
      message: 'OTP sent to your registered email.',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
