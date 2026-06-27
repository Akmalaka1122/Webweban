# Technical Plan — RIKAS Website

## Stack
| Layer | Choice | Rationale |
|---|---|---|
| Frontend | HTML/CSS/JS vanilla | User requested static, zero deps |
| Font | Inter (sans-serif) | Clean, modern, NAVI-appropriate |
| Animations | CSS + Intersection Observer | Smooth scroll reveals, no heavy libs |
| Icons | Font Awesome 6 | Clean icon set |
| Deployment | Docker + Caddy | VPS pattern (user's preference) |
| HTTPS | Auto via Caddy | Let's Encrypt automatic |

## Design System
### CSS Variables
```css
--color-primary: #1b2a51;
--color-bg: #0f1a36;
--color-bg-alt: #141e3a;
--color-card: rgba(27, 42, 81, 0.6);
--color-glass: rgba(255, 255, 255, 0.05);
--color-text: #ffffff;
--color-text-muted: #b0b8cc;
--color-border: rgba(255, 255, 255, 0.08);
--font-sans: 'Inter', sans-serif;
--radius: 16px;
--shadow: 0 8px 32px rgba(0,0,0,0.3);
```

### NAVI.gg design elements to replicate
- Glassmorphism navigation (fixed, transparent with blur)
- Large hero typography (clamp font sizes)
- Gradient text on headings (subtle white-to-light-blue)
- Card-based sections with hover lift effect
- Smooth page transitions
- Grid layout for portfolio/events
- Professional spacing (8px grid)

## Sections Detail
### Hero
- Full viewport height
- Background: radial gradient navy-to-dark
- Large title: "RIKAS" in bold, with subtle gradient
- Tagline: "INDO TECHNOLOGY" below
- Sub-text: "Event & Komunitas Esports Jawa Tengah"
- CTA buttons: "Hubungi Kami" (WA link) + "Lihat Portofolio" (scroll)

### About
- Company deskripsi singkat
- Layanan coverage: Semarang, Solo, Kendal, Pati
- Stats row: events held, years active, partners count

### Services (4 Cards)
1. Event Esports — Tournament organizer
2. Talent — Caster, MC, Cosplay
3. Design & Video — Desainer, Videografer
4. Live Streaming — Jasa streaming event

### Events Portfolio
- Grid 2-3 columns of past events
- Event name + photo + date + game type
- Hover overlay with info

### Sponsors
- Horizontal scroll/row of partner logos
- VIVO, OPPO, DEWA, VIO

### Contact
- WhatsApp langsung: wa.me/... with pre-filled text
- Instagram: @rikas.idn
- Email
- Footer with copyright

## Quickstart
```bash
docker compose up -d
# Opens at http://localhost:8080
# With Caddy: https://rikas.id (after DNS + Caddy config)
```

## Constitution Check
- ✅ **I. Mobile-First**: CSS Grid + clamp() responsive design
- ✅ **II. Content-Authenticity**: All content managed via Payload CMS — no fabricated events/team/services
- ✅ **III. Bilingual-Ready (Indonesian-First, English-Ready)**: Indonesian content default, i18n structure in `apps/web/src/lib/i18n.ts`
- ✅ **IV. Performance Budget**: Static Astro frontend, minimal client JS, Lighthouse ≥ 90 target
- ✅ **V. Security & Privacy**: CMS admin access controlled, honeypot on public forms, no third-party analytics
- ✅ **VI. Self-Hosted First**: Docker Compose + Caddy on VPS, MongoDB containerized
- ✅ **VII. Visual Hierarchy Mirrors TeamLiquid.com**: Card-based sections, glassmorphism nav, large hero typography