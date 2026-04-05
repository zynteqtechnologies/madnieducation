import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch both Jobs and Mentorships for this sub-admin's school
    const jobsRes = await pool.query(`
      SELECT c.*, a.name as "alumniName", a.email as "alumniEmail"
      FROM "CareerOpportunity" c
      JOIN "Alumni" a ON c."alumniId" = a.id
      WHERE c."schoolId" = $1
      ORDER BY c."createdAt" DESC
    `, [session.schoolId]);

    const mentorshipsRes = await pool.query(`
      SELECT m.*, a.name as "alumniName", a.email as "alumniEmail"
      FROM "MentorshipOffer" m
      JOIN "Alumni" a ON m."alumniId" = a.id
      WHERE m."schoolId" = $1
      ORDER BY m."createdAt" DESC
    `, [session.schoolId]);

    return NextResponse.json({
      jobs: jobsRes.rows,
      mentorships: mentorshipsRes.rows
    });

  } catch (error) {
    console.error('Interactions fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, type, status } = await request.json();

    if (!id || !type || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const table = type === 'job' ? 'CareerOpportunity' : 'MentorshipOffer';
    
    // Verify ownership before update
    const checkRes = await pool.query(`SELECT id FROM "${table}" WHERE id = $1 AND "schoolId" = $2`, [id, session.schoolId]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ error: 'Interaction not found for this school' }, { status: 404 });
    }

    const result = await pool.query(`
      UPDATE "${table}" 
      SET status = $1, "updatedAt" = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Interaction update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
