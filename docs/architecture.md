# Architecture — RIKAS Website

## Stack

| Layer | Choice | Version |
|---|---|---|
| Frontend | Astro (SSR) | 5.x |
| CMS | Payload CMS | 3.x |
| Database | MongoDB | 7.x |
| Styling | CSS Variables + Vanilla | - |
| Reverse Proxy | Caddy | 2.x |
| Containerization | Docker Compose | - |
| Monorepo | pnpm workspaces | 9.x |

## Data Flow

```
Browser → Caddy → Astro (SSR) → Payload REST API → MongoDB
                        ↓
                   Static assets (images)
```

## Routing

| Path | Handler | Description |
|---|---|---|
| / | Astro | Homepage |
| /event, /event/[slug] | Astro | Events |
| /layanan, /layanan/[slug] | Astro | Services |
| /tim, /tim/[slug] | Astro | Team |
| /berita, /berita/[slug] | Astro | News |
| /galeri | Astro | Gallery |
| /kontak | Astro | Contact form |
| /api/contact | Astro API | Form submission |
| /api/health | Astro API | Health check |
| /api/rebuild | Astro API | Webhook trigger |
| /sitemap.xml | Astro API | SEO sitemap |
| /admin/* | Payload CMS | Admin panel |
| /api/* (cms) | Payload CMS | CMS REST API |

## Design Tokens

```css
--color-primary: #1b2a51    /* RIKAS navy */
--color-bg: #0a0f1e         /* Dark background */
--color-accent: #f97316     /* Orange accent */
--color-text: #ffffff       /* White text */
--color-text-muted: #94a3b8 /* Gray text */
```

## Security

- Honeypot spam protection on contact form
- Rate limiting (5 req/min/IP) on form submission
- CMS authentication with role-based access
- Caddy security headers (HSTS, nosniff, sameorigin)
- No third-party tracking pixels
