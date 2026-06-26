/**
 * Seed script for RIKAS CMS
 * Run: npx tsx scripts/seed.ts
 */
import { getPayload } from 'payload';
import config from '../apps/cms/src/payload.config';

async function seed() {
  const payload = await getPayload({ config });

  // Create admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@rikas.id',
      password: 'changeme123',
      name: 'Admin RIKAS',
      role: 'admin',
    },
  });

  console.log('✅ Seed complete: admin user created');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
