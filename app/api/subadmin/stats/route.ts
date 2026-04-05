import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM "Student" WHERE "schoolId" = $1) as "totalStudents",
        (SELECT COUNT(*) FROM "Standard" WHERE "schoolId" = $1) as "activeStandards",
        (SELECT COUNT(*) FROM "Student" WHERE "schoolId" = $1 AND "createdAt" > NOW() - INTERVAL '30 days') as "recentEnrollments",
        (
          SELECT COALESCE(SUM(std.fees), 0) 
          FROM "Student" s 
          JOIN "Standard" std ON s."standardId" = std.id 
          WHERE s."schoolId" = $1
        ) as "totalFeesPotential"
    `;

    const result = await pool.query(statsQuery, [session.schoolId]);
    const stats = result.rows[0];

    const recentAdmissionsQuery = `
      SELECT name, "createdAt", "studentCode"
      FROM "Student"
      WHERE "schoolId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 5
    `;
    const recentAdmissions = await pool.query(recentAdmissionsQuery, [session.schoolId]);

    return NextResponse.json({
      totalStudents: parseInt(stats.totalStudents),
      activeStandards: parseInt(stats.activeStandards),
      recentEnrollments: parseInt(stats.recentEnrollments),
      totalFeesPotential: parseFloat(stats.totalFeesPotential),
      recentAdmissions: recentAdmissions.rows
    });

  } catch (error: any) {
    console.error('Failed to fetch subadmin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
