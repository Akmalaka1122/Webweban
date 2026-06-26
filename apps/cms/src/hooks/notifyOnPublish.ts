import { CollectionAfterChangeHook } from 'payload';

export const notifyOnPublish: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'update' && doc._status === 'published') {
    req.payload.logger.info(`Content published: ${doc.title || doc.id}`);
  }
};
