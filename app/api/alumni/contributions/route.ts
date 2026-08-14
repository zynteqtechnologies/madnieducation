import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeUuid(value: string | null) {
  if (!value || value === 'undefined' || value === 'null') return null;
  return uuidRegex.test(value) ? value : null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getSessionFromCookies('ALUMNI');
    const alumniId = normalizeUuid(searchParams.get('alumniId')) || (session?.role === 'ALUMNI' ? session.userId : null);
    const schoolId = normalizeUuid(searchParams.get('schoolId'));

    let query = `
      SELECT ac.*, a.name as "alumniName", a."profilePic" as "alumniProfilePic", s."schoolName"
      FROM "AlumniContribution" ac
      JOIN "Alumni" a ON ac."alumniId" = a.id
      LEFT JOIN "School" s ON ac."schoolId" = s.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (alumniId) {
      params.push(alumniId);
      conditions.push(`ac."alumniId" = $${params.length}`);
    }

    if (schoolId) {
      params.push(schoolId);
      conditions.push(`ac."schoolId" = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY ac.date DESC, ac."createdAt" DESC`;

    const res = await pool.query(query, params);
    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    const body = await request.json();
    const { contributionType, title, description, amount, quantity, proofUrl, isPublic } = body;
    const alumniId = normalizeUuid(body.alumniId) || (session?.role === 'ALUMNI' ? session.userId : null);
    const schoolId = normalizeUuid(body.schoolId);

    if (!alumniId || !contributionType || !title) {
      return NextResponse.json({ error: 'Missing required fields: alumniId, contributionType, title' }, { status: 400 });
    }

    const res = await pool.query(`
      INSERT INTO "AlumniContribution" (
        "alumniId", "schoolId", "contributionType", "title", "description",
        "amount", "quantity", "proofUrl", "isPublic", "status"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'APPROVED')
      RETURNING *
    `, [
      alumniId,
      schoolId || null,
      contributionType,
      title,
      description || null,
      amount ? parseFloat(amount) : null,
      quantity || null,
      proofUrl || null,
      isPublic !== undefined ? isPublic : true
    ]);

    return NextResponse.json({ success: true, contribution: res.rows[0] });
  } catch (error: any) {
    console.error('Error saving contribution:', error);
    return NextResponse.json({ error: 'Failed to save contribution' }, { status: 500 });
  }
}
