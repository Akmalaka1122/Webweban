# PRD — RIKAS Indo Technology Event Organizer Website

> Business-facing Product Requirements Document. Technology-agnostic. The "what" and "why", not the "how".

**Feature ID**: `001-rikas-eo-website`
**Created**: 2026-06-25
**Status**: Draft
**Owner**: RIKAS Indo Technology founder
**Related Spec**: `.prd-spec-kit/spec.md`
**Related Plan**: `.prd-spec-kit/plan.md`

---

## Problem

RIKAS Indo Technology is an established Event Organizer (EO) and esports community builder in Central Java, Indonesia (Semarang, Solo, Kendal, Pati). The brand has 952+ Instagram posts and 7,425+ followers with active tournament operations (Mobile Legends, Free Fire, PUBG tournaments) and a talent roster (Caster, MC, Cosplay, Designer, Videographer).

**The gap**: All brand presence lives on Instagram (`@rikas.idn`). There is no owned digital property. Potential partners (sponsors, brands, schools), prospective tournament participants, and talent collaborators have no place to:
- See a complete, searchable history of past events
- Read about the team and services in depth
- Submit partnership/event inquiries professionally
- Browse high-resolution event galleries

Without an owned website, RIKAS is:
1. **Capped by Instagram algorithm** — organic reach declining industry-wide
2. **Invisible to sponsors** who scout via web search
3. **Losing talent leads** who can't easily evaluate the org without DM-scrolling

---

## Goal

Build a self-hosted, content-managed website at `rikas.id` (or chosen domain) that:
1. Showcases the full portfolio of RIKAS events, talents, and services
2. Generates qualified partnership and booking inquiries (target: 5+ per month)
3. Acts as the canonical home for RIKAS brand content, indexed by Google
4. Reduces repetitive inbound DMs by surfacing FAQs (pricing, regions, booking process)

**Success = 50+ organic search visits per month within 90 days of launch + 10+ qualified inquiry form submissions in first quarter.**

---

## Non-Goals / Out of Scope (v1)

- **No user accounts / login system** — the site is a marketing surface, not a community platform
- **No online tournament registration/payment** — registration continues via WhatsApp/Instagram DM
- **No live streaming player embed** — link out to YouTube/Twitch instead
- **No mobile app** — web-only, mobile-responsive
- **No multi-language (English)** — Indonesian only in v1; structure must be i18n-ready for future expansion
- **No e-commerce / merchandise store** — out of scope
- **No community forum / Discord embed** — link out instead
- **No real-time chat widget** — use contact form + WhatsApp link

---

## Target Users

| Persona | Description | Primary need this solves |
|---|---|---|
| **Sponsor / Brand Manager** | Marketing manager at a gaming-adjacent brand (Vivo, Oppo, telcos, energy drinks) evaluating RIKAS for sponsorship. Searches Google. | See event portfolio, audience size, past sponsor logos, contact form |
| **Tournament Organizer (Peer)** | Another EO or school event planner in Central Java looking to collaborate or subcontract talent. | Browse talent roster with rates, see service areas (Semarang/Solo/Kendal/Pati), contact form |
| **Talent / Crew Applicant** | Aspiring caster, MC, cosplayer, designer, or videographer wanting to join RIKAS roster. | See open positions, meet the team, learn culture, apply form |
| **Event Participant** | Player or team captain looking for upcoming tournaments, registration info. | Find upcoming events with dates/locations/prize pools, link to WhatsApp registration |
| **Casual Visitor / Fan** | Instagram follower curious about RIKAS, possibly interested in services or merchandise (future). | Browse news, gallery, learn about the org |

---

## User Stories

### User Story 1 — Browse Upcoming & Past Events (Priority: P1) 🎯 MVP

**As a** tournament participant or fan
**I want** to see all upcoming and past RIKAS events in one place, filterable by game and date
**So that** I can find registration info for upcoming events or browse the org's track record

**Why P1**: The event portfolio is the core value proposition. Without it, the site is just an "About" page.

**Independent test**: Visit `/event`, see a grid of event cards with game icons, dates, locations, prize pools. Filter by game (Mobile Legends). Click a card → see event detail page with description, registration WhatsApp link, gallery.

**Acceptance scenarios**:
1. **Given** I'm on the homepage, **When** I click "Event", **Then** I see a grid of upcoming events with featured image, game, date, location
2. **Given** I'm on the events page, **When** I click "Past Events" tab, **Then** I see historical events sorted by date descending
3. **Given** I'm on an event detail page, **When** I scroll, **Then** I see event description, prize pool, participating teams, gallery, and a WhatsApp CTA

### User Story 2 — Discover Services & Talent (Priority: P1) 🎯 MVP

**As a** brand/sponsor or peer event organizer
**I want** to see what services RIKAS offers and the team behind them
**So that** I can evaluate whether to hire them for my event or sponsorship

**Why P1**: Without services and team info, the inquiry form has no context for prospects to fill.

**Independent test**: Visit `/layanan`, see service cards (Live Streaming, Tournament Org, Caster/MC, Cosplay, Design/Video). Click a service → see detail with description, sample work, team members assigned. Visit `/tim`, see team grid with photos, roles, bios.

**Acceptance scenarios**:
1. **Given** I'm on the services page, **When** I scroll, **Then** I see 5+ service categories with icons and short descriptions
2. **Given** I'm viewing a service detail, **When** I scroll, **Then** I see portfolio samples and assigned team members
3. **Given** I'm on the team page, **When** I click a team member, **Then** I see their bio, role, and social links

### User Story 3 — Submit Partnership/Talent Inquiry (Priority: P1) 🎯 MVP

**As a** sponsor or talent applicant
**I want** to send a structured inquiry form
**So that** RIKAS can respond professionally with relevant context

**Why P1**: Lead capture is the conversion goal. Without a form, all traffic is wasted.

**Independent test**: From any page, click "Kontak" → see contact form with fields (name, email/WhatsApp, inquiry type, message). Submit → see thank-you page. Admin receives inquiry via email and CMS dashboard.

**Acceptance scenarios**:
1. **Given** I'm on the contact page, **When** I fill and submit the form, **Then** I see a success message and RIKAS receives the inquiry
2. **Given** I selected "Partnership" as inquiry type, **When** I submit, **Then** the inquiry is tagged "partnership" in the CMS
3. **Given** the form has validation errors, **When** I try to submit, **Then** I see field-level error messages in Indonesian

### User Story 4 — Browse News & Gallery (Priority: P2)

**As a** fan or sponsor
**I want** to see recent news articles and event photo galleries
**So that** I can stay updated and see proof of work

**Why P2**: Nice-to-have for engagement, but not conversion-critical.

**Independent test**: Visit `/berita`, see latest 6 articles with thumbnail, date, excerpt. Click → article detail. Visit `/galeri`, see masonry grid of event photos with lightbox.

**Acceptance scenarios**:
1. **Given** I'm on the news page, **When** I scroll, **Then** I see article cards sorted by date descending
2. **Given** I'm in the gallery, **When** I click a photo, **Then** I see it in a lightbox with caption
3. **Given** I'm on an article, **When** I scroll to the end, **Then** I see related articles and share buttons

### User Story 5 — CMS-Manage All Content (Priority: P2)

**As a** RIKAS staff member
**I want** to log into a CMS and add/edit events, news, team members, gallery photos
**So that** the site stays current without developer involvement

**Why P2**: Operators need this to keep the site alive, but it's an internal feature.

**Independent test**: Visit `/admin` (CMS), log in, create a new event → it appears on `/event` after publish. Upload gallery photos → they appear in `/galeri`.

**Acceptance scenarios**:
1. **Given** I'm logged into CMS, **When** I create an event with title/date/image, **Then** it appears on `/event` after publish
2. **Given** I'm editing a team member, **When** I upload a new photo, **Then** it replaces the old one
3. **Given** I'm a non-admin user, **When** I try `/admin`, **Then** I'm denied access

---

## Feature Requirements

### Functional Requirements

> Note: Numbering uses 9-gap convention per Spec Kit (FR-009 reserved as visual separator between feature groups).

#### Group 1: Event Showcase (FR-001..008)

- **FR-001**: System MUST display upcoming events on `/event` with featured image, game, date, location, prize pool, registration status
- **FR-002**: System MUST allow filtering events by game (Mobile Legends, Free Fire, PUBG Mobile, Valorant, etc.)
- **FR-003**: System MUST display past events on `/event` with sort by date descending
- **FR-004**: Each event MUST have a detail page at `/event/[slug]` with full description, gallery, registration CTA
- **FR-005**: Event registration MUST link to WhatsApp (deep link `wa.me/...`) — not in-site form
- **FR-006**: System MUST mark events with status: `upcoming`, `ongoing`, `completed`, `cancelled`
- **FR-007**: Events MUST support multiple games (primary + secondary tags)
- **FR-008**: Homepage MUST feature the next 3 upcoming events in a prominent carousel

#### Group 2: Services & Team (FR-010..018)

- **FR-010**: System MUST display 5+ service categories on `/layanan`: Tournament Org, Live Streaming, Caster/MC, Cosplay, Design/Video
- **FR-011**: Each service MUST have a detail page at `/layanan/[slug]` with description, sample work, assigned team
- **FR-012**: System MUST display team members on `/tim` with photo, name, role, short bio
- **FR-013**: Each team member MUST have a profile page at `/tim/[slug]` with full bio, social links, portfolio
- **FR-014**: Team photos MUST be displayed at consistent aspect ratio with lazy loading
- **FR-015**: Service pages MUST link to WhatsApp contact for booking inquiries
- **FR-016**: System MUST support team member grouping by department (Talent, Production, Operations)
- **FR-017**: Each team member MUST have a role title in Indonesian (e.g., "Caster", "Desainer Grafis")
- **FR-018**: System MUST display service area locations (Semarang, Solo, Kendal, Pati) on relevant pages

#### Group 3: Contact & Inquiries (FR-020..028)

- **FR-020**: System MUST provide contact form at `/kontak` with fields: name, email, WhatsApp, inquiry type, message
- **FR-021**: Form MUST validate required fields (name, inquiry type, message) server-side
- **FR-022**: Form submissions MUST be stored in CMS with timestamp, status (`new`/`read`/`replied`)
- **FR-023**: Form submissions MUST trigger email notification to configured admin email
- **FR-024**: System MUST display WhatsApp, Instagram, email contact info in footer
- **FR-025**: System MUST display office location(s) on contact page with embedded map link
- **FR-026**: Contact form MUST include reCAPTCHA-free honeypot or rate-limit to prevent spam
- **FR-027**: Inquiry types MUST include: Partnership, Talent Application, Event Booking, General Question
- **FR-028**: System MUST show inquiry-specific success page with relevant next-step info

#### Group 4: News & Gallery (FR-030..037)

- **FR-030**: System MUST display latest 6 news articles on `/berita` with thumbnail, date, title, excerpt
- **FR-031**: Each article MUST have a detail page at `/berita/[slug]` with full content, author, date, related articles
- **FR-032**: System MUST display event photo gallery at `/galeri` with masonry/grid layout
- **FR-033**: Gallery photos MUST support lightbox view with caption
- **FR-034**: Gallery photos MUST be tagged with event reference (link to event detail page)
- **FR-035**: News articles MUST support featured image and inline images
- **FR-036**: News articles MUST have author attribution (link to team member)
- **FR-037**: News list MUST support pagination or infinite scroll

#### Group 5: CMS & Admin (FR-040..048)

- **FR-040**: System MUST provide CMS admin panel at `/admin` with authentication
- **FR-041**: CMS MUST allow CRUD operations for: Events, Team Members, Services, News, Gallery, Inquiries
- **FR-042**: CMS MUST allow image upload with automatic WebP/AVIF optimization
- **FR-043**: CMS MUST support draft/publish workflow for all content types
- **FR-044**: CMS MUST allow bulk upload for gallery photos
- **FR-045**: CMS MUST display inquiry inbox with status filtering
- **FR-046**: CMS MUST allow rich-text editor (bold, italic, links, images, lists, headings) for news/events
- **FR-047**: CMS MUST support Indonesian language for admin UI
- **FR-048**: CMS MUST support user roles: Admin (full access), Editor (content only), Viewer (read-only)

#### Group 6: Global / Cross-Cutting (FR-050..058)

- **FR-050**: System MUST have responsive layout that works on mobile (320px+), tablet, desktop
- **FR-051**: System MUST have dark theme by default (per TeamLiquid.com reference)
- **FR-052**: System MUST use RIKAS brand colors (primary navy `#1b2a51`) extracted from logo
- **FR-053**: System MUST display RIKAS logo at top-left of navbar (only one location)
- **FR-054**: System MUST have Indonesian language across all user-facing content
- **FR-055**: System MUST have sitemap.xml and robots.txt
- **FR-056**: System MUST support OpenGraph meta tags for social sharing
- **FR-057**: System MUST have a `/health` endpoint returning 200 OK for monitoring
- **FR-058**: System MUST log all form submissions and admin actions for audit

### Non-Functional Requirements

- **NFR-001 (Performance)**: Lighthouse Performance score MUST be ≥ 90 on mobile for all main pages
- **NFR-002 (Performance)**: First Contentful Paint MUST be < 1.5s on simulated 4G
- **NFR-003 (Performance)**: Largest Contentful Paint MUST be < 2.5s on simulated 4G
- **NFR-004 (Performance)**: Total JavaScript per route MUST be < 200KB gzipped
- **NFR-005 (Availability)**: Site MUST be available 99.5% of the time (allows ~3.6h downtime/month)
- **NFR-006 (Security)**: All form submissions MUST be server-side validated
- **NFR-007 (Security)**: Admin panel MUST require authentication and rate-limit login attempts
- **NFR-008 (Privacy)**: System MUST NOT use third-party tracking pixels (Meta, Google Analytics)
- **NFR-009 (Accessibility)**: All interactive elements MUST be keyboard-navigable per WCAG 2.1 AA
- **NFR-010 (Accessibility)**: All images MUST have descriptive `alt` text in Indonesian
- **NFR-011 (SEO)**: All pages MUST have unique title and meta description
- **NFR-012 (SEO)**: Site MUST have Schema.org structured data for Organization and Event
- **NFR-013 (Compatibility)**: Site MUST work on latest 2 versions of Chrome, Firefox, Safari, Samsung Internet
- **NFR-014 (i18n-Ready)**: All user-facing strings MUST be centralized for future English translation
- **NFR-015 (Observability)**: All errors MUST be logged with correlation IDs

---

## Edge Cases

- What happens when a WhatsApp link target number is invalid/unreachable? → Display alternative contact methods on the page
- What happens when an event has no featured image? → Show a branded placeholder with the game logo
- What happens when a team member has no photo? → Show initials avatar with brand color background
- What happens when CMS is unreachable during form submit? → Queue submission client-side and retry
- What happens when an event date is in the past but status is still "upcoming"? → CMS should warn admin during edit
- What happens when gallery has 100+ photos? → Implement pagination (24 per page) + lazy loading
- What happens when user submits form with invalid email? → Inline validation error in Indonesian
- What happens when admin uploads 50MB image? → Server-side rejection with size limit message

---

## Success Metrics

| Metric | Target | How measured | Timeframe |
|---|---|---|---|
| Organic search traffic | 50+ visits/month | Server logs (no PII) | 90 days post-launch |
| Inquiry form submissions | 10+ qualified inquiries | CMS inquiry count | First quarter |
| Partnership inquiries | 3+ brand partnership inquiries | CMS inquiry type filter | First quarter |
| Lighthouse Performance (mobile) | ≥ 90 score | Lighthouse CI | Continuous |
| LCP on 4G | < 2.5s | Lighthouse + RUM | Continuous |
| CMS update frequency | 2+ content updates/week | Git log on CMS content | Ongoing |
| Event portfolio growth | All events from 2026+ documented | CMS event count | Ongoing |
| Bounce rate | < 60% | Server log analysis | 30 days post-launch |

---

## Technical Constraints

> **Hard constraints — not choices, but givens.**

- **Self-hosted** — must run on user's VPS under their control (Principle VI)
- **Mobile-first** — every design decision starts from mobile breakpoint (Principle I)
- **Indonesian language** — UI, microcopy, content in Bahasa Indonesia (Principle III)
- **No third-party tracking** — privacy-respecting analytics only (Principle V)
- **CMS-driven** — non-technical operators must update content (Principle IV)
- **Docker deployment** — `docker compose up` brings up the full stack

**Soft constraints** (preferences):
- Astro 5.x preferred for static-first rendering
- Tailwind CSS for utility-first styling
- MongoDB for CMS storage (Payload default)
- Caddy for reverse proxy with auto HTTPS

---

## Implementation Plan Summary

> Full plan in `.prd-spec-kit/plan.md`.

Static-export Astro 5 frontend for marketing pages, Payload CMS 3 (Node.js) for content management, MongoDB 7 for storage, all packaged in Docker Compose (app + mongo + Caddy). Astro reads from Payload's REST/GraphQL API at build time for SSG, with webhook-triggered rebuilds on content publish. TeamLiquid-inspired dark theme with RIKAS navy `#1b2a51` as primary brand color, accent gradient (orange→pink→purple) from the Instagram logo gradient ring.

---

## Task Breakdown Summary

> Full list in `.prd-spec-kit/tasks.md`.

~140 tasks across 9 phases:
1. **Setup** (18 tasks) — repo init, Docker Compose, Astro scaffold, Payload scaffold
2. **Foundational** (29 tasks) — design tokens, navigation, footer, layouts, CMS collections
3. **US1: Event Showcase** (12 tasks) — event pages, filtering, detail page
4. **US2: Services & Team** (15 tasks) — service pages, team grid, profile pages
5. **US3: Contact Form** (11 tasks) — form, validation, CMS storage, email notification
6. **US4: News & Gallery** (11 tasks) — article pages, gallery, lightbox
7. **US5: CMS & Admin** (10 tasks) — Payload collections, admin UI, auth, roles
8. **Polish** (28 tasks) — Lighthouse audit, SEO, sitemap, accessibility, deploy
9. **Final Validation** (6 tasks) — screenshots, end-to-end verification, release

**MVP = US1 + US2 + US3 + US5 (CMS needed to populate US1/US2)** = ~108 tasks.

---

## Open Questions — RESOLVED

> All 3 questions resolved during ECC audit v2 (2026-06-25).

- **Q1**: Domain name — **`rikas.id`** (primary), `www.rikas.id` alias ✅
- **Q2**: Hosting — **Same VPS** as Telegram bot (MongoDB 512MB cap, total stack ≤1.5GB) ✅
- **Q3**: Admin email — **Gmail SMTP** (`rikas.idn@gmail.com`) with app-specific password (500 emails/day) ✅

---

## Assumptions

- **A1**: RIKAS already has a WhatsApp Business number for registration links
- **A2**: The Instagram account `@rikas.idn` remains the primary social presence; this site complements, doesn't replace
- **A3**: Founders have a Google Workspace or similar for email notifications
- **A4**: VPS has at least 2GB RAM and 20GB disk available (MongoDB + Docker images)
- **A5**: Target launch in Q3 2026, before Mobile Legends tournament season peak
- **A6**: Past events and team bios will be migrated manually from Instagram and WhatsApp archives

---

## Dependencies

- **D1**: VPS provisioned with Docker installed (separate concern)
- **D2**: Domain registered and DNS configured (separate concern)
- **D3**: WhatsApp Business API or simple `wa.me` deep link (use deep link for v1)
- **D4**: SMTP service for inquiry notifications (use Gmail SMTP or Mailgun)

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content migration from Instagram takes longer than expected | High | Medium | Phase content migration in parallel with development; ship with 5–10 events first |
| MongoDB on small VPS runs out of memory | Medium | High | Set MongoDB memory limits, monitor with healthchecks |
| Indonesian-only content limits SEO reach | Low | Low | Add English meta descriptions for international search (NFR-014) |
| CMS complexity overwhelms non-technical staff | Medium | High | Custom training video, simplified UI defaults, editorial workflow |
| Slow mobile performance due to image-heavy gallery | High | Medium | Aggressive image optimization, lazy loading, masonry with virtual scroll |

---

## Approvals

| Role | Name | Status | Date |
|---|---|---|---|
| Product Owner | RIKAS founder | Pending | |
| Engineering Lead | TBD | Pending | |
| Design | TBD | Pending | |

---

**Next steps**: After PRD approval, run `specify` phase to produce `.prd-spec-kit/spec.md` with detailed user stories, then `clarify` to resolve Q1–Q3, then `checklist` to validate spec quality, then `plan` for technical architecture, then `tasks` for execution breakdown.
