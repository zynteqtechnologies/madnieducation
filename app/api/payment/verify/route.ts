import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount,
      type,
      referenceId,
      schoolId,
      donorName,
      donorEmail,
      donorPhone
    } = await request.json();

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Database Update Transactionally
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Record Transaction
      await client.query(`
        INSERT INTO "Transaction" (
          amount, type, "donorName", "donorEmail", "donorPhone", 
          "razorpayPaymentId", "razorpayOrderId", status, "schoolId", "referenceId"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        amount, type, donorName || 'Anonymous', donorEmail, donorPhone,
        razorpay_payment_id, razorpay_order_id, 'SUCCESS', schoolId, referenceId
      ]);

      // Deduct from Expense or Student
      if (type === 'CONSTRUCTION' || type === 'EVENT') {
        await client.query(
          'UPDATE "Expense" SET "paidAmount" = "paidAmount" + $1 WHERE id = $2',
          [amount, referenceId]
        );
      } else if (['ZAKAT', 'LILLAH', 'SADKA'].includes(type!)) {
        // Distribute amount among needy students in this standard for this category
        const studentsRes = await client.query(`
          SELECT s.id, std.fees, s."aidPaidAmount"
          FROM "Student" s
          JOIN "Standard" std ON s."standardId" = std.id
          WHERE s."standardId" = $1 AND s."sponsorshipType" ILIKE $2 AND s."isNeedy" = true
          ORDER BY s.id ASC
        `, [referenceId, `%${type}%`]);

        let remaining = amount;
        for (const student of studentsRes.rows) {
          if (remaining <= 0) break;
          const needed = student.fees - student.aidPaidAmount;
          if (needed <= 0) continue;

          const toAdd = Math.min(remaining, needed);
          await client.query(
            'UPDATE "Student" SET "aidPaidAmount" = "aidPaidAmount" + $1 WHERE id = $2',
            [toAdd, student.id]
          );
          remaining -= toAdd;
        }
      }

      await client.query('COMMIT');
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Failed to verify institutional donation' }, { status: 500 });
  }
}
