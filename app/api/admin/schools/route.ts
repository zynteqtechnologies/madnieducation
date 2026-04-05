import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

// GET all schools (with Trust name)
export async function GET() {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await query(`
      SELECT s.*, t."trustName" 
      FROM "School" s 
      LEFT JOIN "Trust" t ON s."trustId" = t.id 
      ORDER BY s."createdAt" DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch schools error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new school
export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      schoolName, 
      currentStudentsNo, 
      address, 
      phoneNo, 
      email, 
      medium, 
      schoolDiseNo, 
      isHaveRTE, 
      sscIndexNo, 
      hscIndexNo, 
      establishYear, 
      totalStandards,
      trustId 
    } = body;

    if (!schoolName || !trustId) {
      return NextResponse.json({ error: 'School Name and Trust are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO "School" 
      ("schoolName", "currentStudentsNo", "address", "phoneNo", "email", "medium", "schoolDiseNo", "isHaveRTE", "sscIndexNo", "hscIndexNo", "establishYear", "totalStandards", "trustId", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
      RETURNING *`,
      [
        schoolName, 
        currentStudentsNo || 0, 
        address || null, 
        phoneNo || null, 
        email || null, 
        medium || null, 
        schoolDiseNo || null, 
        isHaveRTE || false, 
        sscIndexNo || null, 
        hscIndexNo || null, 
        establishYear || null, 
        totalStandards || null,
        trustId
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Create school error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A school with this Dise No already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update school
export async function PUT(request: Request) {
    try {
      const session = await getSessionFromCookies('ADMIN');
      if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
  
      const body = await request.json();
      const { 
        id,
        schoolName, 
        currentStudentsNo, 
        address, 
        phoneNo, 
        email, 
        medium, 
        schoolDiseNo, 
        isHaveRTE, 
        sscIndexNo, 
        hscIndexNo, 
        establishYear, 
        totalStandards,
        trustId 
      } = body;
  
      if (!id || !schoolName || !trustId) {
        return NextResponse.json({ error: 'ID, School Name and Trust are required' }, { status: 400 });
      }
  
      const result = await query(
        `UPDATE "School" SET 
        "schoolName" = $1, 
        "currentStudentsNo" = $2, 
        "address" = $3, 
        "phoneNo" = $4, 
        "email" = $5, 
        "medium" = $6, 
        "schoolDiseNo" = $7, 
        "isHaveRTE" = $8, 
        "sscIndexNo" = $9, 
        "hscIndexNo" = $10, 
        "establishYear" = $11, 
        "totalStandards" = $12, 
        "trustId" = $13,
        "updatedAt" = NOW() 
        WHERE id = $14 RETURNING *`,
        [
          schoolName, 
          currentStudentsNo || 0, 
          address || null, 
          phoneNo || null, 
          email || null, 
          medium || null, 
          schoolDiseNo || null, 
          isHaveRTE || false, 
          sscIndexNo || null, 
          hscIndexNo || null, 
          establishYear || null, 
          totalStandards || null,
          trustId,
          id
        ]
      );
  
      if (result.rowCount === 0) {
          return NextResponse.json({ error: 'School not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } catch (error: any) {
      console.error('Update school error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE school
export async function DELETE(request: Request) {
    try {
      const session = await getSessionFromCookies('ADMIN');
      if (!session || session.role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
  
      const { id } = await request.json();
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  
      await query('DELETE FROM "School" WHERE id = $1', [id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Delete school error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
