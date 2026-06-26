/**
 * Seed script for RIKAS CMS
 * Run: npx tsx scripts/seed.ts
 */
import { getPayload } from 'payload';
import config from '../apps/cms/src/payload.config';

async function seed() {
  const payload = await getPayload({ config });

  // Create admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@rikas.id',
        password: 'changeme123',
        name: 'Admin RIKAS',
        role: 'admin',
      },
    });
    console.log('✅ Admin user created: admin@rikas.id');
  } catch (e: any) {
    if (e.message?.includes('unique')) {
      console.log('⏭️  Admin user already exists');
    } else throw e;
  }

  // Create editor user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'editor@rikas.id',
        password: 'changeme123',
        name: 'Editor RIKAS',
        role: 'editor',
      },
    });
    console.log('✅ Editor user created: editor@rikas.id');
  } catch (e: any) {
    if (e.message?.includes('unique')) {
      console.log('⏭️  Editor user already exists');
    } else throw e;
  }

  // Create sample services
  const services = [
    { title: 'Tournament Organizer', slug: 'tournament-organizer', icon: '🏆', description: { root: { children: [{ children: [{ text: 'Penyelenggaraan turnamen esports profesional skala regional hingga nasional.' }], type: 'paragraph', version: 1 }], type: 'root', version: 1 } } },
    { title: 'Live Streaming', slug: 'live-streaming', icon: '📡', description: { root: { children: [{ children: [{ text: 'Layanan siaran langsung turnamen dan acara dengan kualitas broadcast.' }], type: 'paragraph', version: 1 }], type: 'root', version: 1 } } },
    { title: 'Caster & MC', slug: 'caster-mc', icon: '🎙️', description: { root: { children: [{ children: [{ text: 'Talent caster dan MC berpengalaman untuk event esports.' }], type: 'paragraph', version: 1 }], type: 'root', version: 1 } } },
    { title: 'Cosplay', slug: 'cosplay', icon: '🎭', description: { root: { children: [{ children: [{ text: 'Perfomer cosplay profesional untuk memeriahkan event.' }], type: 'paragraph', version: 1 }], type: 'root', version: 1 } } },
    { title: 'Desain & Video', slug: 'desain-video', icon: '🎨', description: { root: { children: [{ children: [{ text: 'Produksi konten visual, grafis, dan video profesional.' }], type: 'paragraph', version: 1 }], type: 'root', version: 1 } } },
  ];

  for (const svc of services) {
    try {
      await payload.create({ collection: 'services', data: svc as any });
      console.log(`✅ Service created: ${svc.title}`);
    } catch (e: any) {
      if (e.message?.includes('unique')) console.log(`⏭️  Service exists: ${svc.title}`);
      else throw e;
    }
  }

  // Create sample event
  try {
    await payload.create({
      collection: 'events',
      data: {
        title: 'RIKAS Championship Season 3',
        slug: 'rikas-championship-s3',
        game: 'Mobile Legends',
        date: '2026-07-12',
        status: 'upcoming',
        location: 'Semarang',
        prize_pool: 'Rp 10.000.000',
        whatsapp_url: 'https://wa.me/6281234567890',
        description: { root: { children: [{ children: [{ text: 'Turnamen Mobile Legends terbesar di Jawa Tengah. Terbuka untuk semua tim.' }], type: 'paragraph', version: 1 }], type: 'root', version: 1 } },
      } as any,
    });
    console.log('✅ Sample event created');
  } catch (e: any) {
    console.log('⏭️  Sample event skipped:', e.message?.slice(0, 50));
  }

  console.log('\n🎉 Seed complete!');
  console.log('   Admin: admin@rikas.id / changeme123');
  console.log('   Editor: editor@rikas.id / changeme123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
