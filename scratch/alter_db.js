const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function main() {
  try {
    // Add paymentMode to Transaction
    await pool.query('ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "paymentMode" VARCHAR(50);');
    console.log("Added paymentMode column.");
  } catch (err) {
    console.error("DB QUERY ERROR:", err);
  } finally {
    await pool.end();
  }
}

main();
