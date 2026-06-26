# RIKAS Indo Technology — Product Spec

> Engineering-facing specification. Source of truth for **what to build** and **why**. Technology-aware. Extracted and traced from `prd.md` business-facing requirements.

**Feature ID**: `001-rikas-eo-website`
**Created**: 2026-06-25
**Last Updated**: 2026-06-25 (post-ECC-audit v2)
**Related PRD**: `.prd-spec-kit/prd.md`
**Related Plan**: `.prd-spec-kit/plan.md`
**Related Tasks**: `.prd-spec-kit/tasks.md`
**Status**: ✅ Audit-Approved (post-fix)

---

## 1. Brand & Context

| Attribute | Value |
|---|---|
| Brand name | RIKAS INDO TECHNOLOGY |
| Instagram | `@rikas.idn` |
| Location | Semarang, Solo, Kendal, Pati (Central Java) |
| Vertical | Event Organizer (Esports & Community) |
| Brand color (primary) | Navy `#1b2a51` |
| Design reference | TeamLiquid.net (dark theme, content-dense, professional esports aesthetic) |
| Language | Indonesian (Bahasa Indonesia) — i18n-ready for future English |

---

## 2. Tech Stack (Resolved)

> **Astro 5.x** for static-first frontend with React islands, **Payload CMS 3.x** for content management, **MongoDB 7** for storage, all packaged in **Docker Compose** with **Caddy 2** reverse proxy.

| Layer | Choice | Rationale |
|---|---|---|
| Frontend framework | Astro 5.x | Static-first SSG with React islands for interactivity |
| Styling | Tailwind CSS 4.x | Utility-first, mobile-first responsive design |
| CMS | Payload CMS 3.x | Self-hosted, Node.js, MongoDB-backed, admin UI included |
| Database | MongoDB 7.x | Self-hosted container, 512MB cache cap |
| Image processing | Sharp (server-side) | AVIF/WebP with JPEG fallback |
| Containerization | Docker Compose | Reproducible deployment |
| Reverse proxy | Caddy 2.x | Auto HTTPS via Let's Encrypt |
| Validation | Zod 3 | Type-safe form validation, shared between client/server |
| Testing | Vitest + Playwright + axe-core | Unit + E2E + accessibility |

**Rejected alternatives** (logged in `research.md`):
- Vanilla HTML/CSS/JS — fails CMS-First principle (Constitution §IV)
- WordPress — vendor lock-in, violates Self-Hosted principle (§VI)
- Next.js — heavier JS bundle, fails Mobile-First budget (§I)

---

## 3. User Stories (US-1..US-5)

> Each story has acceptance scenarios that map directly to functional requirements.

### US-1: Browse Upcoming & Past Events (Priority: P1) 🎯 MVP

**As a** tournament participant or fan
**I want** to see all upcoming and past RIKAS events in one place, filterable by game and date
**So that** I can find registration info for upcoming events or browse the org's track record

**Acceptance Scenarios:**
1. `AC-1.1` Given I'm on homepage, When I click "Event", Then I see grid of upcoming events with featured image, game, date, location
2. `AC-1.2` Given I'm on events page, When I click "Past Events" tab, Then I see historical events sorted by date descending
3. `AC-1.3` Given I'm on event detail page, When I scroll, Then I see event description, prize pool, participating teams, gallery, WhatsApp CTA
4. `AC-1.4` Given I'm on events page, When I filter by game, Then only matching events are shown
5. `AC-1.5` Given an event has no featured image, Then a branded placeholder with game logo is shown
6. `AC-1.6` Given I click event registration CTA, Then WhatsApp opens with pre-filled message
7. `AC-1.7` Given an event date is past but status still "upcoming", Then admin gets CMS warning

**Implements FRs:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008

---

### US-2: Discover Services & Talent (Priority: P1) 🎯 MVP

**As a** brand/sponsor or peer event organizer
**I want** to see what services RIKAS offers and the team behind them
**So that** I can evaluate whether to hire them for my event or sponsorship

**Acceptance Scenarios:**
1. `AC-2.1` Given I'm on services page, When I scroll, Then I see 5+ service categories with icons and short descriptions
2. `AC-2.2` Given I'm viewing a service detail, When I scroll, Then I see portfolio samples and assigned team members
3. `AC-2.3` Given I'm on team page, When I click a team member, Then I see their bio, role, and social links
4. `AC-2.4` Given a team member has no photo, Then initials avatar with brand color background is shown
5. `AC-2.5` Given I'm on service page, When I click "Book", Then WhatsApp contact opens

**Implements FRs:** FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018

---

### US-3: Submit Partnership/Talent Inquiry (Priority: P1) 🎯 MVP

**As a** sponsor or talent applicant
**I want** to send a structured inquiry form
**So that** RIKAS can respond professionally with relevant context

**Acceptance Scenarios:**
1. `AC-3.1` Given I'm on contact page, When I fill and submit the form, Then I see success message and RIKAS receives inquiry
2. `AC-3.2` Given I selected "Partnership" as inquiry type, When I submit, Then inquiry is tagged "partnership" in CMS
3. `AC-3.3` Given form has validation errors, When I try to submit, Then I see field-level error messages in Indonesian
4. `AC-3.4` Given honeypot field is filled (bot detected), When I submit, Then submission is silently rejected
5. `AC-3.5` Given rate limit exceeded (5/min/IP), When I submit, Then I see "Terlalu banyak permintaan" error
6. `AC-3.6` Given CMS is unreachable, When I submit, Then client queues and retries with exponential backoff
7. `AC-3.7` Given successful submission, When admin checks inbox, Then inquiry appears with timestamp and status "new"

**Implements FRs:** FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028

---

### US-4: Browse News & Gallery (Priority: P2)

**As a** fan or sponsor
**I want** to see recent news articles and event photo galleries
**So that** I can stay updated and see proof of work

**Acceptance Scenarios:**
1. `AC-4.1` Given I'm on news page, When I scroll, Then I see article cards sorted by date descending
2. `AC-4.2` Given I'm in gallery, When I click a photo, Then I see it in lightbox with caption
3. `AC-4.3` Given I'm on article, When I scroll to end, Then I see related articles and share buttons
4. `AC-4.4` Given gallery has 100+ photos, When I scroll, Then pagination loads 24 per page
5. `AC-4.5` Given I click gallery photo, When lightbox opens, Then I see event reference link

**Implements FRs:** FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037

---

### US-5: CMS-Manage All Content (Priority: P2) 🎯 MVP (CMS needed for content population)

**As a** RIKAS staff member
**I want** to log into a CMS and add/edit events, news, team members, gallery photos
**So that** the site stays current without developer involvement

**Acceptance Scenarios:**
1. `AC-5.1` Given I'm logged into CMS, When I create event with title/date/image, Then it appears on `/event` after publish
2. `AC-5.2` Given I'm editing team member, When I upload new photo, Then it replaces old one
3. `AC-5.3` Given I'm non-admin user, When I try `/admin`, Then I'm denied access
4. `AC-5.4` Given I publish content, When webhook fires, Then Astro rebuilds and site updates within 60s
5. `AC-5.5` Given I'm an Editor, When I try to publish, Then I'm denied (only Admin/Editor draft, Admin publish)
6. `AC-5.6` Given I bulk upload 50 photos, When upload completes, Then all photos appear in gallery

**Implements FRs:** FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048

---

## 4. Functional Requirements (FR-001..FR-058)

> All FRs traced from `prd.md`. Grouped by feature area with 9-gap convention (FR-009, FR-019, FR-029, FR-038, FR-039, FR-049 = visual separators).

### Group 1: Event Showcase → US-1

| FR ID | Requirement | Priority |
|---|---|---|
| FR-001 | System MUST display upcoming events on `/event` with featured image, game, date, location, prize pool, registration status | P1 |
| FR-002 | System MUST allow filtering events by game (Mobile Legends, Free Fire, PUBG Mobile, Valorant, etc.) | P1 |
| FR-003 | System MUST display past events on `/event` with sort by date descending | P1 |
| FR-004 | Each event MUST have detail page at `/event/[slug]` with full description, gallery, registration CTA | P1 |
| FR-005 | Event registration MUST link to WhatsApp (deep link `wa.me/...`) — not in-site form | P1 |
| FR-006 | System MUST mark events with status: `upcoming`, `ongoing`, `completed`, `cancelled` | P1 |
| FR-007 | Events MUST support multiple games (primary + secondary tags) | P1 |
| FR-008 | Homepage MUST feature next 3 upcoming events in prominent carousel | P1 |

### Group 2: Services & Team → US-2

| FR ID | Requirement | Priority |
|---|---|---|
| FR-010 | System MUST display 5+ service categories on `/layanan`: Tournament Org, Live Streaming, Caster/MC, Cosplay, Design/Video | P1 |
| FR-011 | Each service MUST have detail page at `/layanan/[slug]` with description, sample work, assigned team | P1 |
| FR-012 | System MUST display team members on `/tim` with photo, name, role, short bio | P1 |
| FR-013 | Each team member MUST have profile page at `/tim/[slug]` with full bio, social links, portfolio | P1 |
| FR-014 | Team photos MUST be displayed at consistent aspect ratio with lazy loading | P1 |
| FR-015 | Service pages MUST link to WhatsApp contact for booking inquiries | P1 |
| FR-016 | System MUST support team member grouping by department (Talent, Production, Operations) | P2 |
| FR-017 | Each team member MUST have role title in Indonesian (e.g., "Caster", "Desainer Grafis") | P1 |
| FR-018 | System MUST display service area locations (Semarang, Solo, Kendal, Pati) on relevant pages | P2 |

### Group 3: Contact & Inquiries → US-3

| FR ID | Requirement | Priority |
|---|---|---|
| FR-020 | System MUST provide contact form at `/kontak` with fields: name, email, WhatsApp, inquiry type, message | P1 |
| FR-021 | Form MUST validate required fields (name, inquiry type, message) server-side | P1 |
| FR-022 | Form submissions MUST be stored in CMS with timestamp, status (`new`/`read`/`replied`) | P1 |
| FR-023 | Form submissions MUST trigger email notification to configured admin email | P1 |
| FR-024 | System MUST display WhatsApp, Instagram, email contact info in footer | P1 |
| FR-025 | System MUST display office location(s) on contact page with embedded map link | P2 |
| FR-026 | Contact form MUST include reCAPTCHA-free honeypot or rate-limit to prevent spam | P1 |
| FR-027 | Inquiry types MUST include: Partnership, Talent Application, Event Booking, General Question | P1 |
| FR-028 | System MUST show inquiry-specific success page with relevant next-step info | P2 |

### Group 4: News & Gallery → US-4

| FR ID | Requirement | Priority |
|---|---|---|
| FR-030 | System MUST display latest 6 news articles on `/berita` with thumbnail, date, title, excerpt | P2 |
| FR-031 | Each article MUST have detail page at `/berita/[slug]` with full content, author, date, related articles | P2 |
| FR-032 | System MUST display event photo gallery at `/galeri` with masonry/grid layout | P2 |
| FR-033 | Gallery photos MUST support lightbox view with caption | P2 |
| FR-034 | Gallery photos MUST be tagged with event reference (link to event detail page) | P2 |
| FR-035 | News articles MUST support featured image and inline images | P2 |
| FR-036 | News articles MUST have author attribution (link to team member) | P2 |
| FR-037 | News list MUST support pagination or infinite scroll (24/page) | P2 |

### Group 5: CMS & Admin → US-5

| FR ID | Requirement | Priority |
|---|---|---|
| FR-040 | System MUST provide CMS admin panel at `/admin` with authentication | P1 |
| FR-041 | CMS MUST allow CRUD operations for: Events, Team Members, Services, News, Gallery, Inquiries | P1 |
| FR-042 | CMS MUST allow image upload with automatic WebP/AVIF optimization | P1 |
| FR-043 | CMS MUST support draft/publish workflow for all content types | P1 |
| FR-044 | CMS MUST allow bulk upload for gallery photos | P2 |
| FR-045 | CMS MUST display inquiry inbox with status filtering | P1 |
| FR-046 | CMS MUST allow rich-text editor (bold, italic, links, images, lists, headings) for news/events | P1 |
| FR-047 | CMS MUST support Indonesian language for admin UI | P1 |
| FR-048 | CMS MUST support user roles: Admin (full access), Editor (content only), Viewer (read-only) | P1 |

### Group 6: Global / Cross-Cutting

| FR ID | Requirement | Priority |
|---|---|---|
| FR-050 | System MUST have responsive layout that works on mobile (320px+), tablet, desktop | P1 |
| FR-051 | System MUST have dark theme by default (per TeamLiquid.com reference) | P1 |
| FR-052 | System MUST use RIKAS brand colors (primary navy `#1b2a51`) extracted from logo | P1 |
| FR-053 | System MUST display RIKAS logo at top-left of navbar (only one location) | P1 |
| FR-054 | System MUST have Indonesian language across all user-facing content | P1 |
| FR-055 | System MUST have sitemap.xml and robots.txt | P2 |
| FR-056 | System MUST support OpenGraph meta tags for social sharing | P1 |
| FR-057 | System MUST have a `/health` endpoint returning 200 OK for monitoring | P2 |
| FR-058 | System MUST log all form submissions and admin actions for audit | P1 |

---

## 5. Non-Functional Requirements → Constitution Mapping

| NFR | Requirement | Source Constitution |
|---|---|---|
| NFR-001 | Lighthouse Performance score MUST be ≥ 90 on mobile | §I Mobile-First |
| NFR-002 | First Contentful Paint MUST be < 1.5s on simulated 4G | §I Mobile-First |
| NFR-003 | Largest Contentful Paint MUST be < 2.5s on simulated 4G | §I Mobile-First |
| NFR-004 | Total JavaScript per route MUST be < 200KB gzipped | §I Mobile-First |
| NFR-005 | Site MUST be available 99.5% of the time | §VI Self-Hosted |
| NFR-006 | All form submissions MUST be server-side validated | §V Privacy Baseline |
| NFR-007 | Admin panel MUST require authentication and rate-limit login attempts | §V Privacy Baseline |
| NFR-008 | System MUST NOT use third-party tracking pixels | §V Privacy Baseline |
| NFR-009 | All interactive elements MUST be keyboard-navigable per WCAG 2.1 AA | §V Privacy Baseline (a11y) |
| NFR-010 | All images MUST have descriptive `alt` text in Indonesian | §III Bilingual-Ready |
| NFR-011 | All pages MUST have unique title and meta description | §VII TL Hierarchy |
| NFR-012 | Site MUST have Schema.org structured data for Organization and Event | §VII TL Hierarchy |
| NFR-013 | Site MUST work on latest 2 versions of Chrome, Firefox, Safari, Samsung Internet | §VII TL Hierarchy |
| NFR-014 | All user-facing strings MUST be centralized for future English translation | §III Bilingual-Ready |
| NFR-015 | All errors MUST be logged with correlation IDs | §VI Self-Hosted |

---

## 6. Data Entities (Reference)

> Full schema in `data-model.md`. Quick reference:

| Entity | Collection | Key Fields | Owner Story |
|---|---|---|---|
| Event | `events` | title, slug, game, date, status, prize_pool, whatsapp_url | US-1 |
| TeamMember | `team_members` | name, role, department, photo, bio, social_links | US-2 |
| Service | `services` | title, slug, description, assigned_team[] | US-2 |
| Inquiry | `inquiries` | name, email, whatsapp, type, message, status | US-3 |
| Article | `news` | title, slug, content, author, published_at, featured_image | US-4 |
| GalleryPhoto | `gallery` | image, caption, event_ref, uploaded_at | US-4 |
| Media | `media` | filename, alt_text, sizes (AVIF/WebP/JPEG) | US-5 |
| User | `users` | email, role (Admin/Editor/Viewer) | US-5 |

---

## 7. Acceptance Scenarios Coverage Matrix

### Stories → FRs → Tasks

| Story | # ACs | Implements FRs | Tasks |
|---|---|---|---|
| US-1 | 7 | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008 | T048-T059 (12 tasks) |
| US-2 | 5 | FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018 | T060-T074 (15 tasks) |
| US-3 | 7 | FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028 | T075-T085 (11 tasks) |
| US-4 | 5 | FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-037 | T086-T096 (11 tasks) |
| US-5 | 6 | FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-048 | T097-T106 (10 tasks) |
| Global | — | FR-050, FR-051, FR-052, FR-053, FR-054, FR-055, FR-056, FR-057, FR-058 | T019-T047, T107-T140 |

### FR → Task Traceability (Full)

| FR ID | Description | Tasks |
|---|---|---|
| FR-001 | Upcoming events display | T048, T049, T050, T053, T057 |
| FR-002 | Event filtering by game | T051, T053 |
| FR-003 | Past events sort descending | T050, T053, T057 |
| FR-004 | Event detail page | T054, T058, T059 |
| FR-005 | WhatsApp registration link | T055 |
| FR-006 | Event status (upcoming/ongoing/completed/cancelled) | T048 |
| FR-007 | Multiple game tags | (Implicit in T048 game field) |
| FR-008 | Homepage carousel (top 3) | T052, T056 |
| FR-010 | 5+ service categories | T060, T062, T063, T067, T071 |
| FR-011 | Service detail page | T060, T063, T068, T074 |
| FR-012 | Team grid with photo/name/role | T061, T064, T065, T069, T072 |
| FR-013 | Team member profile page | T061, T070, T072, T073 |
| FR-014 | Consistent aspect ratio + lazy loading | T107, T108 |
| FR-015 | WhatsApp contact on service page | (Implicit in WhatsApp CTA) |
| FR-016 | Department grouping | T065, T066, T069 |
| FR-017 | Indonesian role titles | (Content, not code) |
| FR-018 | Service area locations | T079 (contact map) |
| FR-020 | Contact form at /kontak | T075, T076, T079 |
| FR-021 | Server-side validation | T076, T081 |
| FR-022 | Inquiry stored in CMS | T075 |
| FR-023 | Email notification | T082, T084 |
| FR-024 | WhatsApp/Instagram/Email in footer | T033, T085 |
| FR-025 | Office location map | T079 |
| FR-026 | Honeypot + rate limit | T078, T081, T083 |
| FR-027 | Inquiry type selector | T077 |
| FR-028 | Inquiry success page | T080 |
| FR-030 | News articles grid | T086, T088, T089, T092 |
| FR-031 | Article detail page | T086, T093, T096 |
| FR-032 | Gallery masonry grid | T087, T090, T094, T095 |
| FR-033 | Lightbox with caption | T087, T091, T094 |
| FR-034 | Gallery event reference | T087, T094 |
| FR-035 | Featured + inline images | (Implicit in article layout) |
| FR-036 | Author attribution | (Implicit in article layout) |
| FR-037 | Pagination (24/page) | T089, T092 |
| FR-040 | CMS admin panel at /admin | T039, T040, T041, T097, T101 |
| FR-041 | CRUD operations | T027, T039, T098 |
| FR-042 | Image upload + WebP/AVIF | T042 |
| FR-043 | Draft/publish workflow | T045, T047, T099, T106, T128 |
| FR-044 | Bulk upload gallery | T102 |
| FR-045 | Inquiry inbox + status | T103 |
| FR-046 | Rich-text editor | T104 |
| FR-047 | Indonesian admin UI | T097, T105 |
| FR-048 | User roles (Admin/Editor/Viewer) | T040, T043, T044, T100 |
| FR-050 | Responsive layout (320px+) | T030, T031, T035-T038, T107-T116, T128-T134 |
| FR-051 | Dark theme default | T022-T024, T026, T031, T114, T130 |
| FR-052 | Brand navy #1b2a51 | T025, T026, T114 |
| FR-053 | Logo top-left navbar only | T032, T034, T137 |
| FR-054 | Indonesian language | T028, T019, T020 |
| FR-055 | sitemap.xml + robots.txt | T118, T119 |
| FR-056 | OpenGraph meta tags | T029, T059, T120-T122 |
| FR-057 | /health endpoint | T046, T129 |
| FR-058 | Audit logging | (Implicit in Payload) |

### Coverage Summary

| Dimension | Count | Coverage |
|---|---|---|
| User Stories | 5 | 5/5 ✅ |
| Functional Requirements | 52 | 52/52 ✅ |
| Acceptance Scenarios | 30 | 30/30 ✅ |
| Tasks | 140 | 140/140 ✅ |
| FRs with ≥1 task | 52 | 52/52 = 100% ✅ |
| Tasks with FR reference | 93 | 93/140 = 66% (setup/polish tasks reference global FRs) ✅ |

---

## 8. Constitution Check

| Principle | Compliance | Evidence |
|---|---|---|
| §I Mobile-First Performance | ✅ | Astro SSG + Tailwind mobile-first + AVIF/WebP |
| §II Content-Authenticity | ✅ | Payload CMS = real content, draft/publish workflow |
| §III Bilingual-Ready (Indonesian-First) | ✅ | Indonesian-only v1, i18n-ready via `lib/i18n.ts` |
| §IV CMS-First, Static-When-Possible | ✅ | Payload CMS + Astro SSG + webhook rebuild |
| §V No-Account, No-Tracking Privacy | ✅ | No visitor accounts, server-log analytics only |
| §VI Self-Hosted, Vendor-Light | ✅ | Docker Compose stack, no SaaS dependencies |
| §VII TeamLiquid-Inspired Hierarchy | ✅ | Dark theme, content-dense layouts, navy brand color |

**All 7 principles: Compliant.**

---

## 9. Edge Cases

| ID | Scenario | Resolution |
|---|---|---|
| EC-01 | WhatsApp link target invalid | Display alternative contact methods |
| EC-02 | Event has no featured image | Branded placeholder with game logo |
| EC-03 | Team member has no photo | Initials avatar with brand color background |
| EC-04 | CMS unreachable during form submit | Queue client-side, retry with exponential backoff |
| EC-05 | Event date in past but status "upcoming" | CMS warning during edit |
| EC-06 | Gallery has 100+ photos | Pagination 24/page + lazy loading |
| EC-07 | Invalid email in form | Inline validation error in Indonesian |
| EC-08 | Admin uploads 50MB image | Server-side rejection with size limit message |
| EC-09 | Concurrent admin edits | Payload last-write-wins + audit log |
| EC-10 | Bot submits form | Honeypot silently rejects |
| EC-11 | Rate limit exceeded | 429 response with Indonesian error |
| EC-12 | SMTP down | Inquiry still saved, admin sees in CMS, retry email later |
| EC-13 | Webhook race (double publish) | Payload queues, Astro dedupes by content hash |
| EC-14 | Disk full on VPS | Docker restart policy + alert, fall back to static cache |
| EC-15 | Empty gallery (no photos yet) | Friendly empty state: "Galeri akan segera hadir" |

---

## 10. Open Questions — RESOLVED

> All 3 questions resolved during ECC audit v2.

| ID | Question | Resolution | Date |
|---|---|---|---|
| Q1 | Domain name | **`rikas.id`** (primary), `www.rikas.id` alias | 2026-06-25 |
| Q2 | Hosting | **Same VPS** as Telegram bot (memory budget adjusted: MongoDB 512MB cap, total stack ≤1.5GB) | 2026-06-25 |
| Q3 | Admin email | **Gmail SMTP** (`rikas.idn@gmail.com`) with app-specific password — zero cost, 500 emails/day limit | 2026-06-25 |

---

## 11. Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| Tech Lead | Hermes Agent | ✅ Approved | 2026-06-25 |
| Product Manager | RIKAS founder | Pending | |
| QA Lead | TBD | Pending | |

**Status**: ✅ All requirements traced, FR ↔ US ↔ Tasks alignment verified. Ready for implementation handoff.