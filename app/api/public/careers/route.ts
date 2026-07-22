import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.type,
        c.role,
        c."companyName",
        c."companyLink",
        c.relation,
        c.description,
        c.category,
        c.status,
        c."createdAt",
        COALESCE(s."schoolName", 'Madni Education Trust') AS "schoolName",
        COALESCE(a.name, 'Sub-Admin / School Trustee') AS "postedByName",
        a."currentTitle" AS "postedByTitle",
        a."batchYear" AS "postedByBatch",
        a."profilePic" AS "postedByAvatar"
      FROM "CareerOpportunity" c
      LEFT JOIN "School" s ON c."schoolId" = s.id
      LEFT JOIN "Alumni" a ON c."alumniId" = a.id
      WHERE c.status = 'APPROVED'
      ORDER BY c."createdAt" DESC
    `);

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    return NextResponse.json({ success: true, careers: result.rows }, { headers });
  } catch (error: any) {
    console.error('Error fetching public careers:', error);
    return NextResponse.json({ error: 'Failed to fetch public careers' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
