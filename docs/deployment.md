# Deployment Guide — RIKAS Website

## Prerequisites
- VPS with 2GB+ RAM, 20GB+ disk
- Docker & Docker Compose installed
- Domain DNS pointed to VPS IP

## Quick Deploy

```bash
# 1. Clone repo
git clone <repo-url> /opt/rikas-website
cd /opt/rikas-website/docker

# 2. Create .env
cp ../.env.example .env
# Edit .env with real values

# 3. Build & start
docker compose -f docker-compose.prod.yml up -d --build

# 4. Seed initial data
docker compose -f docker-compose.prod.yml exec cms npx tsx /app/scripts/seed.ts

# 5. Verify
curl https://rikas.id/health
curl https://rikas.id/admin
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| MONGODB_URI | Yes | MongoDB connection string |
| PAYLOAD_SECRET | Yes | JWT secret for CMS (random 32+ chars) |
| MONGO_USERNAME | Yes | MongoDB root username |
| MONGO_PASSWORD | Yes | MongoDB root password |
| SITE_URL | Yes | Public site URL (https://rikas.id) |
| REBUILD_SECRET | No | Webhook secret for auto-rebuild |

## Backup

```bash
# Manual backup
docker exec rikas-mongo-1 mongodump --archive > backup-$(date +%Y%m%d).gz

# Automated (runs daily at 02:00 via cron)
bash scripts/backup.sh
```

## SSL / HTTPS

Caddy handles SSL automatically via Let's Encrypt. No manual cert setup needed.

## Troubleshooting

**MongoDB out of memory**: Edit `mongod.conf` cache limit (default 512MB).
**CMS not starting**: Check `docker compose logs cms` — usually MONGODB_URI or PAYLOAD_SECRET wrong.
**Site not loading**: Check `docker compose logs caddy` — DNS may not be propagated yet.
