const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_ZGcWI3SBP7eg@ep-tiny-cherry-a1tbrbem-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Initiating database migration for Expense Management...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Expense" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL, -- 'CONSTRUCTION' or 'EVENT'
        "startDate" DATE,
        "estimatedCost" DECIMAL(12, 2) DEFAULT 0,
        "mediaUrl" TEXT,
        "mediaType" VARCHAR(50), -- 'IMAGE' or 'VIDEO'
        "schoolId" UUID NOT NULL REFERENCES "School"(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('--- "Expense" table initialized.');

  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
