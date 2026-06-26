# Maintenance Guide — RIKAS Website

## Updating Content

1. Login to CMS at `https://rikas.id/admin`
2. Use your admin/editor credentials
3. Create/edit content → Save → Publish
4. Site auto-rebuilds on publish (if webhook configured)

## Content Types

| Collection | URL | Description |
|---|---|---|
| Events | /event | Turnamen dan event |
| Services | /layanan | Layanan RIKAS |
| Team Members | /tim | Anggota tim |
| News | /berita | Artikel berita |
| Gallery | /galeri | Foto event |
| Inquiries | (admin only) | Pesan masuk |

## Adding Images

1. Go to Media collection in CMS
2. Upload image (max 10MB)
3. Add alt text in Indonesian
4. System auto-generates thumbnail, card, hero sizes

## Checking Inquiries

1. Go to Inquiries in CMS
2. Filter by status: New / Read / Replied
3. Mark as "Read" after reviewing
4. Mark as "Replied" after responding via WhatsApp/email

## Backup Schedule

Daily backup at 02:00 WIB via cron. Backups stored in `/opt/backups/rikas/`.
Retention: 7 days local, copy to external storage monthly.

## Common Tasks

**Add new event**: CMS → Events → Create New → Fill fields → Publish
**Update team**: CMS → Team Members → Edit → Save
**Change contact info**: Edit Footer component (dev) or CMS settings
