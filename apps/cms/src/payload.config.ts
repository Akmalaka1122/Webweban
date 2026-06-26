import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Events } from './collections/Events';
import { TeamMembers } from './collections/TeamMembers';
import { Services } from './collections/Services';
import { News } from './collections/News';
import { Gallery } from './collections/Gallery';
import { Inquiries } from './collections/Inquiries';
import { Media } from './collections/Media';
import { Users } from './collections/Users';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  collections: [
    Events,
    TeamMembers,
    Services,
    News,
    Gallery,
    Inquiries,
    Media,
    Users,
  ],
  editor: lexicalEditor(),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
  }),
  sharp,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | RIKAS CMS',
      description: 'RIKAS Indo Technology Content Management System',
    },
  },
  typescript: {
    outputFile: './payload-types.ts',
  },
});
