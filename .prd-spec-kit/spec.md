# Product Spec — RIKAS Indo Technology Event Organizer Website

> **The detailed "what & why" artifact.** User stories with acceptance scenarios, functional requirements, success criteria. **Strictly technology-agnostic** — all implementation choices live in `plan.md`, not here.

**Feature Branch**: `001-rikas-eo-website`
**Created**: 2026-06-25
**Status**: Draft → Clarified (after Q1–Q3 resolution)
**Input**: User description: "Buatkan website style seperti TeamLiquid.com untuk event organizer"
**Related PRD**: `.prd-spec-kit/prd.md`
**Related Plan**: `.prd-spec-kit/plan.md`

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse Upcoming & Past Events (Priority: P1) 🎯 MVP

A tournament participant or fan visits the site to find upcoming events or browse RIKAS's track record. They land on the homepage, see featured upcoming events, navigate to the events page, filter by their game of interest (Mobile Legends, Free Fire, PUBG), click into an event, see the full details (description, prize pool, gallery), and tap a WhatsApp button to register their team.

**Why this priority**: The event portfolio is the **core value proposition** and the primary reason the site exists. Without it, the site is just a digital business card — not a lead-generation engine for the EO business. This is the minimum useful slice of the site.

**Independent test**: Visit `/event` → see grid of event cards (image, game, date, location, prize pool). Filter by game. Click a card → see full event detail page with description, gallery, WhatsApp registration link. Verify the next 3 upcoming events appear on the homepage carousel.

**Acceptance scenarios**:

1. **Given** I'm on the homepage, **When** I scroll below the hero, **Then** I see a "Event Mendatang" section featuring the next 3 upcoming events in a carousel
2. **Given** I'm on the events page `/event`, **When** the page loads, **Then** I see a grid of upcoming events sorted by date ascending
3. **Given** I'm on the events page, **When** I click the "Event Selesai" tab, **Then** I see past events sorted by date descending
4. **Given** I'm on the events page, **When** I click a game filter chip (e.g., "Mobile Legends"), **Then** the grid filters to only show events tagged with that game
5. **Given** I'm on an event detail page `/event/[slug]`, **When** I scroll, **Then** I see: hero image, event title, game tag, date/time, location with map link, prize pool, description, participating teams (if any), photo gallery, and a WhatsApp registration CTA
6. **Given** I'm on an event detail page, **When** I click "Daftar via WhatsApp", **Then** a new tab opens to `wa.me/<number>?text=<pre-filled-message>`
7. **Given** an event is in "completed" status, **When** I view it, **Then** the registration CTA is replaced with "Lihat Hasil" linking to results/news

---

### User Story 2 — Discover Services & Talent (Priority: P1) 🎯 MVP

A brand manager or peer event organizer visits the site to evaluate RIKAS for a sponsorship or subcontract. They look for what services RIKAS offers (tournament organization, live streaming, caster/MC, cosplay, design/video), see sample work, and meet the team members who deliver those services. They capture enough context to decide whether to fill in the partnership inquiry form.

**Why this priority**: Without services and team info, the inquiry form (US3) has no emotional context to convert — visitors can't pre-qualify themselves. This story turns the site from "where to register" into "why to hire RIKAS".

**Independent test**: Visit `/layanan` → see 5+ service categories with icons. Click "Live Streaming" → see service description, sample work gallery, assigned team members. Visit `/tim` → see team grid grouped by department (Talent, Production, Operations). Click a member → see their bio, social links, portfolio.

**Acceptance scenarios**:

1. **Given** I'm on the services page `/layanan`, **When** I scroll, **Then** I see 5 service cards: Penyelenggara Turnamen, Jasa Live Streaming, Caster & MC, Cosplay, Desain & Videografi
2. **Given** I'm viewing a service detail page, **When** I scroll, **Then** I see: hero image, service description, sample work (3+ items), assigned team members (linked to their profiles), and a "Diskusikan Kebutuhan Anda" WhatsApp CTA
3. **Given** I'm on the team page `/tim`, **When** the page loads, **Then** I see team members grouped by department in alphabetical order within each group
4. **Given** I'm on a team member profile, **When** I view it, **Then** I see: photo, name, role title, bio (3-5 sentences), social links (Instagram, WhatsApp), and portfolio items
5. **Given** I'm on any page, **When** I look at the navigation, **Then** I see "Layanan" and "Tim" as primary nav items

---

### User Story 3 — Submit Partnership / Talent Inquiry (Priority: P1) 🎯 MVP

A sponsor, peer organizer, or aspiring talent visits the site, evaluates the services and team (US2), then decides to make contact. They fill out a structured inquiry form selecting the appropriate inquiry type, leave their contact details and a message, submit, and see a confirmation. RIKAS receives the inquiry via email and CMS dashboard.

**Why this priority**: **Lead capture is the conversion goal.** All other content exists to drive visitors to this form. Without it, traffic has no commercial outcome.

**Independent test**: Visit `/kontak` → see contact form. Fill in fields (name, WhatsApp, inquiry type = "Partnership", message). Submit → see success page with relevant next-step info. Verify email is sent to admin and inquiry appears in CMS dashboard.

**Acceptance scenarios**:

1. **Given** I'm on the contact page, **When** the form loads, **Then** I see fields: Nama Lengkap (required), WhatsApp (required, validated format), Email (optional), Jenis Inquiry (required, dropdown), Pesan (required, textarea 20–2000 chars), and a hidden honeypot field
2. **Given** I'm on the contact form, **When** I select inquiry type, **Then** the form may show type-specific follow-up questions (e.g., Partnership shows "Perkiraan Budget", Talent Application shows "Keahlian yang Diminati")
3. **Given** I'm submitting the form, **When** required fields are empty, **Then** I see inline validation errors in Indonesian (e.g., "Nama lengkap wajib diisi")
4. **Given** I'm submitting the form with valid data, **When** I click "Kirim Pesan", **Then** I see a success page ("Terima kasih! Tim kami akan menghubungi Anda dalam 1–2 hari kerja") and receive a copy of my inquiry via email
5. **Given** a submission has been made, **When** RIKAS admin checks CMS, **Then** the inquiry appears in the Inquiries collection with status "Baru"
6. **Given** a submission has been made, **When** email notifications are enabled, **Then** RIKAS admin receives an email with inquiry details and a deep link to the CMS
7. **Given** I submit the honeypot field (bot), **When** the form is submitted, **Then** I see the success page but no inquiry is created and no email is sent

---

### User Story 4 — Browse News & Gallery (Priority: P2)

A fan or sponsor browses recent RIKAS activities. They visit the news page, read recent articles about event results, team updates, or community stories. They also browse the photo gallery from past events, lightbox-zoom into photos they like, and share interesting finds via social or messaging apps.

**Why this priority**: Nice-to-have for **engagement and SEO** (more indexable content = more organic traffic) but not conversion-critical. Can ship as v1.1 after MVP launches.

**Independent test**: Visit `/berita` → see latest 6 articles. Click an article → see full content. Visit `/galeri` → see masonry grid. Click a photo → lightbox view with caption + event tag.

**Acceptance scenarios**:

1. **Given** I'm on the news page, **When** I scroll, **Then** I see the latest 6 articles with thumbnail, date, title, and excerpt (max 200 chars)
2. **Given** I'm on a news article page, **When** I scroll, **Then** I see: hero image, title, author (linked to team member profile), date, full content (rich text), and "Artikel Terkait" section with 3 related articles
3. **Given** I'm on the gallery page, **When** I scroll, **Then** I see a masonry/grid layout of photos with lazy loading, 24 per page
4. **Given** I'm on the gallery, **When** I click a photo, **Then** a lightbox opens showing the full image with caption and event name (linked to event detail)
5. **Given** I'm on any page, **When** I share on social (or copy URL), **Then** the OpenGraph preview shows the page title, description, and featured image

---

### User Story 5 — CMS-Manage All Content (Priority: P2)

A RIKAS staff member (founder or operations) logs into the CMS admin panel and performs routine content updates: creates a new event, uploads event photos to gallery, edits a team member's bio, publishes a news article, manages inquiries. All without developer involvement.

**Why this priority**: **Operators need this for the site to stay alive.** Without CMS, content goes stale within weeks. P2 because it's an internal capability, but it's also blocking US1–US4 content migration.

**Independent test**: Visit `/admin` → log in with credentials. Navigate to Events → click "Create New" → fill title, date, game, location, prize pool, upload hero image → save as draft → publish → see event on `/event`. Upload 5 photos to gallery → see them appear in `/galeri`. Reply to an inquiry by changing status from "Baru" to "Sudah Dibalas".

**Acceptance scenarios**:

1. **Given** I'm an admin user, **When** I visit `/admin`, **Then** I see a login form. After successful authentication, I see the CMS dashboard with collections: Events, Team Members, Services, News, Gallery, Inquiries, Media
2. **Given** I'm in the Events collection, **When** I create a new event with required fields (title, slug, game, date, location, status, featured image), **Then** the event is saved as draft by default and appears in the events list
3. **Given** I've created an event, **When** I click "Publish", **Then** the frontend rebuilds (within 5 min via webhook) and the event appears on `/event`
4. **Given** I'm uploading images, **When** I upload a 50MB image, **Then** I see an error "Ukuran file terlalu besar (maks 10MB)" and the upload is rejected
5. **Given** I'm in the Inquiries collection, **When** I view the list, **Then** I see all inquiries with filters by status (Baru, Sudah Dibaca, Sudah Dibalas), inquiry type, and date range
6. **Given** I'm a non-admin user (e.g., Viewer role), **When** I try to edit content, **Then** I see a permission denied error

---

### Edge Cases

- **EC-01**: WhatsApp link target number is invalid/unreachable → Display alternative contact methods on the page (email, Instagram) and the page works without the WhatsApp link
- **EC-02**: Event has no featured image → Show a branded placeholder card with the game logo and date
- **EC-03**: Team member has no photo → Show initials avatar (e.g., "JS" for Joko Susanto) with brand-color background
- **EC-04**: CMS is unreachable during form submit → Queue submission client-side and retry on next network availability; show user a "Will send when online" message
- **EC-05**: Event date is in the past but status is still "upcoming" → CMS shows a warning banner during edit
- **EC-06**: Gallery has 100+ photos → Pagination kicks in at 24 photos; URL-based deep linking supports `/galeri?page=3`
- **EC-07**: User submits form with invalid email format → Inline validation error "Format email tidak valid"
- **EC-08**: Admin uploads 50MB image → Server-side rejection with size limit message
- **EC-09**: Multiple admins editing the same event simultaneously → Last-write-wins with edit conflict warning
- **EC-10**: Search engine crawls admin panel → `/admin` returns `noindex,nofollow` or requires auth before rendering
- **EC-11**: Image upload fails mid-upload → Show progress bar with retry button; partial uploads are discarded
- **EC-12**: User opens site on IE11 or old browser → Show a friendly "browser tidak didukung" message recommending upgrade
- **EC-13**: Form submission triggers rate limit (>5 from same IP in 1 min) → Return 429 with "Terlalu banyak percobaan, coba lagi nanti"
- **EC-14**: Indonesian holidays affect response times → CMS inquiry list shows "Hari Libur Nasional" indicator
- **EC-15**: Instagram post references a team member not yet in CMS → Gallery/event post remains valid; team member slot shows empty state

---

## Requirements *(mandatory)*

### Functional Requirements

> **Testable, technology-agnostic, IDed per 9-gap convention.**

#### Group 1: Event Showcase

- **FR-001**: System MUST display upcoming events on `/event` with featured image, game, date, location, prize pool, registration status
- **FR-002**: System MUST allow filtering events by game tag (single-select chip interface)
- **FR-003**: System MUST display past events on `/event` with sort by date descending
- **FR-004**: Each event MUST have a detail page at `/event/[slug]` with full description, gallery, registration CTA
- **FR-005**: Event registration MUST link to WhatsApp via `wa.me/<number>?text=<prefilled>` deep link
- **FR-006**: System MUST mark events with status: `akan_datang` (upcoming), `berlangsung` (ongoing), `selesai` (completed), `dibatalkan` (cancelled)
- **FR-007**: Events MUST support multiple game tags (primary + secondary)
- **FR-008**: Homepage MUST feature the next 3 upcoming events in a prominent carousel

#### Group 2: Services & Team

- **FR-010**: System MUST display 5+ service categories on `/layanan` with icon, title, short description
- **FR-011**: Each service MUST have a detail page at `/layanan/[slug]` with description, sample work, assigned team
- **FR-012**: System MUST display team members on `/tim` with photo, name, role, short bio (truncated)
- **FR-013**: Each team member MUST have a profile page at `/tim/[slug]` with full bio, social links, portfolio
- **FR-014**: Team photos MUST be displayed at consistent aspect ratio (1:1 or 4:5) with lazy loading
- **FR-015**: Service pages MUST link to WhatsApp contact for booking inquiries
- **FR-016**: System MUST support team member grouping by department (Talent, Produksi, Operasional)
- **FR-017**: Each team member MUST have a role title in Indonesian (e.g., "Caster", "Desainer Grafis")
- **FR-018**: System MUST display service area locations (Semarang, Solo, Kendal, Pati) on relevant pages

#### Group 3: Contact & Inquiries

- **FR-020**: System MUST provide contact form at `/kontak` with fields: name, email, WhatsApp, inquiry type, message
- **FR-021**: Form MUST validate required fields server-side (name, WhatsApp, inquiry type, message)
- **FR-022**: Form submissions MUST be stored in CMS with timestamp, status (`baru`/`dibaca`/`dibalas`)
- **FR-023**: Form submissions MUST trigger email notification to configured admin email
- **FR-024**: System MUST display WhatsApp, Instagram, email contact info in footer of every page
- **FR-025**: System MUST display office location(s) on contact page with embedded map link
- **FR-026**: Contact form MUST include hidden honeypot field for spam prevention
- **FR-027**: Inquiry types MUST include: Kemitraan (Partnership), Lamaran Talent (Talent Application), Booking Event (Event Booking), Pertanyaan Umum (General Question)
- **FR-028**: System MUST show inquiry-specific success page with relevant next-step info

#### Group 4: News & Gallery

- **FR-030**: System MUST display latest 6 news articles on `/berita` with thumbnail, date, title, excerpt
- **FR-031**: Each article MUST have a detail page at `/berita/[slug]` with full content, author, date, related articles
- **FR-032**: System MUST display event photo gallery at `/galeri` with masonry/grid layout
- **FR-033**: Gallery photos MUST support lightbox view with caption and event reference
- **FR-034**: Gallery photos MUST be taggable with event reference (link to event detail page)
- **FR-035**: News articles MUST support featured image and inline images
- **FR-036**: News articles MUST have author attribution (link to team member profile)
- **FR-037**: News list MUST support pagination (12 per page) or infinite scroll

#### Group 5: CMS & Admin

- **FR-040**: System MUST provide CMS admin panel at `/admin` with authentication
- **FR-041**: CMS MUST allow CRUD operations for: Events, Team Members, Services, News, Gallery, Inquiries
- **FR-042**: CMS MUST allow image upload with automatic WebP/AVIF optimization (max 10MB per file)
- **FR-043**: CMS MUST support draft/publish workflow for all content types
- **FR-044**: CMS MUST allow bulk upload for gallery photos (drag-and-drop multiple)
- **FR-045**: CMS MUST display inquiry inbox with status filtering, inquiry type filter, date range
- **FR-046**: CMS MUST allow rich-text editor (bold, italic, links, images, lists, headings) for news/events
- **FR-047**: CMS MUST support Indonesian language for admin UI labels
- **FR-048**: CMS MUST support user roles: Admin (full), Editor (content only), Viewer (read-only)

#### Group 6: Global / Cross-Cutting

- **FR-050**: System MUST have responsive layout that works on mobile (320px+), tablet, desktop
- **FR-051**: System MUST have dark theme by default (per TeamLiquid.com reference)
- **FR-052**: System MUST use RIKAS brand colors (primary navy `#1b2a51`) extracted from logo
- **FR-053**: System MUST display RIKAS logo at top-left of navbar (single location only)
- **FR-054**: System MUST have Indonesian language across all user-facing content
- **FR-055**: System MUST have sitemap.xml and robots.txt
- **FR-056**: System MUST support OpenGraph meta tags for social sharing
- **FR-057**: System MUST have a `/health` endpoint returning 200 OK for monitoring
- **FR-058**: System MUST log all form submissions and admin actions for audit

### Key Entities

- **[Event]**: A RIKAS-organized or co-organized event. Attributes: title, slug, game tags (array), status, start date/time, end date/time, location (city + venue), prize pool (formatted text), description (rich text), featured image, gallery (array of media refs), registration WhatsApp number, registration prefilled message, results URL (optional), created/updated timestamps.
- **[TeamMember]**: A person on the RIKAS roster. Attributes: name, slug, role title, department (Talent/Produksi/Operasional), short bio (max 280 chars), full bio (rich text), photo, social links (Instagram, WhatsApp, YouTube), portfolio items (array), services (array of refs to Service), display order, active status.
- **[Service]**: A service RIKAS offers. Attributes: title, slug, icon, short description, full description, sample work (array of media refs), assigned team (array of refs to TeamMember), WhatsApp contact number, display order.
- **[NewsArticle]**: A blog/news post. Attributes: title, slug, excerpt (max 200 chars), content (rich text), featured image, author (ref to TeamMember), publish date, status (draft/published), related articles (array of refs).
- **[GalleryPhoto]**: A single image in the gallery. Attributes: image file, caption (optional), event reference (optional, ref to Event), upload date, tags (array).
- **[Inquiry]**: A contact form submission. Attributes: name, email, WhatsApp, inquiry type, message, type-specific fields (optional), timestamp, status (baru/dibaca/dibalas), notes (admin-only).
- **[MediaAsset]**: An uploaded file (image). Attributes: file, original filename, mime type, alt text, upload date, optimized variants (WebP/AVIF).
- **[User]**: A CMS admin user. Attributes: email, password hash, role (Admin/Editor/Viewer), display name, last login.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001 (Conversion)**: Users can complete the inquiry form submission in under 90 seconds (from first field focus to success page)
- **SC-002 (Performance)**: Event list renders within 1.5 seconds for collections of up to 200 events
- **SC-003 (Engagement)**: 60%+ of homepage visitors scroll past the hero section (proxy for content engagement)
- **SC-004 (Business)**: Receive 10+ qualified inquiry form submissions within first quarter of launch
- **SC-005 (Quality)**: Form submissions complete successfully 99% of the time on first attempt
- **SC-006 (Adoption)**: CMS staff publish at least 2 content updates per week (events, news, gallery) within 30 days of launch
- **SC-007 (SEO)**: At least 50 organic search visits per month within 90 days of launch
- **SC-008 (Reliability)**: Site available 99.5%+ of the time per monthly uptime check
- **SC-009 (Performance - Mobile)**: Lighthouse Performance score ≥ 90 on mobile for home, events, services, team pages
- **SC-010 (Content Migration)**: At least 20 historical events from Instagram documented in CMS within 30 days of launch

### Quality Criteria

- **QC-001**: All user-facing strings in Indonesian, centralized in i18n dictionary for future English
- **QC-002**: All images have descriptive `alt` text in Indonesian
- **QC-003**: WCAG 2.1 AA color contrast met on all text/background pairs
- **QC-004**: All interactive elements keyboard-accessible with visible focus indicator
- **QC-005**: All pages have unique title tag (50-60 chars) and meta description (140-160 chars)

---

## Assumptions

- **A1**: RIKAS has a WhatsApp Business number ready for registration links
- **A2**: The Instagram account `@rikas.idn` remains the primary social presence; this site complements it
- **A3**: Founders have a Gmail or similar for inquiry email notifications
- **A4**: VPS has at least 2GB RAM and 20GB disk available
- **A5**: Target launch in Q3 2026
- **A6**: Past events will be migrated manually from Instagram and WhatsApp archives
- **A7**: Team photos will be provided by team members or cropped from existing event photos
- **A8**: Domain name will be `rikas.id` or similar — pending clarification (Q1)
- **A9**: VPS location: same as Telegram bot VPS — pending clarification (Q2)
- **A10**: Admin email: same as Telegram bot admin email — pending clarification (Q3)
- **A11**: Users access the site primarily on mobile (Android, mid-tier devices)
- **A12**: Indonesian internet users accept dark theme without preference toggle in v1
- **A13**: Form data sensitivity is low — names, WhatsApp numbers, free-text inquiries

---

## Out of Scope

- User accounts / login system (visitor-facing)
- Online tournament registration/payment
- Live streaming player embed (link out to YouTube/Twitch instead)
- Native mobile app (Android/iOS)
- Multi-language (English) UI — Indonesian only in v1
- E-commerce / merchandise store
- Community forum / Discord embed (link out)
- Real-time chat widget
- Email newsletter subscription
- Advanced search with filters (basic search is in scope if time permits)
- Sponsor portal / private pages
- Ticketing / RSVP system
- AI-powered content recommendations
- Dark/light theme toggle (dark only in v1)
- Per-language URL routing (e.g., `/en/event`)

---

## Open Questions

> **Items that need user input before implementation. After clarification, max 3 should remain.**

- [ ] **Q1**: Domain name — `rikas.id`, `rikastechnology.id`, `rikas-esports.id`, or other? Domain registration is a separate task but influences brand consistency.
- [ ] **Q2**: Hosting — same VPS as Telegram bot (1.9GB RAM), or provision new VPS? Same VPS saves cost; new VPS isolates concerns.
- [ ] **Q3**: Admin email for inquiry notifications — Gmail SMTP (free, 500/day limit) or transactional service like Mailgun (paid, scalable)? Affects NFR number 005 (reliability).

---

## Clarifications Log

> **Append-only record of clarification Q&A. Filled by `clarify` phase.**

### Session 2026-06-25 (Pending)

- **Q1**: Domain — `rikas.id` preferred (consistent with `@rikas.idn` Instagram handle). Awaiting user confirmation.
- **Q2**: Hosting — Same VPS likely OK if MongoDB memory limits are tight. Awaiting user confirmation.
- **Q3**: Email — Start with Gmail SMTP, migrate to transactional service if volume exceeds free tier.

---

**Next steps**: After spec is clarified (Q1–Q3 resolved), run `checklist` to generate quality validation items, then `plan` to translate to technical implementation, then `tasks` to break into executable work items.