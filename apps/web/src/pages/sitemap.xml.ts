import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const base = 'https://rikas.id';
  const pages = ['/', '/event', '/layanan', '/tim', '/berita', '/galeri', '/kontak'];
  
  const urls = pages.map(p => `  <url>
    <loc>${base}${p}</loc>
    <changefreq>${p === '/' ? 'weekly' : 'monthly'}</changefreq>
  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
