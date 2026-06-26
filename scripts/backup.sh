#!/bin/bash
# Daily MongoDB backup script
# Run via cron: 0 2 * * * /path/to/scripts/backup.sh

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="rikas-mongo"

mkdir -p "$BACKUP_DIR"

docker exec "$CONTAINER_NAME" mongodump \
  --username=admin \
  --password="$MONGO_PASSWORD" \
  --authenticationDatabase=admin \
  --archive="/tmp/backup_$DATE.gz" \
  --gzip

docker cp "$CONTAINER_NAME:/tmp/backup_$DATE.gz" "$BACKUP_DIR/"

# Keep last 7 days
find "$BACKUP_DIR" -name "*.gz" -mtime +7 -delete

echo "[$(date)] Backup completed: $BACKUP_DIR/backup_$DATE.gz"
