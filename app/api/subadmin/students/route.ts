import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const standardId = searchParams.get('standardId');

    let queryText = `
      SELECT s.*, std."standardName", std."division"
      FROM "Student" s
      LEFT JOIN "Standard" std ON s."standardId" = std."id"
      WHERE s."schoolId" = $1
    `;

    const params: any[] = [session.schoolId];

    if (standardId) {
      queryText += ' AND s."standardId" = $2';
      params.push(standardId);
    }

    queryText += ' ORDER BY s."createdAt" DESC';

    const result = await pool.query(queryText, params);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json({ error: 'Failed to retrieve student registry' }, { status: 500 });
  }
}
