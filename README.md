# RIKAS INDO TECHNOLOGY — Website

> Official website for RIKAS INDO TECHNOLOGY, an Event Organizer (Esports & Community) in Central Java, Indonesia.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Astro 5.x + React 19 islands |
| CMS | Payload CMS 3.x |
| Database | MongoDB 7.x |
| Styling | Tailwind CSS 4.x |
| Containerization | Docker Compose |
| Reverse Proxy | Caddy 2.x |
| Monorepo | pnpm 9 workspaces |

## Quickstart

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9
- Docker & Docker Compose

### Development
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
# → Astro: http://localhost:3000
# → Payload: http://localhost:3001/admin
```

### Production (Docker)
```bash
cd docker
docker compose up -d
# → https://rikas.id (after DNS config)
```

## Project Structure

```
rikas-website/
├── apps/
│   ├── web/          # Astro frontend
│   └── cms/          # Payload CMS
├── packages/
│   └── shared/       # Shared types & schemas
├── docker/           # Docker configs
├── scripts/          # Build & deploy scripts
└── .prd-spec-kit/    # PRD, spec, plan, tasks
```

## Documentation

- [PRD](.prd-spec-kit/prd.md)
- [Product Spec](.prd-spec-kit/spec.md)
- [Technical Plan](.prd-spec-kit/plan.md)
- [Task Breakdown](.prd-spec-kit/tasks.md)
- [Constitution](constitution.md)

## License

Private — RIKAS INDO TECHNOLOGY
