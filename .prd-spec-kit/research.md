# Research Log — RIKAS EO Website Technical Decisions

> **Tech decisions with rationale, alternatives considered, and rejected reasons.** This document captures the "why" behind every major choice in `plan.md`.

**Created**: 2026-06-25
**Status**: Living document (updated when new tech decisions arise)

---

## Decision 1: CMS Choice

### Options Considered

| Option | Type | License | Self-hosted | TS-native | Admin UX | Ecosystem |
|---|---|---|---|---|---|---|
| **Payload CMS 3** | Node.js + MongoDB | MIT | ✅ | ✅ | Modern React | Mature |
| **Strapi 5** | Node.js + Postgres/SQLite/Mongo | Open Core (paid cloud) | ✅ | ✅ | Modern React | Mature |
| **Directus** | Node.js + Postgres/MySQL/MariaDB | BSL (free for non-commercial) | ✅ | ⚠ Partial | Good | Mature |
| **Sanity** | SaaS + Node.js client | Commercial (free tier) | ❌ SaaS | ✅ | Excellent | Mature |
| **KeystoneJS** | Node.js + Postgres | MIT | ✅ | ✅ | Basic | Smaller |
| **Ghost** | Node.js + SQLite/Postgres | MIT | ✅ | ❌ JS | Polished | Niche (blog-focused) |
| **WordPress** | PHP + MySQL | GPL | ✅ | ❌ PHP | Legacy | Massive |
| **Contentful** | SaaS | Commercial | ❌ SaaS | ✅ | Excellent | Enterprise |

### Chosen: Payload CMS 3

**Rationale**:
1. **Self-hosted requirement** (Constitution §VI) eliminates Sanity, Contentful
2. **TypeScript-native** matches our stack — types generated from collection schemas
3. **MIT license** — no commercial lock-in or paid tier surprises
4. **MongoDB adapter** — fits our document model preference, no SQL dependency
5. **Modern React admin** — familiar to developers, polished UX
6. **Active development** — Payload 3.0 released 2025, regular updates
7. **Built-in features** — auth, access control, rich text editor, image upload, hooks — all included

**Why not Strapi 5**: Strapi v5 moved to a cloud-first paid model. The "self-hosted free" version is becoming increasingly feature-limited. The risk of feature erosion is too high for a multi-year project.

**Why not Directus**: BSL license is restrictive for commercial use. Admin UI is heavier than Payload's. Less active TypeScript community.

**Why not WordPress**: PHP stack would require maintaining a separate runtime. Admin UX is dated. Massive plugin ecosystem is also a security liability.

**Why not Keystone**: Smaller ecosystem, less active development. Admin UI less polished.

**Why not Ghost**: Ghost is blog-focused; it doesn't model "events with prize pools and team rosters" naturally. Would require heavy customization.

---

## Decision 2: Frontend Framework

### Options Considered

| Option | Render Strategy | JS Bundle (default) | TS Support | Learning Curve |
|---|---|---|---|---|
| **Astro 5** | Static + Islands | ~0 KB (per page) | ✅ | Low-Medium |
| **Next.js 15** | SSR + RSC | ~85 KB | ✅ | Medium |
| **SvelteKit** | SSR + Hydration | ~20 KB | ✅ | Medium |
| **Nuxt 3** | SSR + Hydration | ~70 KB | ✅ | Medium |
| **Remix** | SSR | ~80 KB | ✅ | Medium |
| **Vite + React (SPA)** | CSR only | ~130 KB | ✅ | Low |
| **Hugo** | Static | 0 KB (Go binary) | ❌ Templates | Medium |
| **Eleventy** | Static | 0 KB | ❌ Templates | Medium |

### Chosen: Astro 5 with React Islands

**Rationale**:
1. **Performance budget (NFR-001..004)** — Astro ships ~0 KB JS by default; only React islands for interactive components (lightbox, form, carousel)
2. **SSG-friendly** — Marketing pages render at build time for max Lighthouse score
3. **React compatibility** — Use React for components that need state (lightbox, form), Astro components for everything else
4. **Content collections API** — Built-in support for content-heavy sites
5. **Active ecosystem** — Multiple CMS integrations (Payload), Tailwind support

**Why not Next.js**: SSR-by-default fights our Lighthouse target. React Server Components add complexity we don't need. Marketing site doesn't benefit from SSR's per-request rendering.

**Why not Hugo/Eleventy**: No TypeScript in templates; harder integration with Payload CMS (which is JSON-based). React component ecosystem harder to use.

**Why not pure Vite + React SPA**: SPA = bad Lighthouse score for marketing site (FCP suffers). No SEO benefit for content-heavy pages.

---

## Decision 3: Database

### Options Considered

| Option | Type | Payload Support | Memory Footprint | Backup |
|---|---|---|---|---|
| **MongoDB 7** | Document | First-class | 512MB cap | mongodump |
| **PostgreSQL 16** | Relational | Newer adapter | 256MB | pg_dump |
| **SQLite** | Embedded | Supported but not prod-ready | Minimal | File copy |
| **MariaDB** | Relational | Third-party adapter | 256MB | mysqldump |

### Chosen: MongoDB 7 (single-node)

**Rationale**:
1. **Payload first-class support** — `@payloadcms/db-mongodb` is the primary adapter
2. **Document model fits CMS** — Events, Team, Services naturally map to documents with embedded fields (location) and arrays (gallery)
3. **Memory cap achievable** — `mongod.conf` with `cacheSizeGB: 0.5` keeps it under 512MB on 2GB VPS
4. **Backup is straightforward** — `mongodump` to compressed archive

**Why not PostgreSQL**: Payload's Postgres adapter is newer and less battle-tested. Would require separate SQL runtime alongside MongoDB for the same benefit. SQL normalization doesn't help for our small dataset (~2000 records).

**Why not SQLite**: Payload officially does not recommend SQLite for production. Concurrent writes unsafe. Would need migration to Postgres later.

---

## Decision 4: Reverse Proxy

### Options Considered

| Option | Auto HTTPS | Config Complexity | Memory | HTTP/3 |
|---|---|---|---|---|
| **Caddy 2** | ✅ Built-in | Low | ~30MB | ✅ |
| **Nginx** | ❌ Manual (certbot) | High | ~10MB | ⚠ Manual |
| **Traefik** | ✅ Built-in | Medium | ~50MB | ✅ |
| **HAProxy** | ❌ Manual | High | ~20MB | ❌ |
| **Apache** | ❌ Manual (certbot) | Very High | ~30MB | ⚠ |

### Chosen: Caddy 2

**Rationale**:
1. **Zero-config HTTPS** — Caddy auto-issues Let's Encrypt certs on first request
2. **Simple config** — Caddyfile is 30 lines vs Nginx's 100+
3. **HTTP/2 + HTTP/3 default** — Better performance for mobile
4. **Lightweight** — 30MB RAM footprint

**Why not Nginx**: Manual certbot renewal is operationally painful. Caddyfile syntax is cleaner.

**Why not Traefik**: Heavier binary; Docker-native labels are overkill for 3 services.

---

## Decision 5: Styling

### Options Considered

| Option | Bundle Size | DX | Mobile-First | Brand Tokens |
|---|---|---|---|---|
| **Tailwind 4** | ~10KB purged | Excellent | ✅ | ✅ @theme |
| **Vanilla CSS** | Depends | Verbose | Manual | CSS vars |
| **CSS Modules** | Depends | Good | Manual | CSS vars |
| **styled-components** | ~50KB runtime | Excellent | Manual | ThemeProvider |
| **Emotion** | ~40KB runtime | Excellent | Manual | ThemeProvider |
| **Panda CSS** | ~15KB | Good | ✅ | ✅ |
| **UnoCSS** | ~5KB | Good | ✅ | ✅ |

### Chosen: Tailwind CSS 4

**Rationale**:
1. **Mobile-first utilities** match Constitution §I
2. **Brand tokens via `@theme`** — define RIKAS colors as CSS variables once
3. **Tree-shaking** — only used classes ship, ~10KB typical output
4. **Team familiarity** — Indonesian React devs know Tailwind
5. **Performance budget** — Tailwind 4's faster builds, smaller output than v3

**Why not vanilla CSS**: Slow iteration; hard to maintain consistency across 50+ components.

**Why not CSS-in-JS**: Runtime overhead violates NFR-004 (JS bundle < 200KB). SSR/SSG hydration cost.

**Why not Panda/UnoCSS**: Less mature ecosystem; team less familiar.

---

## Decision 6: Image Optimization

### Options Considered

| Option | Formats | Server-side | Speed |
|---|---|---|---|
| **Sharp (Node.js)** | JPEG, PNG, WebP, AVIF, GIF | ✅ | Fast |
| **ImageMagick** | 100+ formats | ✅ | Slow |
| **Cloudinary** | JPEG, PNG, WebP, AVIF | ❌ SaaS | Fast |
| **Imgix** | JPEG, PNG, WebP | ❌ SaaS | Fast |
| **next/image** | Via Next.js only | ✅ | Fast |

### Chosen: Sharp (via Payload's media processing)

**Rationale**:
1. **Self-hosted** (Constitution §VI) — eliminates Cloudinary, Imgix
2. **AVIF + WebP support** — modern formats for mobile bandwidth
3. **Fast** — libvips backend, ~5x faster than ImageMagick
4. **Payload integration** — `@payloadcms/upload` supports Sharp via plugins

**Processing pipeline**:
- Upload original (any size up to 10MB)
- Strip EXIF (privacy)
- Generate AVIF at 1920w, 1024w, 640w (~80% size reduction)
- Generate WebP at 1920w, 1024w, 640w (~70% size reduction)
- Serve via `<picture>` with `<source>` for AVIF → WebP → JPEG fallback

---

## Decision 7: Form Validation

### Options Considered

| Option | Bundle Size | TS Support | Schema → TS Type | Custom Messages |
|---|---|---|---|---|
| **Zod 3** | ~15KB | ✅ | ✅ `z.infer` | ✅ Per-locale |
| **Yup** | ~25KB | ✅ | ✅ | ⚠ Limited |
| **Joi** | ❌ Server-only | ✅ | ✅ | ✅ |
| **Valibot** | ~5KB | ✅ | ✅ | ✅ |
| **Vest** | ~10KB | ✅ | ❌ | ✅ |

### Chosen: Zod 3

**Rationale**:
1. **Single schema source** — Define once, use client-side (React) + server-side (Astro API)
2. **Type inference** — `z.infer<typeof schema>` gives TS types for free
3. **Indonesian error messages** — Custom message map per locale
4. **Mature ecosystem** — `@hookform/resolvers/zod` integrates with React Hook Form

**Why not Valibot**: Smaller bundle but newer, less mature. Zod's ecosystem (React Hook Form integration) is more battle-tested.

**Why not Yup**: Larger bundle, less ergonomic TS types.

---

## Decision 8: Email Service

### Options Considered

| Option | Free Tier | Reliability | Setup |
|---|---|---|---|
| **Gmail SMTP** | 500/day | Low (if compromised) | App password |
| **Mailgun** | 100/day (trial), then paid | High | API key |
| **SendGrid** | 100/day (trial), then paid | High | API key |
| **AWS SES** | 62k/month (from EC2) | Very High | IAM |
| **Resend** | 100/day, 3k/month | High | API key |
| **Self-hosted Postfix** | Unlimited | Medium | Full mail server |

### Chosen: Gmail SMTP (start) → Mailgun (if volume grows)

**Rationale**:
1. **Free for MVP** — 500/day = 15k/month, exceeds expected 50 inquiries/month
2. **No setup** — Gmail SMTP works with Nodemailer + app password
3. **Migration path** — When volume grows, switch to Mailgun by changing env vars

**Why not self-hosted Postfix**: Operationally complex; deliverability issues; spam folder risk.

**Why not AWS SES**: Requires AWS account setup; overkill for 50 emails/month.

---

## Decision 9: Analytics

### Options Considered

| Option | Privacy | Self-hosted | Free Tier |
|---|---|---|---|
| **Plausible** (self-hosted) | ✅ No cookies | ✅ | Unlimited (self-hosted) |
| **Umami** (self-hosted) | ✅ No cookies | ✅ | Unlimited (self-hosted) |
| **Google Analytics 4** | ❌ Cookies + IP | ❌ SaaS | Free |
| **Plausible Cloud** | ✅ | ❌ SaaS | $9/month |
| **Server log analysis** | ✅ | ✅ | Free |

### Chosen: Server log analysis (start) → Plausible self-hosted (if traffic warrants)

**Rationale**:
1. **Zero setup** — Nginx/Caddy logs already capture all requests
2. **No third-party tracking** (Constitution §V, NFR-008)
3. **Privacy-respecting** — No cookies, no JS, no PII
4. **Upgrade path** — Add Plausible self-hosted later for richer dashboards

**Why not Google Analytics**: Violates NFR-008 (no third-party tracking). Cookie banner UX harms Indonesian users.

**Why not Plausible Cloud**: SaaS dependency (Constitution §VI).

---

## Decision 10: Deployment Strategy

### Options Considered

| Option | Cost | Control | Maintenance |
|---|---|---|---|
| **Self-hosted VPS (Docker Compose)** | $5-20/month | Full | High |
| **Vercel** | $0-20/month | Limited | Low |
| **Netlify** | $0-19/month | Limited | Low |
| **Railway** | $5+/month | Medium | Low |
| **Render** | $7+/month | Medium | Low |
| **DigitalOcean App Platform** | $5+/month | Medium | Low |

### Chosen: Self-hosted VPS (Docker Compose)

**Rationale**:
1. **Full control** — All data, logs, configs under user's control
2. **Cost** — $5-10/month for 2GB VPS vs $20+/month for managed
3. **Indonesian context** — VPS providers in Singapore/Jakarta offer low latency
4. **Existing setup** — User already runs Telegram bot on VPS; reuse pattern

**Why not Vercel/Netlify**: SaaS dependencies violate Constitution §VI. Also, Payload CMS needs a Node.js runtime + MongoDB — Vercel doesn't host databases.

**Why not Railway/Render**: Similar SaaS concerns; less predictable pricing.

---

## Decision 11: Monorepo Tool

### Options Considered

| Option | Install Speed | Disk Usage | Workspace Support |
|---|---|---|---|
| **pnpm 9** | Fast | Small (hard links) | ✅ Excellent |
| **npm 10** | Slow | Large | ✅ Basic |
| **Yarn 4 (Berry)** | Fast | Small (PnP) | ✅ Good |
| **Turborepo** | N/A (build orchestrator) | N/A | N/A |
| **Nx** | N/A (build orchestrator) | N/A | N/A |

### Chosen: pnpm 9

**Rationale**:
1. **Disk-efficient** — Hard links save disk on small VPS (14GB free)
2. **Workspace protocol** — `workspace:*` for shared packages
3. **Fast installs** — Better than npm for cold installs
4. **Simple** — No PnP complexity like Yarn Berry

**Why not Turborepo/Nx**: Overkill for 2 apps + 1 shared package. Can add later if builds slow down.

---

## Decision 12: Testing Stack

### Options Considered

| Option | Unit | E2E | A11y | Speed |
|---|---|---|---|---|
| **Vitest + Playwright + axe** | ✅ Fast | ✅ Multi-browser | ✅ Built-in | Fast |
| **Jest + Cypress** | ✅ | ⚠ Single browser | ⚠ Plugin | Slow |
| **Jest + Playwright** | ✅ | ✅ | ⚠ Plugin | Mixed |
| **Node test runner + Playwright** | ✅ Native | ✅ | ⚠ Plugin | Fast |

### Chosen: Vitest + Playwright + axe-core

**Rationale**:
1. **Vitest = fast unit tests** — Vite-powered, native ESM
2. **Playwright = comprehensive E2E** — Chromium, Firefox, WebKit + axe-core integration
3. **axe-core = accessibility audits** — Built into Playwright via `@axe-core/playwright`
4. **Single test runner config** — Both use TypeScript and similar patterns

---

## Summary of Stack

| Layer | Choice |
|---|---|
| **Frontend** | Astro 5 + React 19 islands |
| **Styling** | Tailwind CSS 4 |
| **CMS** | Payload CMS 3 |
| **Database** | MongoDB 7 |
| **Reverse Proxy** | Caddy 2 |
| **Containerization** | Docker Compose |
| **Image Processing** | Sharp |
| **Validation** | Zod 3 |
| **Email** | Gmail SMTP → Mailgun |
| **Analytics** | Server logs → Plausible |
| **Monorepo** | pnpm 9 |
| **Unit Testing** | Vitest |
| **E2E Testing** | Playwright + axe-core |
| **Hosting** | Self-hosted VPS |

---

**Next**: See `plan.md` for technical architecture, `tasks.md` for execution breakdown.