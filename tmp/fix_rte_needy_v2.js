const { Client } = require('pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_ZGcWI3SBP7eg@ep-tiny-cherry-a1tbrbem-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    const res = await client.query('UPDATE "Student" SET "isNeedy" = false WHERE "isUnderRTE" = true');
    console.log(`Updated ${res.rowCount} student records where RTE was true.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
    process.exit();
  }
}

run();
