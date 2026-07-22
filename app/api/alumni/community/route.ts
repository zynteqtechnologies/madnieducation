import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session || session.role !== 'ALUMNI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'stories';

    if (tab === 'stories') {
      const res = await pool.query(`
        SELECT 
          b.id, b.title, b.content, b."mediaUrl", b."createdAt",
          a.name as "alumniName", a."currentTitle", a."batchYear", a."profilePic", a.id as "alumniId", a.email as "alumniEmail",
          s."schoolName"
        FROM "Blog" b
        JOIN "Alumni" a ON b."alumniId" = a.id
        JOIN "School" s ON b."schoolId" = s.id
        WHERE b.status = 'APPROVED'
        ORDER BY b."isTopFeatured" DESC, b."isFeatured" DESC, b."createdAt" DESC
        LIMIT 30
      `);
      return NextResponse.json({ items: res.rows });
    }

    if (tab === 'achievements') {
      const res = await pool.query(`
        SELECT 
          ac.id, ac.title, ac.description, ac.category, ac."mediaUrl", ac."createdAt",
          a.name as "alumniName", a."currentTitle", a."batchYear", a."profilePic", a.id as "alumniId", a.email as "alumniEmail",
          s."schoolName"
        FROM "Achievement" ac
        JOIN "Alumni" a ON ac."alumniId" = a.id
        JOIN "School" s ON ac."schoolId" = s.id
        WHERE ac.status = 'APPROVED'
        ORDER BY ac."isFeatured" DESC, ac."createdAt" DESC
        LIMIT 30
      `);
      return NextResponse.json({ items: res.rows });
    }

    if (tab === 'jobs') {
      let rows: any[] = [];
      try {
        const res = await pool.query(`
          SELECT 
            co.id, co.type, co."companyName", co."companyLink", co.role, co.relation, co.description, co."createdAt",
            a.name as "alumniName", a."currentTitle", a."batchYear", a."profilePic", a.id as "alumniId", a.email as "alumniEmail",
            s."schoolName"
          FROM "CareerOpportunity" co
          JOIN "Alumni" a ON co."alumniId" = a.id
          JOIN "School" s ON co."schoolId" = s.id
          WHERE co.status = 'APPROVED' AND co.type = 'JOB'
          ORDER BY co."createdAt" DESC
          LIMIT 30
        `);
        rows = res.rows;
      } catch (_) {}
      return NextResponse.json({ items: rows });
    }

    if (tab === 'internships') {
      let rows: any[] = [];
      try {
        const res = await pool.query(`
          SELECT 
            co.id, co.type, co."companyName", co."companyLink", co.role, co.relation, co.description, co."createdAt",
            a.name as "alumniName", a."currentTitle", a."batchYear", a."profilePic", a.id as "alumniId", a.email as "alumniEmail",
            s."schoolName"
          FROM "CareerOpportunity" co
          JOIN "Alumni" a ON co."alumniId" = a.id
          JOIN "School" s ON co."schoolId" = s.id
          WHERE co.status = 'APPROVED' AND co.type = 'INTERNSHIP'
          ORDER BY co."createdAt" DESC
          LIMIT 30
        `);
        rows = res.rows;
      } catch (_) {}
      return NextResponse.json({ items: rows });
    }

    if (tab === 'mentorships') {
      let rows: any[] = [];
      try {
        const res = await pool.query(`
          SELECT 
            mo.id, mo.title, mo.description, mo."targetStudent", mo.availability, mo."createdAt",
            a.name as "alumniName", a."currentTitle", a."batchYear", a."profilePic", a.id as "alumniId", a.email as "alumniEmail",
            s."schoolName"
          FROM "MentorshipOffer" mo
          JOIN "Alumni" a ON mo."alumniId" = a.id
          JOIN "School" s ON mo."schoolId" = s.id
          WHERE mo.status = 'APPROVED'
          ORDER BY mo."createdAt" DESC
          LIMIT 30
        `);
        rows = res.rows;
      } catch (_) {}
      return NextResponse.json({ items: rows });
    }

    if (tab === 'toppers') {
      const res = await pool.query(`
        SELECT 
          se.id,
          se."studentName",
          se."percentage",
          se."rank",
          se."marks",
          se."totalMarks",
          se."academicYear",
          std."standardName",
          std.stream,
          s."schoolName"
        FROM "StudentEnrollment" se
        JOIN "Standard" std ON se."standardId" = std.id
        JOIN "School" s ON se."schoolId" = s.id
        WHERE se."isTopper" = true
        ORDER BY s."schoolName" ASC, std."standardName" ASC, se."percentage" DESC NULLS LAST
        LIMIT 100
      `);
      return NextResponse.json({ items: res.rows });
    }

    return NextResponse.json({ items: [] });
  } catch (err: any) {
    console.error('Alumni community route error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
