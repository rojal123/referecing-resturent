// One-off utility: creates the admin login, or resets its password if that
// admin already exists. Useful when you just need to (re)set the admin
// password without reseeding the whole menu (see scripts/seed.js for that).
//
// This writes to the "admins" collection -- entirely separate from the
// "users" collection used by customers. The password is bcrypt-hashed
// before it touches the database; it is never stored in plain text.
//
// For local development/testing. Override the defaults below with real
// values via environment variables before running this anywhere public:
//
//   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=... node scripts/createAdmin.js
//
// Run with defaults from the backend folder:
//   node scripts/createAdmin.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const ADMIN_USERNAME = process.env.SEED_ADMIN_EMAIL || 'admin@tavola.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'change-me-now';

async function run() {
  await connectDB();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await Admin.findOne({ adminUsername: ADMIN_USERNAME });

  if (existing) {
    existing.adminPassword = passwordHash;
    await existing.save();
    console.log(`Updated password for existing admin "${ADMIN_USERNAME}".`);
  } else {
    await Admin.create({ adminUsername: ADMIN_USERNAME, adminPassword: passwordHash });
    console.log(`Created new admin account "${ADMIN_USERNAME}".`);
  }

  console.log('Done. You can now log in with:');
  console.log(`  Email:    ${ADMIN_USERNAME}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to create/update admin account:', err.message);
  process.exit(1);
});
