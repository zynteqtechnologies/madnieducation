import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mentorshipOffers, alumni } from '@/lib/db/schema';
import { getSessionFromCookies } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const session = await getSessionFromCookies('ALUMNI');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await db.query.mentorshipOffers.findMany({
      where: eq(mentorshipOffers.alumniId, session.userId),
      orderBy: [desc(mentorshipOffers.createdAt)],
      limit: limit,
      offset: offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Mentorship fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description, targetStudent, availability, category } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get alumni's schoolId using Drizzle
    const alumniRecord = await db.query.alumni.findFirst({
      where: eq(alumni.id, session.userId),
      columns: { schoolId: true }
    });
    
    const schoolId = alumniRecord?.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'Institutional record not found' }, { status: 404 });
    }

    const [newOffer] = await db.insert(mentorshipOffers).values({
      alumniId: session.userId,
      schoolId,
      title,
      description,
      targetStudent,
      availability,
      category,
      status: 'PENDING'
    }).returning();

    return NextResponse.json(newOffer);
  } catch (error) {
    console.error('Mentorship creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
