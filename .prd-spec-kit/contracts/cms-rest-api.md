# CMS REST API Contracts — RIKAS EO Website

> **REST endpoints exposed by Payload CMS 3** for Astro frontend data fetching. All endpoints follow Payload's auto-generated REST conventions at `/api/{collection}`.

**Base URL**: `https://rikas.id/api` (production) / `http://localhost:3001/api` (dev)
**Adapter**: `@payloadcms/db-mongodb` + `@payloadcms/next`
**Auth**: Public read-only endpoints; admin endpoints require JWT (Payload's built-in)

---

## Common Conventions

### Response Format

All responses are JSON. Standard envelope:

```typescript
// Success: single document
{
  "doc": { ... },
  "meta": {} // Empty for single docs
}

// Success: list with pagination
{
  "docs": [ ... ],
  "totalDocs": 123,
  "limit": 24,
  "page": 1,
  "totalPages": 6,
  "hasNextPage": true,
  "hasPrevPage": false,
  "nextPage": 2,
  "prevPage": null
}

// Error
{
  "errors": [
    {
      "message": "Required",
      "field": "title"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Used For |
|---|---|---|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Document doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side errors |

### Query Parameters (Common)

| Param | Type | Description |
|---|---|---|
| `where[field][operator]` | varies | Filter condition (Payload's query syntax) |
| `limit` | number | Max results per page (default: 10, max: 100) |
| `page` | number | Page number (1-indexed) |
| `sort` | string | Sort field(s), e.g., `-startDate` (desc) |
| `depth` | number | Relationship populate depth (default: 0, max: 2) |
| `draft` | boolean | Include drafts (requires auth, default: false) |

### Example Query

```http
GET /api/events?where[status][in]=akan_datang,berlangsung&sort=-startDate&limit=24&depth=2
```

---

## Collection Endpoints

### Events

#### `GET /api/events` — List events

Public. Filtered by access control (only published events returned to public).

**Query params**:
- `where[status][in]` — comma-separated: `akan_datang,berlangsung,selesai`
- `where[game][contains]` — filter by game tag (e.g., `mobile-legends`)
- `sort` — default `-startDate`
- `limit` — default 24, max 100
- `page` — default 1

**Response** (truncated):
```json
{
  "docs": [
    {
      "id": "6640abc...",
      "title": "Mobile Legends Championship Season 7",
      "slug": "mlbb-championship-season-7",
      "game": ["mobile-legends"],
      "status": "akan_datang",
      "startDate": "2026-08-15T10:00:00.000Z",
      "location": { "city": "Semarang", "venue": "Kopi Kopak 24" },
      "prizePool": "IDR 500,000",
      "featuredImage": { "id": "...", "url": "/media/mlbb-s7-hero.webp", "alt": "...", "sizes": {...} },
      "publishedAt": "2026-06-25T12:00:00.000Z"
    }
  ],
  "totalDocs": 15,
  "limit": 24,
  "page": 1,
  "totalPages": 1,
  "hasNextPage": false
}
```

#### `GET /api/events/:slug` — Get event by slug

Uses Payload's `where[slug][equals]` query internally.

**Response**:
```json
{
  "doc": {
    "id": "6640abc...",
    "title": "Mobile Legends Championship Season 7",
    "slug": "mlbb-championship-season-7",
    "game": ["mobile-legends"],
    "status": "akan_datang",
    "startDate": "2026-08-15T10:00:00.000Z",
    "endDate": "2026-08-17T22:00:00.000Z",
    "location": {
      "city": "Semarang",
      "venue": "Kopi Kopak 24",
      "address": "Jl. Pahlawan No.123",
      "mapUrl": "https://maps.google.com/..."
    },
    "prizePool": "IDR 500,000",
    "description": { ... }, // Lexical rich text JSON
    "featuredImage": { "id": "...", "url": "...", "sizes": {...} },
    "gallery": [
      { "id": "...", "url": "/media/event1-1.webp", "alt": "...", "caption": "..." },
      { "id": "...", "url": "/media/event1-2.webp", "alt": "..." }
    ],
    "registrationWa": "+628****7890",
    "prefilledMessage": "Halo RIKAS, saya ingin mendaftar untuk MLBB Championship Season 7",
    "resultsUrl": null,
    "publishedAt": "2026-06-25T12:00:00.000Z"
  }
}
```

#### `POST /api/events` — Create event

Requires Editor or Admin role + JWT.

**Request body**:
```json
{
  "title": "Free Fire Tournament Juli 2026",
  "slug": "ff-tournament-juli-2026",
  "game": ["free-fire"],
  "status": "akan_datang",
  "startDate": "2026-07-20T10:00:00.000Z",
  "location": {
    "city": "Solo",
    "venue": "GOR Solo Baru"
  },
  "prizePool": "IDR 1,000,000",
  "featuredImage": "6640def...",
  "registrationWa": "+628****7890"
}
```

**Response**: `201 Created` with full document.

#### `PATCH /api/events/:id` — Update event

Requires Editor (own) or Admin role.

#### `DELETE /api/events/:id` — Delete event

Requires Admin role. Soft delete by default.

---

### Team Members

#### `GET /api/team-members` — List team members

**Query params**:
- `where[department][equals]` — Talent, Produksi, Operasional
- `where[active][equals]` — true
- `sort` — default `displayOrder`
- `depth=2` — populate `services` references

**Response**:
```json
{
  "docs": [
    {
      "id": "6640...",
      "name": "Rendhy Saputra",
      "slug": "rendhy-saputra",
      "role": "Caster",
      "department": "Talent",
      "shortBio": "Caster esports dengan pengalaman 5+ tahun...",
      "photo": { "id": "...", "url": "/media/rendhy.webp", "alt": "Foto Rendhy" },
      "socialLinks": {
        "instagram": "https://instagram.com/rendhysam.art",
        "youtube": "https://youtube.com/@rendhysam"
      },
      "services": [
        { "id": "...", "title": "Caster & MC", "slug": "caster-mc" }
      ],
      "displayOrder": 1,
      "active": true
    }
  ]
}
```

#### `GET /api/team-members/:slug` — Get team member by slug

---

### Services

#### `GET /api/services` — List services

**Response**:
```json
{
  "docs": [
    {
      "id": "6640...",
      "title": "Penyelenggara Turnamen",
      "slug": "penyelenggara-turnamen",
      "icon": "Trophy",
      "shortDescription": "Mengelola turnamen esports end-to-end dari planning hingga颁奖.",
      "sampleWork": [
        { "id": "...", "url": "/media/sample-1.webp", "alt": "..." }
      ],
      "assignedTeam": [
        { "id": "...", "name": "...", "slug": "...", "photo": {...} }
      ],
      "displayOrder": 1
    }
  ]
}
```

#### `GET /api/services/:slug` — Get service by slug

---

### News

#### `GET /api/news` — List articles

**Query params**:
- `where[status][equals]` — published (default)
- `sort` — default `-publishedAt`
- `limit` — default 12

**Response**:
```json
{
  "docs": [
    {
      "id": "6640...",
      "title": "Hasil MLBB Championship Season 6",
      "slug": "hasil-mlbb-championship-season-6",
      "excerpt": "Tim XX dari YY berhasil mengalahkan tim ZZ di grand final...",
      "featuredImage": { "id": "...", "url": "...", "alt": "..." },
      "author": {
        "id": "...",
        "name": "Rendhy Saputra",
        "slug": "rendhy-saputra"
      },
      "publishedAt": "2026-06-20T10:00:00.000Z"
    }
  ]
}
```

#### `GET /api/news/:slug` — Get article by slug

Returns full `content` rich text.

---

### Gallery

#### `GET /api/gallery` — List photos

**Query params**:
- `where[event][equals]` — filter by event ID
- `where[tags][in]` — filter by tags (comma-separated)
- `sort` — default `-uploadDate`
- `limit` — default 24
- `page` — default 1

**Response**:
```json
{
  "docs": [
    {
      "id": "6640...",
      "image": {
        "id": "...",
        "url": "/media/gallery-1.webp",
        "alt": "Tim MLBB berfoto setelah颁奖",
        "width": 1920,
        "height": 1280
      },
      "caption": "Tim MLBB berfoto setelah颁奖",
      "event": {
        "id": "...",
        "title": "MLBB Championship Season 6",
        "slug": "mlbb-championship-season-6"
      },
      "tags": ["award", "mlbb"],
      "uploadDate": "2026-06-20T15:00:00.000Z"
    }
  ],
  "totalDocs": 145,
  "limit": 24,
  "totalPages": 7
}
```

---

### Inquiries

> **Internal only.** No public API. Created via Astro `/api/contact` endpoint using Payload's Local API.

#### `POST /api/inquiries` (Internal — Astro only)

Created server-side via `payload.create()` from Astro `/api/contact` endpoint. Not exposed to public HTTP for security.

#### `GET /api/inquiries` (Admin only)

Requires Admin/Editor role. Lists submissions.

**Query params**:
- `where[status][equals]` — baru, dibaca, dibalas, diarsipkan
- `where[inquiryType][equals]` — kemitraan, talent, event-booking, umum
- `where[submittedAt][greater_than]` — date range filter

---

### Media

#### `POST /api/media` — Upload file

Requires Editor or Admin role. Multipart form data.

**Constraints**:
- Max file size: 10MB
- Accepted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`

**Processing pipeline**:
1. Receive upload
2. Validate MIME type and size
3. Strip EXIF data
4. Generate WebP variant (1920w, 1024w, 640w)
5. Generate AVIF variant (1920w, 1024w, 640w)
6. Save all variants + original
7. Return media document with all URLs

**Response**:
```json
{
  "doc": {
    "id": "6640...",
    "filename": "mlbb-s7-hero.jpg",
    "mimeType": "image/jpeg",
    "filesize": 245678,
    "width": 2400,
    "height": 1600,
    "alt": "Hero image MLBB Championship Season 7",
    "sizes": {
      "original": { "url": "/media/mlbb-s7-hero.jpg", "filesize": 245678 },
      "webp": [
        { "url": "/media/mlbb-s7-hero-1920w.webp", "filesize": 145000, "width": 1920 },
        { "url": "/media/mlbb-s7-hero-1024w.webp", "filesize": 78000, "width": 1024 },
        { "url": "/media/mlbb-s7-hero-640w.webp", "filesize": 42000, "width": 640 }
      ],
      "avif": [
        { "url": "/media/mlbb-s7-hero-1920w.avif", "filesize": 95000, "width": 1920 },
        { "url": "/media/mlbb-s7-hero-1024w.avif", "filesize": 52000, "width": 1024 },
        { "url": "/media/mlbb-s7-hero-640w.avif", "filesize": 28000, "width": 640 }
      ]
    }
  }
}
```

---

## Astro Internal Endpoints

### `POST /api/contact` — Submit inquiry form

Public endpoint. Rate-limited (5/IP/min). Honeypot field validation.

**Request** (application/json or form data):
```json
{
  "name": "Budi Santoso",
  "whatsapp": "+628****7890",
  "email": "budi@brand.com",
  "inquiryType": "kemitraan",
  "message": "Kami dari Brand X ingin berdiskusi mengenai sponsorship...",
  "budgetEstimate": "IDR 50,000,000 - 100,000,000",
  "talentSpecialty": null,
  "eventType": null,
  "website": "" // honeypot, must be empty
}
```

**Validation** (Zod schema — see `form-schema.md`):
- `name`: required, 2-100 chars
- `whatsapp`: required, valid Indonesian phone format
- `email`: optional, valid email
- `inquiryType`: required, enum
- `message`: required, 20-2000 chars
- `website`: must be empty (honeypot)

**Response** (200 OK):
```json
{
  "success": true,
  "inquiryId": "6640...",
  "message": "Terima kasih! Tim kami akan menghubungi Anda dalam 1-2 hari kerja."
}
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Validasi gagal",
  "fields": [
    { "field": "name", "message": "Nama lengkap wajib diisi" }
  ]
}
```

**Response** (429 Too Many Requests):
```json
{
  "success": false,
  "error": "Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit."
}
```

**Side effects**:
1. Store inquiry in MongoDB via `payload.create({ collection: 'inquiries', data: {...} })`
2. Send email to admin via Nodemailer SMTP
3. Log submission to audit log

---

### `GET /api/health` — Healthcheck

Public endpoint. Returns 200 OK if app is healthy.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-06-25T14:23:11.000Z",
  "services": {
    "mongo": "up",
    "cms": "up",
    "smtp": "up"
  },
  "version": "1.0.0",
  "uptime": 86400
}
```

**Response** (503 Service Unavailable):
```json
{
  "status": "degraded",
  "timestamp": "2026-06-25T14:23:11.000Z",
  "services": {
    "mongo": "down",
    "cms": "up",
    "smtp": "up"
  }
}
```

---

### `POST /api/rebuild` — Webhook from Payload

Called by Payload's `afterChange` hook when content is published.

**Authentication**: Shared secret in header (`X-Rebuild-Token: <env_value>`)

**Request**:
```json
{
  "collection": "events",
  "operation": "update",
  "doc": { "id": "...", "slug": "...", "status": "published" }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "rebuildStarted": true,
  "estimatedDuration": 30
}
```

**Error** (401 Unauthorized if token missing):
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**Side effects**:
1. Trigger Astro build (`astro build`)
2. Reload running site with new content
3. Log rebuild trigger

---

## Error Codes Reference

| HTTP Code | Error Type | Client Action |
|---|---|---|
| 400 | Validation Error | Show field-level errors to user |
| 401 | Unauthorized | Redirect to login (admin) or show "please log in" |
| 403 | Forbidden | Show "permission denied" message |
| 404 | Not Found | Show 404 page with nav back to home |
| 429 | Rate Limited | Show "terlalu banyak percobaan" message |
| 500 | Server Error | Show generic error, log to monitoring |
| 503 | Service Unavailable | Show "site sedang maintenance" message |

---

## Rate Limiting

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/contact` | 5 requests | 1 minute per IP |
| `POST /api/rebuild` | 1 request | 30 seconds per IP (deduplication) |
| `POST /api/media` (admin) | 50 requests | 1 hour per user |
| Admin login attempts | 5 attempts | 15 minutes per IP |

Rate limiting implemented via Astro middleware using Redis-like in-memory store (for single VPS, simple `Map` with TTL is sufficient).

---

## Versioning Strategy

- **API version is implicit** via URL prefix `/api/`
- **Breaking changes** require `/api/v2/` prefix
- **Additive changes** (new fields, new endpoints) deploy to existing `/api/`

---

**Next**: See `form-schema.md` for Zod validation schemas, `data-model.md` for MongoDB schema.