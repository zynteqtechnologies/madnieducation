import pool from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function initTables() {
  try {
    console.log('Initializing Alumni Interaction tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "CareerOpportunity" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "alumniId" UUID REFERENCES "Alumni"(id) ON DELETE CASCADE,
        "schoolId" UUID REFERENCES "School"(id) ON DELETE CASCADE,
        "type" VARCHAR(20) CHECK ("type" IN ('JOB', 'INTERNSHIP')),
        "companyName" VARCHAR(255) NOT NULL,
        "companyLink" TEXT,
        "role" VARCHAR(255) NOT NULL,
        "relation" TEXT,
        "description" TEXT,
        "status" VARCHAR(20) DEFAULT 'PENDING' CHECK ("status" IN ('PENDING', 'APPROVED', 'REJECTED')),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "MentorshipOffer" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "alumniId" UUID REFERENCES "Alumni"(id) ON DELETE CASCADE,
        "schoolId" UUID REFERENCES "School"(id) ON DELETE CASCADE,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "targetStudent" TEXT,
        "availability" TEXT,
        "status" VARCHAR(20) DEFAULT 'PENDING' CHECK ("status" IN ('PENDING', 'APPROVED', 'REJECTED')),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tables created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

initTables();
