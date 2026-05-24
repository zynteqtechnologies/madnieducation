import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { students } from '@/lib/db/schema';
import { getSessionFromCookies } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('SUPER_ADMIN');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const standardId = searchParams.get('standardId');
    const academicYearId = searchParams.get('academicYearId');

    if (!standardId) {
      return NextResponse.json({ error: 'Standard ID is required' }, { status: 400 });
    }

    if (academicYearId) {
      const enrollments = await db.query.studentEnrollments.findMany({
        where: (se, { and, eq }) => and(
          eq(se.standardId, standardId),
          eq(se.academicYearId, academicYearId),
          eq(se.status, 'ACTIVE')
        ),
        with: {
          student: true
        }
      });

      const mapped = enrollments.map(e => ({
        ...e.student,
        rank: e.rank,
        percentage: e.percentage,
        enrollmentStatus: e.status
      }));

      return NextResponse.json(mapped);
    } else {
      const standardStudents = await db.query.students.findMany({
        where: eq(students.standardId, standardId),
        orderBy: [students.name],
      });

      return NextResponse.json(standardStudents);
    }
  } catch (error) {
    console.error('SuperAdmin students fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
