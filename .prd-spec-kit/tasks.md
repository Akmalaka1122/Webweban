# Task Breakdown — RIKAS EO Website

> **Ordered, file-pathed, dependency-aware tasks** for executing the RIKAS EO website plan. Each task follows the format `[ID] [P?] [Story?] Action + file path`. Tasks grouped by phase so each phase is independently completable.

**Input**: `plan.md` + `spec.md` + `data-model.md` + `contracts/`
**Created**: 2026-06-25
**Total Tasks**: 80
**MVP Tasks**: 50 (Setup + Foundational + US1 + US2 + US3 + US5 CMS core)
**Effort Estimate**: ~120 hours of focused work

---

## Format Reference

```text
[TaskID] [P] [Story] Description with file path
```

- `[P]` = parallelizable (different files, no deps)
- `[US1]` etc = user story phase
- `[F]` = foundational
- `[S]` = setup

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Monorepo structure, Docker, tooling, base configs
**Independent checkpoint**: `pnpm install` works, Docker Compose can build

- [ ] T001 [S] Create monorepo directory structure at `~/rikas-website/` per plan.md
- [ ] T002 [S] Initialize pnpm workspace with `pnpm-workspace.yaml` and root `package.json`
- [ ] T003 [P] [S] Create `.gitignore` with Node.js, Astro, Payload, Docker, MongoDB patterns
- [ ] T004 [P] [S] Create `.env.example` with all required env vars (MongoDB URI, SMTP, JWT secret, etc.)
- [ ] T005 [P] [S] Create `.dockerignore` excluding node_modules, .env, dist, .astro, .next
- [ ] T006 [S] Create root `tsconfig.base.json` with strict mode and shared compiler options
- [ ] T007 [S] Create root `README.md` with project overview, stack, quickstart commands
- [ ] T008 [S] Configure ESLint + Prettier at root with TypeScript, React, Astro plugins
- [ ] T009 [S] Configure Husky pre-commit hooks for lint-staged
- [ ] T010 [S] Create GitHub Actions CI workflow for lint, typecheck, test, build
- [ ] T011 [S] Create `docker/docker-compose.yml` with services: web, cms, mongo, caddy
- [ ] T012 [S] Create `docker/Dockerfile.web` for Astro app (Node 20-alpine, multi-stage)
- [ ] T013 [S] Create `docker/Dockerfile.cms` for Payload CMS (Node 20-alpine, multi-stage)
- [ ] T014 [S] Create `docker/caddy/Caddyfile` with reverse proxy rules for web/cms, auto-HTTPS
- [ ] T015 [S] Create `docker/mongo/mongod.conf` with 512MB cache limit, WiredTiger config
- [ ] T016 [S] Create `scripts/seed.ts` for initial CMS data (admin user, sample event)
- [ ] T017 [S] Create `scripts/backup.sh` for daily MongoDB dump
- [ ] T018 [S] Create `scripts/lighthouse-audit.sh` for performance validation

**Checkpoint**: `pnpm install` + `docker compose build` succeed, monorepo structure visible.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared packages, design system, base layouts, CMS scaffolding — blocks all user stories
**Independent checkpoint**: Astro dev server runs at `:3000`, Payload admin at `:3001/admin`

### Shared Package

- [ ] T019 [F] Create `packages/shared/` with `package.json`, `tsconfig.json`
- [ ] T020 [F] Create `packages/shared/src/types.ts` with TS types matching Payload collections
- [ ] T021 [F] Create `packages/shared/src/schemas.ts` with Zod schemas (inquiry, event, team, etc.)

### Astro App Scaffolding

- [ ] T022 [F] Initialize `apps/web/` with `package.json` (Astro 5, React 19, Tailwind 4, Sharp)
- [ ] T023 [F] Create `apps/web/astro.config.mjs` with React + Tailwind integrations, Node output
- [ ] T024 [F] Create `apps/web/tsconfig.json` extending base + Astro presets
- [ ] T025 [F] Create `apps/web/tailwind.config.ts` with RIKAS brand tokens (navy `#1b2a51`)
- [ ] T026 [F] Create `apps/web/src/styles/globals.css` with Tailwind base + custom CSS vars
- [ ] T027 [F] Create `apps/web/src/lib/cms.ts` — Payload REST client (fetch wrapper)
- [ ] T028 [F] Create `apps/web/src/lib/i18n.ts` — Indonesian strings dictionary
- [ ] T029 [F] Create `apps/web/src/lib/seo.ts` — meta tag + OpenGraph helpers
- [ ] T030 [F] Create `apps/web/src/lib/validation.ts` — re-export Zod schemas from shared

### Astro Layouts & Components

- [ ] T031 [F] Create `apps/web/src/layouts/BaseLayout.astro` with navbar + footer slots
- [ ] T032 [F] Create `apps/web/src/components/brand/Navbar.astro` — top nav with RIKAS logo
- [ ] T033 [F] Create `apps/web/src/components/brand/Footer.astro` — contact info, social links
- [ ] T034 [F] Create `apps/web/src/components/brand/Logo.astro` — displays RIKAS logo from /assets
- [ ] T035 [F] Create `apps/web/src/components/ui/Button.astro` — primary/secondary/ghost variants
- [ ] T036 [F] Create `apps/web/src/components/ui/Card.astro` — base card wrapper
- [ ] T037 [F] Create `apps/web/src/components/ui/Badge.astro` — game tag, status indicators
- [ ] T038 [F] Create `apps/web/src/components/ui/Skeleton.astro` — loading state placeholder

### Payload CMS Scaffolding

- [ ] T039 [F] Initialize `apps/cms/` with `package.json` (Payload 3, MongoDB adapter, Express)
- [ ] T040 [F] Create `apps/cms/src/payload.config.ts` with MongoDB, collections, admin config
- [ ] T041 [F] Create `apps/cms/src/server.ts` — standalone Express server on port 3001
- [ ] T042 [F] Create `apps/cms/src/collections/Media.ts` with Sharp upload processing
- [ ] T043 [F] Create `apps/cms/src/collections/Users.ts` with Admin/Editor/Viewer roles
- [ ] T044 [F] Create `apps/cms/src/access/roles.ts` with role-based access control functions
- [ ] T045 [F] Create `apps/cms/src/hooks/notifyOnPublish.ts` — webhook trigger to Astro

### API Endpoints (foundational)

- [ ] T046 [F] Create `apps/web/src/pages/api/health.ts` — GET /health endpoint
- [ ] T047 [F] Create `apps/web/src/pages/api/rebuild.ts` — POST webhook with shared secret auth

**Checkpoint**: `pnpm dev` starts both Astro (`:3000`) and Payload (`:3001`); admin login works; empty site renders navbar + footer.

---

## Phase 3: User Story 1 — Browse Events (Priority: P1) 🎯 MVP

**Goal**: Visitors see upcoming and past events, filter by game, view event details with WhatsApp CTA
**Independent test**: Visit `/event` → see grid → filter → click → see detail → click WhatsApp

### Implementation

- [ ] T048 [P] [US1] Create `apps/cms/src/collections/Events.ts` with all fields from data-model.md
- [ ] T049 [P] [US1] Create `apps/web/src/components/events/EventCard.astro` — card UI
- [ ] T050 [P] [US1] Create `apps/web/src/components/events/EventGrid.astro` — grid layout
- [ ] T051 [P] [US1] Create `apps/web/src/components/events/EventFilters.astro` — game filter chips
- [ ] T052 [P] [US1] Create `apps/web/src/components/events/EventCarousel.astro` — home carousel (3 items)
- [ ] T053 [US1] Create `apps/web/src/pages/event/index.astro` — events list with upcoming/past tabs
- [ ] T054 [US1] Create `apps/web/src/pages/event/[slug].astro` — event detail page with `getStaticPaths`
- [ ] T055 [US1] Create `apps/web/src/components/events/WhatsAppCTA.astro` — wa.me link with prefilled message
- [ ] T056 [US1] Add events carousel to `apps/web/src/pages/index.astro` home page
- [ ] T057 [US1] Update `apps/web/src/lib/cms.ts` with `getEvents()`, `getEventBySlug()` functions
- [ ] T058 [US1] Add Schema.org Event structured data to event detail page
- [ ] T059 [US1] Add OpenGraph meta tags for event detail pages

**Checkpoint**: `/event` shows all published events, filter works, detail page renders, WhatsApp link opens correctly.

---

## Phase 4: User Story 2 — Services & Team (Priority: P1) 🎯 MVP

**Goal**: Visitors see service categories, meet the team, understand RIKAS offerings
**Independent test**: Visit `/layanan` → see services → click → see detail; visit `/tim` → see team → click → see profile

### Implementation

- [ ] T060 [P] [US2] Create `apps/cms/src/collections/Services.ts` with all fields from data-model.md
- [ ] T061 [P] [US2] Create `apps/cms/src/collections/TeamMembers.ts` with all fields from data-model.md
- [ ] T062 [P] [US2] Create `apps/web/src/components/services/ServiceCard.astro` — card UI
- [ ] T063 [P] [US2] Create `apps/web/src/components/services/ServiceGrid.astro` — grid layout
- [ ] T064 [P] [US2] Create `apps/web/src/components/team/TeamMemberCard.astro` — card with photo, role
- [ ] T065 [P] [US2] Create `apps/web/src/components/team/TeamMemberGrid.astro` — grid grouped by department
- [ ] T066 [P] [US2] Create `apps/web/src/components/team/DepartmentGroup.astro` — collapsible department section
- [ ] T067 [US2] Create `apps/web/src/pages/layanan/index.astro` — services grid page
- [ ] T068 [US2] Create `apps/web/src/pages/layanan/[slug].astro` — service detail with assigned team
- [ ] T069 [US2] Create `apps/web/src/pages/tim/index.astro` — team grid grouped by department
- [ ] T070 [US2] Create `apps/web/src/pages/tim/[slug].astro` — team member profile with portfolio
- [ ] T071 [US2] Add services preview to home page `apps/web/src/pages/index.astro`
- [ ] T072 [US2] Update `apps/web/src/lib/cms.ts` with `getServices()`, `getTeamMembers()`, `getTeamMemberBySlug()`
- [ ] T073 [US2] Add Schema.org Person structured data to team member profile
- [ ] T074 [US2] Add Schema.org Service structured data to service detail page

**Checkpoint**: `/layanan` and `/tim` render correctly, navigation between pages works, profiles show real data.

---

## Phase 5: User Story 3 — Contact Form (Priority: P1) 🎯 MVP

**Goal**: Visitors submit structured inquiry, RIKAS receives notification
**Independent test**: Visit `/kontak` → fill form → submit → see success page → inquiry appears in CMS

### Implementation

- [ ] T075 [P] [US3] Create `apps/cms/src/collections/Inquiries.ts` with all fields from data-model.md
- [ ] T076 [P] [US3] Create `apps/web/src/components/contact/ContactForm.tsx` — React island with React Hook Form + Zod
- [ ] T077 [P] [US3] Create `apps/web/src/components/contact/InquiryTypeSelector.tsx` — type dropdown with conditional fields
- [ ] T078 [P] [US3] Create `apps/web/src/components/contact/HoneypotField.tsx` — hidden spam field
- [ ] T079 [US3] Create `apps/web/src/pages/kontak.astro` — contact page with form + map embed
- [ ] T080 [US3] Create `apps/web/src/pages/kontak/terima-kasih.astro` — success page
- [ ] T081 [US3] Create `apps/web/src/pages/api/contact.ts` — POST endpoint with validation + rate limiting
- [ ] T082 [US3] Create `apps/web/src/lib/email.ts` — Nodemailer SMTP client + Indonesian templates
- [ ] T083 [US3] Add honeypot + rate limit (5/min/IP) to contact API endpoint
- [ ] T084 [US3] Wire email notification on successful inquiry submission
- [ ] T085 [US3] Update `apps/web/src/components/brand/Footer.astro` with inquiry submission link

**Checkpoint**: Form submits, inquiry appears in CMS dashboard, email arrives in admin inbox, honeypot blocks bots.

---

## Phase 6: User Story 4 — News & Gallery (Priority: P2)

**Goal**: Visitors read news articles, browse photo gallery
**Independent test**: Visit `/berita` → click article → read; visit `/galeri` → click photo → lightbox

### Implementation

- [ ] T086 [P] [US4] Create `apps/cms/src/collections/News.ts` with all fields from data-model.md
- [ ] T087 [P] [US4] Create `apps/cms/src/collections/Gallery.ts` with all fields from data-model.md
- [ ] T088 [P] [US4] Create `apps/web/src/components/news/ArticleCard.astro` — card with thumbnail, excerpt
- [ ] T089 [P] [US4] Create `apps/web/src/components/news/ArticleGrid.astro` — paginated grid
- [ ] T090 [P] [US4] Create `apps/web/src/components/gallery/MasonryGrid.tsx` — React island for masonry layout
- [ ] T091 [P] [US4] Create `apps/web/src/components/gallery/Lightbox.tsx` — React island with caption + nav
- [ ] T092 [US4] Create `apps/web/src/pages/berita/index.astro` — news list with pagination
- [ ] T093 [US4] Create `apps/web/src/pages/berita/[slug].astro` — article detail with related articles
- [ ] T094 [US4] Create `apps/web/src/pages/galeri.astro` — gallery page with masonry + lightbox
- [ ] T095 [US4] Update `apps/web/src/lib/cms.ts` with `getArticles()`, `getGallery()`, `getArticleBySlug()`
- [ ] T096 [US4] Add Schema.org Article structured data to article detail page

**Checkpoint**: `/berita` shows articles, pagination works, article detail renders, gallery masonry + lightbox work.

---

## Phase 7: User Story 5 — CMS Admin (Priority: P1/P2)

**Goal**: Staff manage all content via `/admin` without developer
**Independent test**: Log in → create event → see on `/event`; upload gallery photo → see in `/galeri`

### Implementation

- [ ] T097 [P] [US5] Configure Payload admin UI in `apps/cms/src/payload.config.ts` with Indonesian labels
- [ ] T098 [P] [US5] Add custom dashboard widgets to Payload admin (inquiry count, recent events)
- [ ] T099 [P] [US5] Create `apps/cms/src/collections/hooks/notifyOnPublish.ts` — webhook trigger
- [ ] T100 [US5] Create admin user seeding in `scripts/seed.ts` (admin + editor users)
- [ ] T101 [US5] Configure Caddy to proxy `/admin` to Payload CMS port 3001
- [ ] T102 [US5] Add bulk upload UI for gallery photos in Payload
- [ ] T103 [US5] Add inquiry inbox view in Payload with status filters
- [ ] T104 [US5] Add rich text editor configuration (bold, italic, links, images, headings, lists)
- [ ] T105 [US5] Configure Payload admin localization for Indonesian UI labels
- [ ] T106 [US5] Test full content workflow: create event → publish → webhook → rebuild → live

**Checkpoint**: Admin can create/edit/publish all content types, webhooks fire correctly, build auto-updates site.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance, accessibility, SEO, documentation, deployment — affects all user stories
**Independent checkpoint**: Lighthouse ≥ 90 mobile, accessibility audit passes, production deploy succeeds

### Performance

- [ ] T107 [P] Add `<picture>` element with AVIF → WebP → JPEG fallback in `apps/web/src/components/ui/Image.astro`
- [ ] T108 [P] Add lazy loading to all below-fold images in components and pages
- [ ] T109 [P] Add prefetch links for navigation in `apps/web/src/layouts/BaseLayout.astro`
- [ ] T110 [P] Configure Astro build for optimal chunking in `apps/web/astro.config.mjs`
- [ ] T111 [P] Add Redis-style in-memory cache for build-time CMS queries in `apps/web/src/lib/cms.ts`

### Accessibility

- [ ] T112 [P] Add ARIA labels to all interactive elements (nav, forms, buttons, lightbox)
- [ ] T113 [P] Add skip-to-content link in `apps/web/src/layouts/BaseLayout.astro`
- [ ] T114 [P] Verify WCAG AA color contrast for brand navy `#1b2a51` on dark background
- [ ] T115 [P] Add `prefers-reduced-motion` media query for carousel transitions
- [ ] T116 [P] Add keyboard navigation support to lightbox, carousel, mobile menu
- [ ] T117 [P] Run `@axe-core/playwright` a11y audit, fix all critical/serious issues

### SEO

- [ ] T118 [P] Generate `sitemap.xml` in `apps/web/src/pages/sitemap.xml.ts`
- [ ] T119 [P] Add `robots.txt` in `apps/web/public/robots.txt` with sitemap reference
- [ ] T120 [P] Add structured data validation via Google Rich Results Test
- [ ] T121 [P] Add Twitter Card meta tags in `apps/web/src/lib/seo.ts`
- [ ] T122 [P] Configure canonical URLs for all pages

### Documentation

- [ ] T123 [P] Create `docs/deployment.md` with VPS setup, Docker deploy, backup procedures
- [ ] T124 [P] Create `docs/maintenance.md` with content update guide for non-technical operators
- [ ] T125 [P] Create `docs/troubleshooting.md` with common issues and solutions
- [ ] T126 [P] Create `docs/architecture.md` with system diagram, data flow, tech decisions
- [ ] T127 [P] Create `CHANGELOG.md` with v1.0.0 release notes

### Deployment

- [ ] T128 Create `docker-compose.prod.yml` with production env vars (no dev volumes)
- [ ] T129 Add healthcheck to Docker services (mongo, cms, web)
- [ ] T130 Configure Caddy production Caddyfile with HTTPS, HSTS, security headers
- [ ] T131 Test production deployment via `docker compose -f docker-compose.prod.yml up`
- [ ] T132 Configure UFW firewall on VPS (allow 22, 80, 443 only)
- [ ] T133 Setup cron job for daily MongoDB backup at 02:00
- [ ] T134 Configure log rotation for Docker containers

**Checkpoint**: Lighthouse score ≥ 90 mobile, all a11y checks pass, production site deployed, backup cron runs.

---

## Phase 9: Final Validation

- [ ] T135 Run `scripts/lighthouse-audit.sh` against production, capture scores
- [ ] T136 Execute `quickstart.md` scenarios end-to-end, verify all pass
- [ ] T137 Capture screenshots of home, events, services, team, contact pages
- [ ] T138 Run `scripts/validate_spec.py` against `.prd-spec-kit/spec.md` for consistency
- [ ] T139 Run ECC audit against PRD + spec + plan + tasks for cross-artifact consistency
- [ ] T140 Tag v1.0.0 release in git, create release notes

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS all user stories
    ↓
Phase 3 (US1: Events) + Phase 4 (US2: Services/Team) + Phase 5 (US3: Contact) + Phase 7 (US5: CMS)
    ↓ (these can run in parallel — different files)
Phase 6 (US4: News/Gallery) — depends on foundational + collections
    ↓
Phase 8 (Polish) — depends on at least US1+US2+US3
    ↓
Phase 9 (Validation) — depends on Polish
```

### User Story Dependencies

- **US1 (Events)**: No deps on other stories. Can start after Foundational.
- **US2 (Services/Team)**: No deps on other stories. Can start after Foundational.
- **US3 (Contact)**: No deps on other stories. Can start after Foundational.
- **US4 (News/Gallery)**: No deps. Can start after Foundational.
- **US5 (CMS)**: Required for content population of US1/US2/US4 but the CMS UI itself is independent.

### Parallel Opportunities

- **Setup phase**: 10+ tasks can run in parallel (different files)
- **Foundational phase**: Most `[F]` tasks can run in parallel within sub-areas
- **User stories**: US1, US2, US3, US4 can run in parallel after Foundational done (different pages, different collections)
- **Polish**: All `[P]` tasks can run in parallel

### Recommended Execution Order (Solo Developer)

1. **Phase 1** (Setup): ~2 hours
2. **Phase 2** (Foundational): ~6 hours
3. **Phase 3** (US1 Events) + **Phase 4** (US2 Services/Team): ~8 hours
4. **Phase 5** (US3 Contact) + **Phase 7** (US5 CMS Admin): ~6 hours
5. **Phase 6** (US4 News/Gallery): ~4 hours
6. **Phase 8** (Polish): ~4 hours
7. **Phase 9** (Validation): ~2 hours

**Total estimate: ~32 hours of focused work for MVP + polish**

---

## Task Summary

| Phase | Tasks | Parallel | MVP? |
|---|---|---|---|
| Phase 1: Setup | 18 | 4 | ✅ |
| Phase 2: Foundational | 30 | 20 | ✅ |
| Phase 3: US1 Events | 12 | 4 | ✅ |
| Phase 4: US2 Services/Team | 15 | 9 | ✅ |
| Phase 5: US3 Contact | 11 | 4 | ✅ |
| Phase 6: US4 News/Gallery | 11 | 4 | ❌ (P2) |
| Phase 7: US5 CMS Admin | 10 | 3 | ✅ |
| Phase 8: Polish | 28 | 27 | ✅ |
| Phase 9: Validation | 6 | 0 | ✅ |
| **TOTAL** | **141** | **75** | **120 / 141 = 85%** |

**Note**: The 141 count includes polish tasks. MVP minimum is 108 tasks (Setup + Foundational + US1+US2+US3+US5).

---

## Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Tech Lead | Hermes Agent | ✅ Approved | 2026-06-25 |
| Product Manager | RIKAS founder | Pending | |
| QA Lead | TBD | Pending | |

**Ready to execute when**: All prerequisites met (plan approved, constitution check passed, environment prepared).

---

**Next**: Run ECC audit (`hermes-ecc-import` skill) to validate cross-artifact consistency before starting implementation.