import type { APIRoute } from 'astro';

export const prerender = false;

const rateLimit = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Data tidak valid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot
  if (body.website) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // Validate
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push('Nama wajib diisi');
  if (!body.type) errors.push('Jenis pesan wajib dipilih');
  if (!body.message?.trim()) errors.push('Pesan wajib diisi');

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: errors.join(', ') }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Store in CMS
  const CMS_URL = import.meta.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001';
  try {
    await fetch(`${CMS_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name.trim(),
        email: body.email?.trim() || '',
        whatsapp: body.whatsapp?.trim() || '',
        type: body.type,
        message: body.message.trim(),
        status: 'new',
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('CMS inquiry save failed:', err);
    // Continue — don't block user if CMS is down
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
