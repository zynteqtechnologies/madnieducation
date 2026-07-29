import { pgTable, uuid, varchar, integer, text, timestamp, boolean, decimal, pgEnum, date, jsonb } from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum('Role', ['SUPER_ADMIN', 'SUB_ADMIN', 'ALUMNI']);
export const careerTypeEnum = pgEnum('CareerType', ['JOB', 'INTERNSHIP']);
export const statusEnum = pgEnum('Status', ['PENDING', 'APPROVED', 'REJECTED']);

// Trust Table
export const trusts = pgTable('Trust', {
  id: uuid('id').defaultRandom().primaryKey(),
  trustName: varchar('trustName', { length: 255 }).notNull(),
  registrationNo: varchar('registrationNo', { length: 255 }).unique().notNull(),
  establishmentYear: integer('establishmentYear'),
  presidentName: varchar('presidentName', { length: 255 }),
  presidentNo: varchar('presidentNo', { length: 20 }),
  trusteesName: text('trusteesName').array(),
  trusteesNo: text('trusteesNo').array(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// School Table
export const schools = pgTable('School', {
  id: uuid('id').defaultRandom().primaryKey(),
  schoolName: varchar('schoolName', { length: 255 }).notNull(),
  currentStudentsNo: integer('currentStudentsNo').default(0),
  address: text('address'),
  phoneNo: varchar('phoneNo', { length: 20 }),
  email: varchar('email', { length: 255 }),
  medium: varchar('medium', { length: 100 }),
  schoolDiseNo: varchar('schoolDiseNo', { length: 100 }).unique(),
  isHaveRTE: boolean('isHaveRTE').default(false),
  sscIndexNo: varchar('sscIndexNo', { length: 100 }),
  hscIndexNo: varchar('hscIndexNo', { length: 100 }),
  establishYear: integer('establishYear'),
  totalStandards: integer('totalStandards'),
  imageUrls: text('imageUrls').array(),
  trustId: uuid('trustId').references(() => trusts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// User Table
export const users = pgTable('User', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull(), // Using varchar instead of Enum for existing compatibility
  phoneNo: varchar('phoneNo', { length: 20 }),
  address: text('address'),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'set null' }),
  relation: varchar('relation', { length: 100 }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Alumni Table
export const alumni = pgTable('Alumni', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('studentId'),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default('ALUMNI').notNull(),
  batchYear: varchar('batchYear', { length: 100 }),
  profilePic: text('profilePic'),
  currentTitle: varchar('currentTitle', { length: 255 }),
  currentBio: text('currentBio'),
  workLink: text('workLink'),
  linkedIn: text('linkedIn'),
  isFeatured: boolean('isFeatured').default(false),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});

// Standard Table
export const standards = pgTable('Standard', {
  id: uuid('id').defaultRandom().primaryKey(),
  standardName: varchar('standardName', { length: 100 }).notNull(),
  division: varchar('division', { length: 100 }),
  stream: varchar('stream', { length: 100 }),
  fees: decimal('fees', { precision: 10, scale: 2 }).default('0'),
  batchYear: varchar('batchYear', { length: 100 }),
  schoolId: uuid('schoolId').notNull().references(() => schools.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});

// Student Table
export const students = pgTable('Student', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  studentCode: varchar('studentCode', { length: 100 }),
  category: varchar('category', { length: 100 }),
  userIdRef: varchar('userIdRef', { length: 100 }),
  admissionDate: date('admissionDate'),
  grSrNo: varchar('grSrNo', { length: 100 }),
  admissionType: varchar('admissionType', { length: 100 }),
  dateOfBirth: date('dateOfBirth'),
  age: integer('age'),
  gender: varchar('gender', { length: 50 }),
  contactNo: varchar('contactNo', { length: 50 }),
  aadharNo: varchar('aadharNo', { length: 50 }),
  panNo: varchar('panNo', { length: 50 }),
  apaarId: varchar('apaarId', { length: 100 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }),
  fatherName: varchar('fatherName', { length: 255 }),
  fatherNumber: varchar('fatherNumber', { length: 50 }),
  motherName: varchar('motherName', { length: 255 }),
  motherNumber: varchar('motherNumber', { length: 50 }),
  accountHolderName: varchar('accountHolderName', { length: 255 }),
  accountNumber: varchar('accountNumber', { length: 100 }),
  bankName: varchar('bankName', { length: 255 }),
  ifscCode: varchar('ifscCode', { length: 50 }),
  sponsorshipType: varchar('sponsorshipType', { length: 100 }),
  aidPaidAmount: decimal('aidPaidAmount', { precision: 10, scale: 2 }).default('0'),
  isNeedy: boolean('isNeedy').default(false),
  isUnderRTE: boolean('isUnderRTE').default(false),
  currentClass: varchar('currentClass', { length: 100 }),
  section: varchar('section', { length: 50 }),
  standardId: uuid('standardId').references(() => standards.id, { onDelete: 'set null' }),
  schoolId: uuid('schoolId').notNull().references(() => schools.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});

// Career Opportunity Table
export const careerOpportunities = pgTable('CareerOpportunity', {
  id: uuid('id').defaultRandom().primaryKey(),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }), // JOB or INTERNSHIP
  companyName: varchar('companyName', { length: 255 }).notNull(),
  companyLink: text('companyLink'),
  role: varchar('role', { length: 255 }).notNull(),
  relation: text('relation'),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  status: varchar('status', { length: 20 }).default('PENDING'), // PENDING, APPROVED, REJECTED
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Mentorship Offer Table
export const mentorshipOffers = pgTable('MentorshipOffer', {
  id: uuid('id').defaultRandom().primaryKey(),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  targetStudent: text('targetStudent'),
  availability: text('availability'),
  category: varchar('category', { length: 100 }),
  status: varchar('status', { length: 20 }).default('PENDING'), // PENDING, APPROVED, REJECTED
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Public registration / application interest for alumni-posted opportunities
export const opportunityRegistrations = pgTable('OpportunityRegistration', {
  id: uuid('id').defaultRandom().primaryKey(),
  postType: varchar('postType', { length: 20 }).notNull(), // CAREER or MENTORSHIP
  postId: uuid('postId').notNull(),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phoneNo: varchar('phoneNo', { length: 30 }).notNull(),
  linkedInUrl: text('linkedInUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
});

// Expense Table
export const expenses = pgTable('Expense', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // CONSTRUCTION or EVENT
  startDate: date('startDate'),
  estimatedCost: decimal('estimatedCost', { precision: 12, scale: 2 }).default('0'),
  paidAmount: decimal('paidAmount', { precision: 12, scale: 2 }).default('0'),
  mediaUrl: text('mediaUrl'),
  mediaType: varchar('mediaType', { length: 50 }), // IMAGE or VIDEO
  schoolId: uuid('schoolId').notNull().references(() => schools.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(),
});

// Blog Table
export const blogs = pgTable('Blog', {
  id: uuid('id').defaultRandom().primaryKey(),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  tags: text('tags').array(), // Optional tags
  mediaUrl: text('mediaUrl'),
  mediaType: varchar('mediaType', { length: 50 }), // IMAGE or VIDEO
  status: varchar('status', { length: 20 }).default('PENDING'), // PENDING, APPROVED, REJECTED
  isFeatured: boolean('isFeatured').default(false),
  isTopFeatured: boolean('isTopFeatured').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Achievement Table
export const achievements = pgTable('Achievement', {
  id: uuid('id').defaultRandom().primaryKey(),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  date: date('date'), // When the achievement was earned
  category: varchar('category', { length: 100 }), // e.g., Academic, Professional, Sports
  mediaUrl: text('mediaUrl'), // Optional proof image/document
  mediaType: varchar('mediaType', { length: 50 }), // IMAGE or VIDEO
  status: varchar('status', { length: 20 }).default('PENDING'), // PENDING, APPROVED, REJECTED
  isFeatured: boolean('isFeatured').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Academic Year Table
export const academicYears = pgTable('AcademicYear', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: varchar('label', { length: 100 }).notNull(), // e.g., 2023-24
  isActive: boolean('isActive').default(false),
  statusTag: varchar('statusTag', { length: 50 }).default('CURRENT'), // PREVIOUS, CURRENT, UPCOMING
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Student Enrollment Table (History)
export const studentEnrollments = pgTable('StudentEnrollment', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('studentId').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  standardId: uuid('standardId').references(() => standards.id, { onDelete: 'cascade' }).notNull(),
  academicYearId: uuid('academicYearId').references(() => academicYears.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 50 }).default('ACTIVE'), // ACTIVE, PROMOTED, REPEATING, DROPPED, GRADUATED
  rank: integer('rank'), // 1, 2, 3 for toppers
  percentage: decimal('percentage', { precision: 5, scale: 2 }), // e.g. 95.50
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Event Table
export const events = pgTable('Event', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  tagline: text('tagline'),
  description: text('description'),
  points: jsonb('points'),
  featuredImage: text('featuredImage'),
  category: varchar('category', { length: 100 }),
  date: date('date'),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Event Media Table
export const eventMedia = pgTable('EventMedia', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('eventId').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  mediaType: varchar('mediaType', { length: 50 }).notNull(), // IMAGE or VIDEO
  url: text('url').notNull(),
  fileId: varchar('fileId', { length: 255 }), // ImageKit file ID
  createdAt: timestamp('createdAt').defaultNow(),
});

// Mission Stats Table (For Home Page "Our Mission in Numbers")
export const missionStats = pgTable('MissionStat', {
  id: uuid('id').defaultRandom().primaryKey(),
  target: integer('target').notNull(),
  prefix: varchar('prefix', { length: 50 }),
  suffix: varchar('suffix', { length: 50 }),
  label: varchar('label', { length: 255 }).notNull(),
  desc: text('desc').notNull(),
  orderNo: integer('orderNo').default(0),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Public news / announcement / event updates for userside homepage
export const newsUpdates = pgTable('NewsUpdate', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  publishDate: date('publishDate'),
  imageUrl: text('imageUrl'),
  imageFileId: varchar('imageFileId', { length: 255 }),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'set null' }),
  isActive: boolean('isActive').default(true),
  createdByRole: varchar('createdByRole', { length: 50 }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Subadmin-managed content for each public school detail page
export const schoolPageContents = pgTable('SchoolPageContent', {
  id: uuid('id').defaultRandom().primaryKey(),
  schoolId: uuid('schoolId').notNull().unique().references(() => schools.id, { onDelete: 'cascade' }),
  tagline: text('tagline'),
  aboutTitle: varchar('aboutTitle', { length: 255 }),
  aboutDescription: text('aboutDescription'),
  aboutHighlights: text('aboutHighlights').array(),
  academicPrograms: jsonb('academicPrograms').$type<Array<{
    id: string;
    category: string;
    description?: string;
    standardIds: string[];
    subjects: string[];
  }>>().default([]),
  facilities: jsonb('facilities').$type<Array<{
    id: string;
    icon: string;
    name: string;
    detail: string;
  }>>().default([]),
  activityCategories: jsonb('activityCategories').$type<Array<{
    id: string;
    icon: string;
    category: string;
    items: Array<{ name: string; desc: string }>;
  }>>().default([]),
  teachers: jsonb('teachers').$type<Array<{
    id: string;
    name: string;
    designation: string;
    qualification: string;
    experience: string;
    subject: string;
    standardIds: string[];
  }>>().default([]),
  admissionInfo: jsonb('admissionInfo').$type<{
    currentlyOpen?: boolean;
    session?: string;
    openClasses?: string[];
    process?: string[];
    documents?: string[];
    feeNote?: string;
  }>().default({}),
  donationInfo: jsonb('donationInfo').$type<{
    headline?: string;
    subline?: string;
    amounts?: Array<{ label: string; amount: string; type?: string; standardIds?: string[] }>;
  }>().default({}),
  updatedBy: uuid('updatedBy').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Alumni of the Year Table
export const alumniOfTheYear = pgTable('AlumniOfTheYear', {
  id: uuid('id').defaultRandom().primaryKey(),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }).notNull(),
  year: integer('year').notNull(),
  headline: varchar('headline', { length: 255 }).notNull(),
  reason: text('reason').notNull(),
  highlights: text('highlights').array(),
  totalFinancialAid: decimal('totalFinancialAid', { precision: 12, scale: 2 }),
  studentsHelpedCount: integer('studentsHelpedCount'),
  jobsPostedCount: integer('jobsPostedCount'),
  mentorshipsCount: integer('mentorshipsCount'),
  mediaUrl: text('mediaUrl'),
  awardedByUserId: text('awardedByUserId'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// Alumni Contributions Table
export const alumniContributions = pgTable('AlumniContribution', {
  id: uuid('id').defaultRandom().primaryKey(),
  alumniId: uuid('alumniId').references(() => alumni.id, { onDelete: 'cascade' }).notNull(),
  schoolId: uuid('schoolId').references(() => schools.id, { onDelete: 'cascade' }),
  contributionType: varchar('contributionType', { length: 50 }).notNull(), // FINANCIAL, GOODS, MENTORSHIP, REFERRAL, EVENT
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  amount: decimal('amount', { precision: 12, scale: 2 }),
  quantity: varchar('quantity', { length: 100 }),
  date: date('date').defaultNow(),
  proofUrl: text('proofUrl'),
  status: varchar('status', { length: 20 }).default('APPROVED'),
  isPublic: boolean('isPublic').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

