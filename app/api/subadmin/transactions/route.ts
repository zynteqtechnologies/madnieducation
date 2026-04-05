import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(`
      SELECT * FROM "Transaction" 
      WHERE "schoolId" = $1 
      ORDER BY "createdAt" DESC
    `, [session.schoolId]);

    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
