# Constitution — RIKAS Indo Technology Event Organizer Website

> Project-wide **non-negotiable principles** for the RIKAS EO website. Adapted from Spec Kit's constitution template. Version-controlled per SemVer.

**Project**: RIKAS Indo Technology Event Organizer Website
**Version**: 1.0.0
**Ratified**: 2026-06-25
**Last Amended**: 2026-06-25

---

## Core Principles

### I. Mobile-First Performance

Every page MUST be designed for mobile devices first, then scaled up to desktop. Performance budget: LCP < 2.5s on 4G, JS bundle < 200KB gzipped per route. Image optimization (AVIF/WebP with JPEG fallback) is mandatory for hero and gallery assets.

**Rationale**: The target audience (Indonesian esports community) primarily accesses content via mobile on variable networks (3G/4G in Central Java). A desktop-first approach ships unused JS and tanks mobile UX.

### II. Content-Authenticity

All event listings, talent profiles, news articles, and partner logos MUST reflect real RIKAS activities — no fabricated events, no stock placeholder content. Draft pages are acceptable; mock data is not. The brand is established (952+ Instagram posts, 7,400+ followers) and authenticity is the value proposition.

**Rationale**: An Event Organizer website that showcases fake events destroys credibility. The site exists to convert existing social followers into engaged community members.

### III. Bilingual-Ready (Indonesian-First, English-Ready)

Primary content language is Indonesian (Bahasa Indonesia) per the brand voice on Instagram. All copy, microcopy, and metadata MUST be authored in Indonesian. English is reserved for technical/SEO fallbacks (e.g., `<html lang>` switch, meta descriptions for international search). Code comments and developer docs stay in English.

**Rationale**: The audience is Central Java (Semarang, Solo, Kendal, Pati) and the entire social brand voice is Indonesian. Forcing English loses authenticity.

### IV. CMS-First, Static-When-Possible

Content MUST be manageable via a CMS by non-technical operators (founder + 1–2 staff). Choose architecture that allows static export for marketing pages (home, about, services) and dynamic rendering for content-heavy lists (events, news). Avoid requiring a developer for routine updates like posting a new event.

**Rationale**: The founder is an event organizer, not a developer. If posting an event requires `git commit` + deploy, content will stagnate within weeks.

### V. No-Account, No-Tracking Privacy Baseline

v1 MUST NOT require user accounts, NOT collect personal data beyond aggregate analytics (page views, no PII), and MUST NOT embed third-party tracking pixels (Meta Pixel, Google Analytics with full features, etc.) by default. Use privacy-respecting analytics (Plausible, Umami self-hosted, or simple server logs).

**Rationale**: Indonesian users are increasingly privacy-aware; the EU-style cookie banner UX feels foreign and harms trust. The site is a marketing surface, not a SaaS.

### VI. Self-Hosted, Vendor-Light Hosting

Hosting MUST be self-hosted (VPS or similar) under the project's own control. No mandatory SaaS dependencies for core functionality (auth, database, CMS storage). Vendor lock-in is acceptable only for non-critical layers (CDN for static assets, email forwarding).

**Rationale**: Indonesian payment friction with international SaaS (Stripe Atlas, Vercel Pro) and the founder's preference for direct control over the site.

### VII. Visual Hierarchy Mirrors TeamLiquid.com

The information architecture and visual treatment MUST take inspiration from TeamLiquid.net (the reference site provided) — a content-dense esports news/portal site with dark theme, prominent featured content, sidebar widgets, and clear event/match framing. Adapt, do not copy.

**Rationale**: User explicitly requested this style. TeamLiquid is battle-tested for esports community sites.

---

## Additional Constraints

### Technology Stack

- **Frontend Framework**: Astro 5.x (static-first, islands architecture for interactivity)
- **Styling**: Tailwind CSS 4.x with custom design tokens for RIKAS brand
- **CMS**: Payload CMS 3.x (self-hosted, Node.js, MongoDB-backed) — fits Principle IV
- **Database**: MongoDB 7.x (self-hosted container)
- **Image Processing**: Astro Image + Sharp (server-side optimization)
- **Containerization**: Docker Compose (app + mongo + reverse proxy)
- **Reverse Proxy**: Caddy 2.x (auto HTTPS via Let's Encrypt)

### Compliance & Security

- All form submissions (contact, partnership inquiry) MUST validate server-side
- HTTPS-only (no HTTP fallback)
- No secrets in repository — `.env` for runtime, `.env.example` checked in
- Admin panel (CMS) MUST be behind authentication and rate-limited

### Performance Standards

- Lighthouse Performance score ≥ 90 on mobile
- First Contentful Paint < 1.5s on 4G
- All routes MUST be statically generated or cached at the edge

### Deployment & Operations

- All deploys via Docker Compose — no manual `npm` deploys
- Database backups daily (cron + mongodump to local volume)
- Healthcheck endpoint `/health` MUST return 200 when app is ready
- Logs MUST be JSON-structured with request correlation IDs

---

## Development Workflow

### Code Review

- All PRs require 1 approval from project owner
- PRs > 400 lines require justification in description
- PR descriptions MUST link to the relevant spec section (`Spec §FR-XXX`)

### Quality Gates

- Linting MUST pass (`eslint` for JS/TS, `prettier` for formatting)
- TypeScript strict mode — no `any` except with explicit justification
- No `TODO` / `FIXME` comments in main branch without linked issue

### Release Process

- Versioned via SemVer in `package.json`
- Changelog maintained per release
- Rollback procedure: redeploy previous Docker image tag

---

## Governance

### Authority

This constitution **supersedes all other practices**. In case of conflict, the constitution wins.

### Amendment Process

1. Propose change via PR to this file
2. Approval from project owner
3. Bump version per SemVer
4. Update dependent artifacts (specs, plans, tasks) to align

### Compliance Review

- Every spec and plan MUST include a **Constitution Check** section
- Any principle violation MUST be justified in writing with simpler alternatives considered

---

**Version History**:

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0.0 | 2026-06-25 | Initial ratification | Hermes Agent |
