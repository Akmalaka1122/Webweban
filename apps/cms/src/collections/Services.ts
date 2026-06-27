import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon'],
  },
  access: {
    read: () => true,
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon name or SVG path',
      },
    },
    {
      name: 'whatsapp_contact',
      type: 'text',
      admin: {
        description: 'WhatsApp number for booking inquiries (format: wa.me/628...)',
      },
    },
    {
      name: 'assigned_team',
      type: 'array',
      fields: [
        {
          name: 'member',
          type: 'relationship',
          relationTo: 'team-members',
          required: true,
        },
      ],
    },
  ],
};
