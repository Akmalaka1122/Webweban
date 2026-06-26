import type { APIRoute } from 'astro';

export const prerender = false;

const REBUILD_SECRET = process.env.REBUILD_SECRET || '';

export const POST: APIRoute = async ({ request }) => {
  if (REBUILD_SECRET) {
    const auth = request.headers.get('x-rebuild-secret');
    if (auth !== REBUILD_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  console.log('Rebuild triggered at', new Date().toISOString());
  return new Response(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
