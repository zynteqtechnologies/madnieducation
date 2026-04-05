import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies, hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'directory';

    if (type === 'eligible') {
      // Fetch Standard 10 students not already in Alumni table
      const result = await pool.query(`
        SELECT s.id, s.name, s."studentCode", std."standardName", std."batchYear"
        FROM "Student" s
        JOIN "Standard" std ON s."standardId" = std.id
        LEFT JOIN "Alumni" a ON s.id = a."studentId"
        WHERE s."schoolId" = $1 
        AND std."standardName" ILIKE '%10%'
        AND a.id IS NULL
      `, [session.schoolId]);
      return NextResponse.json(result.rows);
    } else {
      // Fetch Alumni directory
      const result = await pool.query(`
        SELECT * FROM "Alumni" 
        WHERE "schoolId" = $1 
        ORDER BY "batchYear" DESC, name ASC
      `, [session.schoolId]);
      return NextResponse.json(result.rows);
    }

  } catch (error: any) {
    console.error('Alumni fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { studentId, gmailId, linkedIn, batchYear } = await request.json();

    if (!studentId || !gmailId) {
      return NextResponse.json({ error: 'Student ID and Gmail are required' }, { status: 400 });
    }

    // Fetch student info
    const studentRes = await pool.query(
      'SELECT name FROM "Student" WHERE id = $1 AND "schoolId" = $2',
      [studentId, session.schoolId]
    );

    if (studentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const studentName = studentRes.rows[0].name;
    const generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 char hex password
    const hashedPassword = await hashPassword(generatedPassword);

    // Check if alumni already exists for this email
    const existing = await pool.query('SELECT id FROM "Alumni" WHERE email = $1', [gmailId]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Alumni with this email already exists' }, { status: 400 });
    }

    const result = await pool.query(`
      INSERT INTO "Alumni" (
        name, email, password, "linkedIn", "batchYear", "studentId", "schoolId"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [studentName, gmailId, hashedPassword, linkedIn || null, batchYear || 'Unknown', studentId, session.schoolId]);

    // Return the plain password to the admin so they can share it
    return NextResponse.json({
      ...result.rows[0],
      password: generatedPassword
    });

  } catch (error: any) {
    console.error('Alumni creation error:', error);
    return NextResponse.json({ error: 'Failed to authorize alumni conversion' }, { status: 500 });
  }
}
