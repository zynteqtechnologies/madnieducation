const { Pool } = require('pg');
require('dotenv').config();

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

  try {
    const res = await pool.query('SELECT id, "trustName" FROM "Trust" ORDER BY "createdAt" DESC');
    console.log('Found trusts:', res.rows.length);

    if (res.rows.length >= 2) {
      // Update first trust
      await pool.query(
        'UPDATE "Trust" SET "presidentName" = $1, "trusteesName" = $2 WHERE id = $3',
        ['Maulana Abdul Rasheed', ['Hafiz Mohammed', 'Sufyan Qadri'], res.rows[0].id]
      );
      
      // Update second trust
      await pool.query(
        'UPDATE "Trust" SET "presidentName" = $1, "trusteesName" = $2 WHERE id = $3',
        ['Iqbal Ahmed Khan', ['Mushtaq Ahmed', 'Zubair Patel'], res.rows[1].id]
      );
      
      console.log('Successfully updated 2 trusts with unique data.');
    } else {
      console.log('Not enough trusts to update.');
    }
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
