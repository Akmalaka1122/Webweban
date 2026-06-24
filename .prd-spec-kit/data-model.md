# Data Model — RIKAS EO Website

> **MongoDB collections for Payload CMS 3.** Detailed schema, field types, validation, indexes, relationships, hooks, access control.

**Feature**: `001-rikas-eo-website`
**Created**: 2026-06-25
**Database**: MongoDB 7.x (single-node, 512MB memory limit)
**Adapter**: `@payloadcms/db-mongodb`

---

## Collections Overview

| Collection | Slug | Purpose | Est. Records |
|---|---|---|---|
| Events | `events` | Tournament/event showcase | 200 |
| Team Members | `team-members` | RIKAS roster | 30 |
| Services | `services` | Service offerings | 5–10 |
| News | `news` | Articles/blog posts | 100 |
| Gallery | `gallery` | Event photos | 1000 |
| Inquiries | `inquiries` | Contact form submissions | 500 |
| Media | `media` | Uploaded files | 2000 |
| Users | `users` | CMS admin users | 3 |

---

## Collection: Events

**Slug**: `events`
**Display**: Event list + detail
**Owner spec**: FR-001..008, US-1

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `title` | text | ✅ | min 3, max 200 | — | Event title (e.g., "Mobile Legends Championship Season 7") |
| `slug` | text | ✅ | unique, kebab-case, max 100 | auto from title | URL-friendly identifier |
| `game` | array of select | ✅ | 1+ items | — | Game tags: mobile-legends, free-fire, pubg-mobile, valorant, etc. |
| `status` | select | ✅ | enum | `akan_datang` | Event status: `akan_datang` (upcoming), `berlangsung` (ongoing), `selesai` (completed), `dibatalkan` (cancelled) |
| `startDate` | date | ✅ | ISO 8601 | — | Event start date/time |
| `endDate` | date | ❌ | ISO 8601, >= startDate | — | Event end date/time (for multi-day events) |
| `location` | group | ✅ | — | — | Location block (see below) |
| `location.city` | select | ✅ | enum | — | City: Semarang, Solo, Kendal, Pati, Lainnya |
| `location.venue` | text | ❌ | max 200 | — | Venue name (e.g., "Kopi Kopak 24") |
| `location.address` | textarea | ❌ | max 500 | — | Full street address |
| `location.mapUrl` | text | ❌ | URL | — | Google Maps / OpenStreetMap link |
| `prizePool` | text | ❌ | max 100 | — | Formatted prize pool (e.g., "IDR 500,000") |
| `description` | richText | ❌ | — | — | Event description (Payload rich text editor) |
| `featuredImage` | upload | ✅ | ref Media | — | Hero image (required, 16:9 aspect ratio) |
| `gallery` | array of upload | ❌ | refs Media, max 50 | — | Event photo gallery |
| `registrationWa` | text | ❌ | E.164 phone format | — | WhatsApp number for registration (e.g., "+6281234567890") |
| `prefilledMessage` | textarea | ❌ | max 500 | auto | Message pre-filled in WhatsApp link |
| `resultsUrl` | text | ❌ | URL | — | Link to results/news article |
| `publishedAt` | date | auto | — | — | Set automatically when status changes to published |

### Indexes

```javascript
db.events.createIndex({ slug: 1 }, { unique: true });
db.events.createIndex({ startDate: -1 });
db.events.createIndex({ status: 1 });
db.events.createIndex({ game: 1 }); // Multikey index
db.events.createIndex({ "location.city": 1, startDate: -1 }); // Compound
```

### Hooks

- `beforeChange`: Auto-generate `slug` from `title` if empty; warn if `startDate < now` but `status === 'akan_datang'`
- `afterChange`: Trigger webhook to Astro rebuild endpoint if `status === 'published'`
- `beforeDelete`: Soft delete (set `deletedAt`); hard delete via cron after 30 days

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | Only published (`akan_datang`, `berlangsung`, `selesai`) |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ✅ (own) | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

---

## Collection: TeamMembers

**Slug**: `team-members`
**Display**: Team grid + profile
**Owner spec**: FR-010..018, US-2

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `name` | text | ✅ | min 2, max 100 | — | Full name |
| `slug` | text | ✅ | unique, kebab-case | auto from name | URL identifier |
| `role` | text | ✅ | max 100 | — | Role title in Indonesian (e.g., "Caster", "Desainer Grafis") |
| `department` | select | ✅ | enum | — | Department: Talent, Produksi, Operasional |
| `shortBio` | textarea | ✅ | max 280 | — | Short bio for team grid card |
| `fullBio` | richText | ❌ | — | — | Full bio for profile page |
| `photo` | upload | ❌ | ref Media, 1:1 aspect recommended | — | Portrait photo |
| `socialLinks` | group | ❌ | — | — | Social media block |
| `socialLinks.instagram` | text | ❌ | URL | — | Instagram profile URL |
| `socialLinks.whatsapp` | text | ❌ | E.164 phone | — | WhatsApp number |
| `socialLinks.youtube` | text | ❌ | URL | — | YouTube channel URL |
| `portfolio` | array of group | ❌ | max 20 | — | Portfolio items |
| `portfolio[].title` | text | ❌ | max 200 | — | Project title |
| `portfolio[].description` | textarea | ❌ | max 500 | — | Project description |
| `portfolio[].url` | text | ❌ | URL | — | External link |
| `portfolio[].image` | upload | ❌ | ref Media | — | Project image |
| `services` | array of relationship | ❌ | refs Services | — | Services this member is assigned to |
| `displayOrder` | number | ✅ | int, min 0 | 0 | Display order within department |
| `active` | checkbox | ✅ | — | true | Active status (false = hidden from public) |

### Indexes

```javascript
db.team_members.createIndex({ slug: 1 }, { unique: true });
db.team_members.createIndex({ department: 1, displayOrder: 1 });
db.team_members.createIndex({ active: 1 });
```

### Hooks

- `beforeChange`: Auto-generate `slug` from `name` if empty
- `afterChange`: Trigger rebuild if `active` toggled

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | Only `active: true` |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

---

## Collection: Services

**Slug**: `services`
**Display**: Services grid + detail
**Owner spec**: FR-010..015, US-2

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `title` | text | ✅ | min 3, max 100 | — | Service title (e.g., "Penyelenggara Turnamen") |
| `slug` | text | ✅ | unique, kebab-case | auto | URL identifier |
| `icon` | text | ❌ | Lucide icon name | — | Icon name (e.g., "Trophy", "Video") |
| `shortDescription` | textarea | ✅ | max 280 | — | Short description for service card |
| `fullDescription` | richText | ❌ | — | — | Full description for service detail page |
| `sampleWork` | array of upload | ❌ | refs Media, max 12 | — | Sample work images/videos |
| `assignedTeam` | array of relationship | ❌ | refs TeamMembers | — | Team members assigned to this service |
| `whatsappContact` | text | ❌ | E.164 phone | — | WhatsApp number for this service inquiry |
| `displayOrder` | number | ✅ | int, min 0 | 0 | Display order on services page |

### Indexes

```javascript
db.services.createIndex({ slug: 1 }, { unique: true });
db.services.createIndex({ displayOrder: 1 });
```

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

---

## Collection: News

**Slug**: `news`
**Display**: News articles
**Owner spec**: FR-030..037, US-4

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `title` | text | ✅ | min 5, max 200 | — | Article title |
| `slug` | text | ✅ | unique, kebab-case | auto | URL identifier |
| `excerpt` | textarea | ✅ | max 200 | — | Article excerpt (shown on news list) |
| `content` | richText | ✅ | — | — | Article body (Payload rich text) |
| `featuredImage` | upload | ✅ | ref Media, 16:9 | — | Hero image |
| `author` | relationship | ✅ | ref TeamMembers | — | Article author |
| `relatedArticles` | array of relationship | ❌ | refs News, max 3 | — | Related articles (manual curation) |
| `status` | select | ✅ | enum | `draft` | Status: draft, published, archived |
| `publishedAt` | date | ❌ | ISO 8601 | — | Publication date (required if status=published) |

### Indexes

```javascript
db.news.createIndex({ slug: 1 }, { unique: true });
db.news.createIndex({ publishedAt: -1, status: 1 });
db.news.createIndex({ author: 1 });
```

### Hooks

- `beforeChange`: Auto-generate `slug` from `title` if empty
- `afterChange`: Trigger rebuild if status changed to `published`

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | Only status=published |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ✅ (own) | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

---

## Collection: Gallery

**Slug**: `gallery`
**Display**: Photo gallery
**Owner spec**: FR-032..034, US-4

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `image` | upload | ✅ | ref Media | — | Photo file |
| `caption` | text | ❌ | max 200 | — | Photo caption |
| `event` | relationship | ❌ | ref Events | — | Associated event |
| `tags` | array of text | ❌ | max 5 tags | — | Free-form tags |
| `uploadDate` | date | auto | — | now | Upload timestamp |

### Indexes

```javascript
db.gallery.createIndex({ uploadDate: -1 });
db.gallery.createIndex({ event: 1 });
db.gallery.createIndex({ tags: 1 }); // Multikey
```

### Hooks

- `afterChange`: Trigger rebuild if new photo added

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ |

---

## Collection: Inquiries

**Slug**: `inquiries`
**Display**: Contact form submissions (admin-only via `/admin`)
**Owner spec**: FR-020..028, US-3

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `name` | text | ✅ | min 2, max 100 | — | Submitter name |
| `email` | email | ❌ | valid email | — | Submitter email (optional) |
| `whatsapp` | text | ✅ | E.164 or local format | — | Submitter WhatsApp |
| `inquiryType` | select | ✅ | enum | — | Type: kemitraan, talent, event-booking, umum |
| `message` | textarea | ✅ | min 20, max 2000 | — | Inquiry message |
| `budgetEstimate` | text | ❌ | max 100 | — | Type-specific (kemitraan only) |
| `talentSpecialty` | text | ❌ | max 100 | — | Type-specific (talent only) |
| `eventType` | text | ❌ | max 100 | — | Type-specific (event-booking only) |
| `status` | select | ✅ | enum | `baru` | Status: baru, dibaca, dibalas, diarsipkan |
| `notes` | textarea | ❌ | max 1000 | — | Admin-only internal notes |
| `submittedAt` | date | auto | — | now | Submission timestamp |
| `ipAddress` | text | ❌ | — | — | Submitter IP (for spam detection, hashed) |
| `userAgent` | text | ❌ | — | — | Submitter user agent |

### Indexes

```javascript
db.inquiries.createIndex({ submittedAt: -1 });
db.inquiries.createIndex({ inquiryType: 1, status: 1 });
db.inquiries.createIndex({ status: 1 });
```

### Hooks

- `afterChange`: If status changes to `dibalas`, trigger email confirmation to submitter (optional, configurable)
- `beforeChange`: Hash IP address (SHA-256) for spam pattern detection without storing raw PII

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | ❌ (none) |
| Create | ✅ | ✅ | ❌ | ❌ (created via Astro API only) |
| Update | ✅ | ✅ (status only) | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

**Special**: Astro `/api/contact` endpoint uses Payload's Local API (server-side) to create inquiries, bypassing HTTP auth.

---

## Collection: Media

**Slug**: `media`
**Display**: File uploads
**Owner spec**: FR-042

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `filename` | text | ✅ | — | auto | Original filename |
| `mimeType` | text | ✅ | enum | — | image/jpeg, image/png, image/webp, image/avif |
| `filesize` | number | ✅ | int, min 1, max 10485760 | — | File size in bytes (max 10MB) |
| `width` | number | ✅ | int, min 1 | — | Image width in pixels |
| `height` | number | ✅ | int, min 1 | — | Image height in pixels |
| `alt` | text | ✅ | max 200 | — | Alt text in Indonesian (for accessibility) |
| `uploadedBy` | relationship | ✅ | ref Users | — | Uploaded by which admin |
| `uploadedAt` | date | auto | — | now | Upload timestamp |
| `sizes` | group | ❌ | — | — | Optimized variants |
| `sizes.original` | text | ✅ | URL | — | Original file URL |
| `sizes.avif` | text | ❌ | URL | — | AVIF variant URL |
| `sizes.webp` | text | ❌ | URL | — | WebP variant URL |

### Indexes

```javascript
db.media.createIndex({ filename: 1 });
db.media.createIndex({ uploadedAt: -1 });
db.media.createIndex({ uploadedBy: 1 });
```

### Hooks

- `beforeChange`: Reject upload if `filesize > 10MB`; auto-generate WebP + AVIF variants via Sharp at 1920w, 1024w, 640w widths
- `beforeChange`: Strip EXIF data (privacy)

### Access Control

| Operation | Admin | Editor | Viewer | Public API |
|---|---|---|---|---|
| Read | ✅ | ✅ | ✅ | ✅ (only files referenced by published content) |
| Create | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

---

## Collection: Users

**Slug**: `users`
**Display**: CMS admin users
**Owner spec**: FR-040, FR-048, US-5

### Fields

| Field | Type | Required | Validation | Default | Description |
|---|---|---|---|---|---|
| `email` | email | ✅ | unique, valid | — | Login email |
| `password` | text (hashed) | ✅ | min 12 | — | Bcrypt hash (never returned in API) |
| `role` | select | ✅ | enum | `viewer` | Role: admin, editor, viewer |
| `displayName` | text | ✅ | max 100 | — | Display name |
| `lastLogin` | date | ❌ | ISO 8601 | — | Last successful login timestamp |
| `createdAt` | date | auto | — | now | Account creation timestamp |

### Indexes

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
```

### Access Control

| Operation | Admin | Editor | Viewer | Self |
|---|---|---|---|---|
| Read | ✅ | Only self | Only self | ✅ |
| Create | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | Only self (displayName only) | Only self (displayName only) | ✅ (own profile) |
| Delete | ✅ (not self) | ❌ | ❌ | ❌ |

### Default Seed Data

| Email | Role | Password |
|---|---|---|
| `admin@rikas.id` | admin | (set via env on first boot) |
| `editor@rikas.id` | editor | (set via env on first boot) |

---

## Field Types Reference (Payload CMS 3)

| Payload Type | MongoDB BSON Type | Notes |
|---|---|---|
| `text` | String | UTF-8 string |
| `textarea` | String | Multi-line text |
| `email` | String | Validated email format |
| `number` | Number (int) or Double | Integer or float |
| `checkbox` | Boolean | true/false |
| `date` | Date | ISO 8601 stored as BSON Date |
| `select` | String | Enum value |
| `array` | Array | Array of objects |
| `group` | Embedded Document | Nested object |
| `relationship` | ObjectId | Reference (single or array) |
| `upload` | ObjectId | Reference to Media |
| `richText` | Object | Lexical editor JSON |

---

## Backup Strategy

### Daily MongoDB Dump

```bash
# scripts/backup.sh (runs via cron daily at 02:00)
docker exec rikas-mongo mongodump \
  --uri="$MONGO_URI" \
  --gzip \
  --archive=/backups/rikas-$(date +%Y%m%d).gz

# Retain last 30 days
find /backups -name "rikas-*.gz" -mtime +30 -delete
```

### Restore Procedure

```bash
docker exec rikas-mongo mongorestore \
  --uri="$MONGO_URI" \
  --gzip \
  --archive=/backups/rikas-20260625.gz \
  --drop
```

### Media Backup

Media files stored in Docker volume. Backup via `tar` to offsite storage (e.g., Backblaze B2).

---

## Migration Strategy (Future)

When schema changes are needed (e.g., new field, renamed field):
1. Create migration script in `apps/cms/src/migrations/`
2. Run on dev environment, verify data integrity
3. Document in `docs/migrations/YYYYMMDD-name.md`
4. Run on production during maintenance window

---

## Performance Considerations

- **Indexes**: All foreign-key-like fields (event references, etc.) indexed for fast joins
- **Pagination**: All list queries paginated (24 events, 24 photos, 12 news per page)
- **Eager Loading**: Use Payload's `depth: 2` to populate relationships in single query
- **Caching**: MongoDB query cache (60s TTL) at Astro build layer to avoid repeated queries during SSG
- **Connection Pooling**: MongoDB driver default maxPoolSize=10 (configurable via env)

---

## Sample Documents

### Sample Event

```json
{
  "_id": "ObjectId('...')",
  "title": "Mobile Legends Championship Season 7",
  "slug": "mlbb-championship-season-7",
  "game": ["mobile-legends"],
  "status": "akan_datang",
  "startDate": "2026-08-15T10:00:00.000Z",
  "endDate": "2026-08-17T22:00:00.000Z",
  "location": {
    "city": "Semarang",
    "venue": "Kopi Kopak 24",
    "address": "Jl. Pahlawan No.123, Semarang",
    "mapUrl": "https://maps.google.com/..."
  },
  "prizePool": "IDR 500,000",
  "description": "...",
  "featuredImage": "ObjectId('...')",
  "gallery": ["ObjectId('...')", "ObjectId('...')"],
  "registrationWa": "+6281234567890",
  "prefilledMessage": "Halo RIKAS, saya ingin mendaftar untuk MLBB Championship Season 7",
  "resultsUrl": null,
  "publishedAt": "2026-06-25T12:00:00.000Z",
  "createdAt": "2026-06-25T12:00:00.000Z",
  "updatedAt": "2026-06-25T12:00:00.000Z"
}
```

### Sample Inquiry

```json
{
  "_id": "ObjectId('...')",
  "name": "Budi Santoso",
  "email": "budi@brand.com",
  "whatsapp": "+6281234567890",
  "inquiryType": "kemitraan",
  "message": "Kami dari Brand X ingin berdiskusi mengenai sponsorship untuk event MLBB berikutnya...",
  "budgetEstimate": "IDR 50,000,000 - 100,000,000",
  "talentSpecialty": null,
  "eventType": null,
  "status": "baru",
  "notes": null,
  "submittedAt": "2026-06-25T14:23:11.000Z",
  "ipAddress": "sha256:abc123...",
  "userAgent": "Mozilla/5.0..."
}
```

---

**Next**: See `contracts/cms-rest-api.md` for REST endpoint definitions, `contracts/form-schema.md` for Zod schemas, `research.md` for tech decision rationale.