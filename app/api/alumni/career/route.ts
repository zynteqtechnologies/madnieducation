import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await pool.query(
      'SELECT * FROM "CareerOpportunity" WHERE "alumniId" = $1 ORDER BY "createdAt" DESC',
      [session.userId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Career fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, companyName, companyLink, role, relation, description } = await request.json();

    if (!type || !companyName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get alumni's schoolId to associate with the post
    const alumniRes = await pool.query('SELECT "schoolId" FROM "Alumni" WHERE id = $1', [session.userId]);
    const schoolId = alumniRes.rows[0]?.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'Institutional record not found' }, { status: 404 });
    }

    const result = await pool.query(`
      INSERT INTO "CareerOpportunity" (
        "alumniId", "schoolId", "type", "companyName", "companyLink", "role", "relation", "description", "status"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
      RETURNING *
    `, [session.userId, schoolId, type, companyName, companyLink, role, relation, description]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Career creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
