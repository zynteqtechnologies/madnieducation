import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { students } from '@/lib/db/schema';
import { getSessionFromCookies } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('SUPER_ADMIN');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const standardId = searchParams.get('standardId');

    if (!standardId) {
      return NextResponse.json({ error: 'Standard ID is required' }, { status: 400 });
    }

    const standardStudents = await db.query.students.findMany({
      where: eq(students.standardId, standardId),
      orderBy: [students.name],
    });

    return NextResponse.json(standardStudents);
  } catch (error) {
    console.error('SuperAdmin students fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
