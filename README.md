# RIKAS Website

**RIKAS INDO TECHNOLOGY** — corporate website.

Design inspiration: Team Liquid (clean, modern, navy-and-white esports aesthetic).

## How to Run

### With Docker Compose (recommended)

```bash
docker compose up --build -d
```

This starts:
- **app** — nginx-alpine serving the static site on port `8080`
- **caddy** — reverse proxy with automatic HTTPS on ports `80` and `443`

### Standalone with nginx

```bash
docker build -t rikas-site .
docker run -p 8080:80 rikas-site
```

Then visit http://localhost:8080.