import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/roles';

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'type', 'status', 'timestamp'],
  },
  access: {
    read: isAdmin,
    create: () => true, // Public form submissions
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'whatsapp',
      type: 'text',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Partnership', value: 'partnership' },
        { label: 'Talent', value: 'talent' },
        { label: 'Event', value: 'event' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
};
