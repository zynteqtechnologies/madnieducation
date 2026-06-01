const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query('ALTER TABLE "CareerOpportunity" ADD COLUMN IF NOT EXISTS "category" varchar(100);');
    await pool.query('ALTER TABLE "MentorshipOffer" ADD COLUMN IF NOT EXISTS "category" varchar(100);');
    console.log('Columns added successfully');
  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}
run();
