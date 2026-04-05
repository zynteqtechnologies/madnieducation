import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch all construction/event costs across ALL schools
    const expensesRes = await pool.query(`
      SELECT e.*, s."schoolName" 
      FROM "Expense" e
      JOIN "School" s ON e."schoolId" = s.id
      ORDER BY e."createdAt" DESC
    `);

    // 2. Aggregate Financial Aid Needs (School -> Standard -> Category)
    const financialAidRes = await pool.query(`
      SELECT 
        sc.id as "schoolId",
        sc."schoolName",
        std.id as "standardId",
        std."standardName",
        std.fees,
        COUNT(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Zakat%' THEN 1 END)::int as "zakatCount",
        COUNT(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Sadka%' THEN 1 END)::int as "sadkaCount",
        COUNT(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Lillah%' THEN 1 END)::int as "lillahCount",
        COUNT(CASE WHEN stu."isUnderRTE" = true THEN 1 END)::int as "rteCount",
        COALESCE(SUM(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Zakat%' THEN stu."aidPaidAmount" ELSE 0 END), 0)::float as "zakatPaid",
        COALESCE(SUM(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Sadka%' THEN stu."aidPaidAmount" ELSE 0 END), 0)::float as "sadkaPaid",
        COALESCE(SUM(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Lillah%' THEN stu."aidPaidAmount" ELSE 0 END), 0)::float as "lillahPaid"
      FROM "School" sc
      JOIN "Standard" std ON sc.id = std."schoolId"
      JOIN "Student" stu ON std.id = stu."standardId"
      WHERE (stu."isNeedy" = true OR stu."isUnderRTE" = true)
      GROUP BY sc.id, sc."schoolName", std.id, std."standardName", std.fees
      ORDER BY sc."schoolName" ASC, std.id ASC
    `);

    return NextResponse.json({
      expenses: expensesRes.rows,
      financialAid: financialAidRes.rows
    });

  } catch (error: any) {
    console.error('Alumni needs fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
