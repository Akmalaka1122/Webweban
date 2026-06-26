import type { CollectionConfig } from 'payload';
import { notifyOnPublish } from '../hooks/notifyOnPublish';

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'published_at'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [notifyOnPublish],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'team-members',
    },
    {
      name: 'published_at',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'text',
      admin: {
        description: 'Short summary for news cards',
      },
    },
  ],
};
