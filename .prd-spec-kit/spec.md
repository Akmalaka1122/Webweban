# RIKAS INDO TECHNOLOGY — Website Spec

## Brand
- Nama: RIKAS INDO TECHNOLOGY
- Instagram: @rikas.idn
- Lokasi: Semarang, Solo, Kendal, Pati (Jawa Tengah)
- Vertikal: Event Organizer (Esports & Komunitas)

## Design Reference: NAVI.gg
- Dark theme (navy base, bukan hitam)
- Bold large typography
- Clean grid layout
- Glassmorphism cards
- Smooth scroll animations
- Professional esports aesthetic

## Color Palette
- Primary: #1b2a51 (navy brand)
- Background dark: #0f1a36
- Card bg: rgba(27, 42, 81, 0.6) / glassmorphism
- Text primary: #ffffff
- Text secondary: #b0b8cc
- Border/divide: rgba(255,255,255,0.08)

## Sections (single page)
1. Hero — full viewport, large "RIKAS" title + tagline
2. About — company profile, lokasi, year established
3. Services — 4 cards: Event Esports, Talent (Caster/MC/Cosplay), Design & Video, Live Streaming
4. Events — portfolio grid of past events with images
5. Sponsors — partner logo bar
6. Contact — WhatsApp deep link + Instagram + Email

## Tech Stack
- Static HTML/CSS/JS (vanilla, zero framework)
- Font: Inter (Google Fonts)
- Animations: CSS keyframes + Intersection Observer for scroll
- Icons: Font Awesome
- Deployment: Docker + Caddy (VPS)

## File Structure
```
rikas-website/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── logo.png
│   └── logo-icon.svg
├── Dockerfile
├── Caddyfile
├── docker-compose.yml
├── .gitignore
└── README.md
```