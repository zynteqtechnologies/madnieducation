const pool = require('./lib/db');

async function run() {
  try {
    const db = pool.default || pool;
    const res = await db.query('UPDATE "Student" SET "isNeedy" = false WHERE "isUnderRTE" = true');
    console.log(`Updated ${res.rowCount} student records where RTE was true.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

run();
