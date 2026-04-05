import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import { uploadMedia } from '@/lib/cloudinary';

export async function GET() {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await pool.query(
      'SELECT * FROM "Expense" WHERE "schoolId" = $1 ORDER BY "createdAt" DESC',
      [session.schoolId]
    );

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string; // 'CONSTRUCTION' or 'EVENT'
    const startDate = formData.get('startDate') as string;
    const estimatedCost = formData.get('estimatedCost') as string;
    const file = formData.get('media') as File | null;

    if (!title || !type) {
      return NextResponse.json({ error: 'Title and Type are required' }, { status: 400 });
    }

    // Fetch school name for folder structure
    const schoolRes = await pool.query('SELECT "schoolName" FROM "School" WHERE id = $1', [session.schoolId]);
    const schoolName = schoolRes.rows[0]?.schoolName || 'UnknownSchool';
    const folderPath = `${schoolName}/construction-event-cost`;

    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const isImage = file.type.startsWith('image/');
      
      const uploadResult: any = await uploadMedia(buffer, file.name, folderPath, isImage);
      mediaUrl = uploadResult.secure_url;
      mediaType = isImage ? 'IMAGE' : 'VIDEO';
    }

    const result = await pool.query(
      `INSERT INTO "Expense" (
        title, description, type, "startDate", "estimatedCost", "mediaUrl", "mediaType", "schoolId"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        title, 
        description || null, 
        type, 
        startDate ? new Date(startDate) : null, 
        parseFloat(estimatedCost) || 0, 
        mediaUrl, 
        mediaType, 
        session.schoolId
      ]
    );

    return NextResponse.json(result.rows[0]);

  } catch (error: any) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
