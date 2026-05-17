import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { expenses, schools } from '@/lib/db/schema';
import { getSessionFromCookies } from '@/lib/auth';
import { uploadMedia } from '@/lib/imagekit';
import { desc, eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const session = await getSessionFromCookies('SUB_ADMIN');
    if (!session || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await db.query.expenses.findMany({
      where: eq(expenses.schoolId, session.schoolId),
      orderBy: [desc(expenses.createdAt)],
      limit: limit,
      offset: offset,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to fetch expenses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('SUB_ADMIN');
    if (!session || !session.schoolId) {
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

    // Fetch school name for folder structure using Drizzle
    const school = await db.query.schools.findFirst({
      where: eq(schools.id, session.schoolId),
      columns: { schoolName: true }
    });
    
    const schoolName = school?.schoolName || 'UnknownSchool';
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

    const [newExpense] = await db.insert(expenses).values({
      title,
      description: description || null,
      type,
      startDate: startDate ? startDate : null, // Drizzle date column usually takes string 'YYYY-MM-DD'
      estimatedCost: estimatedCost || '0',
      mediaUrl,
      mediaType,
      schoolId: session.schoolId
    }).returning();

    return NextResponse.json(newExpense);

  } catch (error: any) {
    console.error('Failed to create expense:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
