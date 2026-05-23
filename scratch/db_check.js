const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function main() {
  try {
    const result = await pool.query('SELECT type, COUNT(*), SUM(amount) FROM "Transaction" GROUP BY type');
    console.log("TRANSACTION STATS:", result.rows);
    
    const all = await pool.query('SELECT id, type, amount, "schoolId", "donorName" FROM "Transaction" LIMIT 10');
    console.log("LAST 10 TRANSACTIONS:", all.rows);
  } catch (err) {
    console.error("DB QUERY ERROR:", err);
  } finally {
    await pool.end();
  }
}

main();
