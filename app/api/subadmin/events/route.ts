import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get events and their associated media
    const eventsQuery = `
      SELECT 
        e.*,
        json_agg(
          json_build_object(
            'id', m.id,
            'mediaType', m."mediaType",
            'url', m.url,
            'fileId', m."fileId"
          )
        ) FILTER (WHERE m.id IS NOT NULL) as media
      FROM "Event" e
      LEFT JOIN "EventMedia" m ON e.id = m."eventId"
      WHERE e."schoolId" = $1
      GROUP BY e.id
      ORDER BY e.date DESC, e."createdAt" DESC
    `;

    const result = await pool.query(eventsQuery, [session.schoolId]);
    
    // Default media to empty array if null
    const events = result.rows.map(row => ({
      ...row,
      media: row.media || []
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, date } = await request.json();

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and Date are required' }, { status: 400 });
    }

    const query = `
      INSERT INTO "Event" (title, description, date, "schoolId")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, date, session.schoolId]);

    return NextResponse.json({ ...result.rows[0], media: [] }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromCookies('ADMIN');
    if (!session || session.role !== 'SUB_ADMIN' || !session.schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await pool.query('DELETE FROM "Event" WHERE id = $1 AND "schoolId" = $2', [id, session.schoolId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
