import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { achievements, alumni } from '@/lib/db/schema';
import { getSessionFromCookies } from '@/lib/auth';
import { uploadMedia } from '@/lib/imagekit';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userAchievements = await db.query.achievements.findMany({
      where: eq(achievements.alumniId, session.userId),
      orderBy: [desc(achievements.createdAt)],
    });

    return NextResponse.json(userAchievements);
  } catch (error) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as string;
    const mediaType = formData.get('mediaType') as string;
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get alumni's schoolId
    const alumniRecord = await db.query.alumni.findFirst({
      where: eq(alumni.id, session.userId),
    });

    if (!alumniRecord?.schoolId) {
      return NextResponse.json({ error: 'Institutional record not found' }, { status: 404 });
    }

    let mediaUrl = '';
    if (mediaType === 'IMAGE') {
      const file = formData.get('file') as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult: any = await uploadMedia(buffer, file.name, 'alumni/achievements', true);
        mediaUrl = uploadResult.secure_url;
      }
    } else if (mediaType === 'VIDEO') {
      mediaUrl = formData.get('mediaUrl') as string;
    }

    const [newAchievement] = await db.insert(achievements).values({
      alumniId: session.userId,
      schoolId: alumniRecord.schoolId,
      title,
      description,
      date,
      category,
      mediaUrl,
      mediaType,
      status: 'PENDING',
    }).returning();

    return NextResponse.json(newAchievement);
  } catch (error) {
    console.error('Achievement creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
