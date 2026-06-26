import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt_text',
    defaultColumns: ['alt_text', 'filename', 'filesize'],
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt_text',
      type: 'text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
    {
      name: 'sizes',
      type: 'group',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'thumbnail',
          type: 'group',
          fields: [
            { name: 'url', type: 'text' },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
        {
          name: 'card',
          type: 'group',
          fields: [
            { name: 'url', type: 'text' },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
        {
          name: 'hero',
          type: 'group',
          fields: [
            { name: 'url', type: 'text' },
            { name: 'width', type: 'number' },
            { name: 'height', type: 'number' },
          ],
        },
      ],
    },
  ],
};
