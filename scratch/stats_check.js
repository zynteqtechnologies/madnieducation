const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function main() {
  try {
    const schoolRes = await pool.query('SELECT id, "schoolName" FROM "School"');
    console.log("SCHOOLS:", schoolRes.rows);
    
    for (const school of schoolRes.rows) {
      console.log(`\n--- Stats for ${school.schoolName} (${school.id}) ---`);
      
      const statsQuery = `
        SELECT 
          (SELECT COUNT(*) FROM "Student" WHERE "schoolId" = $1) as "totalStudents",
          (SELECT COUNT(*) FROM "Standard" WHERE "schoolId" = $1) as "activeStandards",
          (SELECT COALESCE(SUM(amount), 0) FROM "Transaction" WHERE "schoolId" = $1) as "totalDonations",
          (SELECT COALESCE(SUM(amount), 0) FROM "Transaction" WHERE "schoolId" = $1 AND type = 'CONSTRUCTION') as "constructionDonations",
          (SELECT COALESCE(SUM(amount), 0) FROM "Transaction" WHERE "schoolId" = $1 AND type IN ('ZAKAT', 'LILLAH', 'SADKA', 'FINANCIAL_AID')) as "financialAidDonations"
      `;
      const res = await pool.query(statsQuery, [school.id]);
      console.log("STATS:", res.rows[0]);

      const txs = await pool.query('SELECT type, amount FROM "Transaction" WHERE "schoolId" = $1', [school.id]);
      console.log("TRANSACTIONS IN DB FOR THIS SCHOOL:", txs.rows);
    }
  } catch (err) {
    console.error("DB QUERY ERROR:", err);
  } finally {
    await pool.end();
  }
}

main();
