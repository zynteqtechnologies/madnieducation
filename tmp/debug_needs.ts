import pool from '../lib/db';

async function check() {
  try {
    const exp = await pool.query('SELECT COUNT(*) as count FROM "Expense"');
    console.log('Total Expenses:', exp.rows[0].count);

    const std = await pool.query('SELECT COUNT(*) as count FROM "Standard"');
    console.log('Total Standards:', std.rows[0].count);

    const stu = await pool.query('SELECT COUNT(*) as count FROM "Student" WHERE "isNeedy" = true OR "underRTE" = true');
    console.log('Needy/RTE Students:', stu.rows[0].count);

    const schools = await pool.query('SELECT COUNT(*) as count FROM "School"');
    console.log('Total Schools:', schools.rows[0].count);

    const aidSample = await pool.query(`
      SELECT 
        sc."schoolName",
        std."standardName",
        stu."category",
        COUNT(stu.id) as count
      FROM "School" sc
      JOIN "Standard" std ON sc.id = std."schoolId"
      JOIN "Student" stu ON std.id = stu."standardId"
      WHERE stu."isNeedy" = true OR stu."underRTE" = true
      GROUP BY sc."schoolName", std."standardName", stu."category"
    `);
    console.log('Aid Data Rows:', aidSample.rows.length);
    if (aidSample.rows.length > 0) {
      console.log('Sample Aid Row:', aidSample.rows[0]);
    }

  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    process.exit();
  }
}

check();
