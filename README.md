# RIKAS INDO TECHNOLOGY

Official company website for **RIKAS INDO TECHNOLOGY**.

## Tech Stack

- **Frontend:** Static HTML/CSS/JS (Nginx served)
- **Reverse Proxy:** Caddy (auto HTTPS)
- **Containerization:** Docker & Docker Compose
- **Design Reference:** NAVI.gg (clean, modern esports-inspired aesthetic)

## How to Run

```bash
docker compose up -d
```

This starts two services:
- **app** — Nginx container serving the static site on port `8080`
- **caddy** — Caddy reverse proxy on ports `80` (HTTP) and `443` (HTTPS) with automatic TLS

For local development without Caddy, access the site directly at `http://localhost:8080`.

## Project Structure

```
rikas-website/
├── assets/           # Static assets (images, icons)
├── index.html        # Main entry point
├── styles/           # CSS files
├── ...
├── Dockerfile        # Nginx container definition
├── Caddyfile         # Caddy reverse proxy configuration
├── docker-compose.yml
└── README.md
```

## Brand

**RIKAS INDO TECHNOLOGY** — delivering innovative technology solutions with a modern, clean design ethos.

## Design Reference

Design language inspired by [NAVI.gg](https://navi.gg) — crisp layout, bold typography, and a dark/navy color palette.