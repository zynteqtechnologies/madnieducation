import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_ZGcWI3SBP7eg@ep-tiny-cherry-a1tbrbem-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function check() {
  try {
    const exp = await pool.query('SELECT COUNT(*) as count FROM "Expense"');
    console.log('Total Expenses:', exp.rows[0].count);

    const stu = await pool.query('SELECT COUNT(*) as count FROM "Student"');
    console.log('Total Students:', stu.rows[0].count);

    const needy = await pool.query('SELECT COUNT(*) as count FROM "Student" WHERE "isNeedy" = true OR "underRTE" = true');
    console.log('Needy/RTE Students:', needy.rows[0].count);

    const aidData = await pool.query(`
      SELECT 
        stu.id,
        stu."isNeedy",
        stu."underRTE",
        stu."category",
        stu."standardId"
      FROM "Student" stu
      WHERE stu."isNeedy" = true OR stu."underRTE" = true
      LIMIT 10
    `);
    console.log('Sample Needy Data:', aidData.rows);

    const expenses = await pool.query('SELECT * FROM "Expense" LIMIT 5');
    console.log('Sample Expenses:', expenses.rows);

  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    await pool.end();
    process.exit();
  }
}

check();
