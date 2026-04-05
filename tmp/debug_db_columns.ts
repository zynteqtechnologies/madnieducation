import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_ZGcWI3SBP7eg@ep-tiny-cherry-a1tbrbem-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function check() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Student'");
    console.log('Student Columns:', res.rows.map(r => r.column_name));

    const sample = await pool.query('SELECT "isNeedy", "isUnderRTE", "category", "sponsorshipType" FROM "Student" WHERE "isNeedy" = true LIMIT 5');
    console.log('Sample Data:', sample.rows);

  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

check();
