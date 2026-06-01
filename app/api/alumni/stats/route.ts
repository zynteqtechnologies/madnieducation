import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionFromCookies('ALUMNI');
    if (!session || session.role !== 'ALUMNI') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const alumniQuery = `
      SELECT name, email, "batchYear", "linkedIn"
      FROM "Alumni"
      WHERE id = $1
    `;
    const alumniResult = await pool.query(alumniQuery, [session.userId]);
    const alumni = alumniResult.rows[0];

    const careerQuery = `SELECT COUNT(*) FROM "CareerOpportunity" WHERE "alumniId" = $1`;
    const mentorshipQuery = `SELECT COUNT(*) FROM "MentorshipOffer" WHERE "alumniId" = $1`;

    const [careerRes, mentorshipRes] = await Promise.all([
      pool.query(careerQuery, [session.userId]),
      pool.query(mentorshipQuery, [session.userId])
    ]);

    const donationQuery = `SELECT COALESCE(SUM(amount), 0) as total FROM "Transaction" WHERE "donorEmail" = $1 AND status = 'SUCCESS'`;
    const donationRes = await pool.query(donationQuery, [alumni.email]);
    const totalDonated = parseFloat(donationRes.rows[0].total) || 0;

    const urgentCauseQuery = `SELECT * FROM "Expense" WHERE "type" IN ('CONSTRUCTION', 'EVENT') ORDER BY "createdAt" DESC LIMIT 1`;
    const urgentCauseRes = await pool.query(urgentCauseQuery);
    const urgentCause = urgentCauseRes.rows[0] || null;

    return NextResponse.json({
      alumni,
      urgentCause,
      stats: {
        totalPosts: parseInt(careerRes.rows[0].count) + parseInt(mentorshipRes.rows[0].count),
        totalDonated
      }
    });

  } catch (error: any) {
    console.error('Failed to fetch alumni stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
