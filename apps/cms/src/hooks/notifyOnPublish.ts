import { CollectionAfterChangeHook } from 'payload';

export const notifyOnPublish: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'update' && doc._status === 'published') {
    req.payload.logger.info(`Content published: ${doc.title || doc.id}`);

    // Trigger Astro rebuild webhook
    const rebuildUrl = process.env.REBUILD_WEBHOOK_URL;
    const rebuildSecret = process.env.REBUILD_SECRET;

    if (rebuildUrl) {
      try {
        await fetch(rebuildUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(rebuildSecret ? { 'x-rebuild-secret': rebuildSecret } : {}),
          },
          body: JSON.stringify({
            event: 'publish',
            collection: doc.collection || 'unknown',
            id: doc.id,
            title: doc.title,
            timestamp: new Date().toISOString(),
          }),
        });
        req.payload.logger.info('Rebuild webhook triggered');
      } catch (err) {
        req.payload.logger.error(`Rebuild webhook failed: ${err}`);
      }
    }
  }
};
