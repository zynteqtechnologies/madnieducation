import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withPublicApi } from '@/lib/public-api';

export const dynamic = 'force-dynamic';

export const GET = withPublicApi(async () => {
  const expensesRes = await pool.query(`
    SELECT
      e.id,
      e.title,
      e.description,
      e.type,
      e."startDate",
      e."estimatedCost",
      e."paidAmount",
      e."mediaUrl",
      e."mediaType",
      e."schoolId",
      s."schoolName"
    FROM "Expense" e
    JOIN "School" s ON e."schoolId" = s.id
    ORDER BY s."schoolName" ASC, e."createdAt" DESC
  `);

  const financialAidRes = await pool.query(`
    SELECT
      sc.id as "schoolId",
      sc."schoolName",
      std.id as "standardId",
      std."standardName",
      std.division,
      std.stream,
      std.fees,
      COUNT(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Zakat%' THEN 1 END)::int as "zakatCount",
      COUNT(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Lillah%' THEN 1 END)::int as "lillahCount",
      COALESCE(SUM(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Zakat%' THEN stu."aidPaidAmount" ELSE 0 END), 0)::float as "zakatPaid",
      COALESCE(SUM(CASE WHEN stu."isNeedy" = true AND stu."sponsorshipType" ILIKE '%Lillah%' THEN stu."aidPaidAmount" ELSE 0 END), 0)::float as "lillahPaid",
      COUNT(stu.id)::int as "totalStudentsCount"
    FROM "School" sc
    JOIN "Standard" std ON sc.id = std."schoolId"
    LEFT JOIN "Student" stu ON std.id = stu."standardId"
    GROUP BY sc.id, sc."schoolName", std.id, std."standardName", std.division, std.stream, std.fees
    ORDER BY sc."schoolName" ASC, std."standardName" ASC, std.division ASC
  `);

  return NextResponse.json({
    expenses: expensesRes.rows,
    financialAid: financialAidRes.rows,
  });
}, { maxRequests: 60, cacheSeconds: 30 });
