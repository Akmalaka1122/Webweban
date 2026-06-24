# RIKAS Indo Technology — Event Organizer Website

> **Self-hosted, content-managed marketing website for RIKAS Indo Technology.** Built with Astro 5 + Payload CMS 3 + MongoDB + Docker. Dark theme inspired by TeamLiquid.com. Indonesian language. Privacy-first. No third-party tracking.

**Status**: 📋 Spec & Plan phase (PRD, Spec, Plan, Tasks complete; awaiting audit + approval)
**Spec Kit**: `.prd-spec-kit/`
**Live Site**: TBD
**Last Updated**: 2026-06-25

---

## 🎯 What Is This?

RIKAS Indo Technology is an Event Organizer (EO) and esports community builder based in Central Java, Indonesia (Semarang, Solo, Kendal, Pati). They run Mobile Legends, Free Fire, PUBG, and Valorant tournaments, manage a talent roster (Casters, MCs, Cosplayers, Designers, Videographers), and offer live streaming services.

This website is their **owned digital presence** — complementing their established Instagram (`@rikas.idn`) with a content-managed, search-indexed, partner-ready marketing site.

## 📚 Project Documents

All planning artifacts live in `.prd-spec-kit/`:

| Document | Purpose | Audience |
|---|---|---|
| [constitution.md](.prd-spec-kit/constitution.md) | Project principles, tech stack constraints, governance | Everyone |
| [prd.md](.prd-spec-kit/prd.md) | Business case: problem, goal, users, success metrics | Stakeholders, PM |
| [spec.md](.prd-spec-kit/spec.md) | Product spec: user stories, functional + non-functional requirements | Engineers, PM |
| [checklist.md](.prd-spec-kit/checklist.md) | Quality validation: 83 requirement quality checks | Engineers, QA |
| [plan.md](.prd-spec-kit/plan.md) | Technical plan: architecture, stack, data model, contracts | Engineers |
| [data-model.md](.prd-spec-kit/data-model.md) | MongoDB schema, indexes, relationships, hooks | Engineers |
| [contracts/cms-rest-api.md](.prd-spec-kit/contracts/cms-rest-api.md) | Payload REST API endpoints | Engineers |
| [contracts/form-schema.md](.prd-spec-kit/contracts/form-schema.md) | Zod validation schemas | Engineers |
| [research.md](.prd-spec-kit/research.md) | Tech decision rationale (why Payload, why Astro, etc.) | Engineers |
| [tasks.md](.prd-spec-kit/tasks.md) | 140 ordered, file-pathed tasks for execution | Engineers, AI agents |
| [audit-ecc-report.md](.prd-spec-kit/audit-ecc-report.md) | Cross-artifact consistency audit | QA, PM |

## 🛠 Tech Stack (Quick Reference)

- **Frontend**: Astro 5 + React 19 islands
- **Styling**: Tailwind CSS 4 (mobile-first)
- **CMS**: Payload CMS 3 (TypeScript-native, self-hosted)
- **Database**: MongoDB 7 (single-node, 512MB cap)
- **Reverse Proxy**: Caddy 2 (auto-HTTPS)
- **Containerization**: Docker Compose
- **Image Processing**: Sharp (AVIF + WebP + JPEG)
- **Validation**: Zod 3
- **Testing**: Vitest + Playwright + axe-core
- **Monorepo**: pnpm 9 workspaces

## 🎨 Brand

- **Logo**: Navy pill shape, white hand-drawn text "RIKAS INDO TECHNOLOGY"
  - See: `assets/rikas-logo-original.jpg`
- **Primary Color**: `#1b2a51` (extracted from logo)
- **Theme**: Dark by default (per TeamLiquid.com reference)
- **Language**: Indonesian (Bahasa Indonesia) — all user-facing content

## 📁 Repository Structure

```
rikas-website/
├── .prd-spec-kit/           # All planning artifacts (spec-driven development)
├── assets/                   # Brand assets (logo, mockups)
├── apps/
│   ├── web/                  # Astro 5 frontend
│   └── cms/                  # Payload CMS 3 server
├── packages/
│   └── shared/               # Shared TS types + Zod schemas
├── docker/                   # Dockerfile, docker-compose, Caddyfile, mongo config
├── scripts/                  # Seed, backup, lighthouse audit
├── docs/                     # Deployment, maintenance, troubleshooting guides
└── README.md                 # This file
```

## 🚀 Quickstart (After Implementation)

```bash
# Clone
git clone https://github.com/rikasindotech/website.git
cd website

# Setup
pnpm install
cp .env.example .env
# Edit .env with your values

# Start full stack
docker compose up -d

# Visit
open http://localhost:3000        # Public site
open http://localhost:3000/admin   # Payload CMS admin

# Seed initial data
pnpm seed
```

## 📊 Success Metrics

| Metric | Target | Timeframe |
|---|---|---|
| Organic search traffic | 50+ visits/month | 90 days post-launch |
| Inquiry form submissions | 10+ qualified | First quarter |
| Partnership inquiries | 3+ brand inquiries | First quarter |
| Lighthouse mobile score | ≥ 90 | Continuous |
| LCP on 4G | < 2.5s | Continuous |
| Uptime | 99.5%+ | Monthly |

## 🔒 Privacy & Compliance

- **No third-party tracking** (Meta Pixel, Google Analytics disabled)
- **No visitor accounts** (marketing site only)
- **No cookies** (privacy-first analytics via server logs)
- **GDPR-style data minimalism** — only collect what's needed for inquiries
- **HTTPS-only** via Caddy + Let's Encrypt
- **Self-hosted** — all data under RIKAS control

## 📜 License

TBD (private project)

## 📞 Contact

- **Instagram**: [@rikas.idn](https://instagram.com/rikas.idn)
- **WhatsApp Business**: TBD
- **Admin Email**: TBD
- **Location**: Semarang, Solo, Kendal, Pati (Jawa Tengah, Indonesia)

---

## 🤖 For AI Agents / LLMs

If you're an AI agent picking up this project:

1. **Start with**: `.prd-spec-kit/constitution.md` (project principles)
2. **Then read**: `.prd-spec-kit/spec.md` (what to build)
3. **Then plan**: `.prd-spec-kit/plan.md` (how to build)
4. **Then execute**: `.prd-spec-kit/tasks.md` (ordered tasks)
5. **Validate**: `.prd-spec-kit/checklist.md` (83 quality checks)
6. **Audit**: `.prd-spec-kit/audit-ecc-report.md` (cross-artifact consistency)

All decisions are documented with rationale. Follow the order, respect the constraints (especially mobile-first, Indonesian-only, self-hosted, no third-party tracking), and check the brand assets in `assets/` before designing UI.

---

**Built with 🛠 by RIKAS Indo Technology + Hermes Agent**