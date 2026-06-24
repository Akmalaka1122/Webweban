# Form Validation Schemas — RIKAS EO Website

> **Zod schemas** for client-side and server-side validation of forms (contact form, inquiry submissions, admin inputs). Single source of truth — used by both Astro forms and Payload hooks.

**Library**: Zod 3.x
**Indonesian error messages**: All validation messages in Bahasa Indonesia
**Version**: 1.0.0

---

## Contact Form Schema

### Main Schema

```typescript
import { z } from 'zod';

// Indonesian phone regex: accepts +62, 62, or 0 prefix followed by 8+
const indonesianPhoneRegex = /^(\+62|62|0)8\d{8,11}$/;

// Honeypot field name — must remain empty
const honeypotSchema = z.string().max(0, { message: 'Spam terdeteksi' });

export const InquiryTypeEnum = z.enum(
  ['kemitraan', 'talent', 'event-booking', 'umum'],
  { errorMap: () => ({ message: 'Pilih jenis inquiry yang valid' }) }
);

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Nama lengkap minimal 2 karakter' })
    .max(100, { message: 'Nama lengkap maksimal 100 karakter' })
    .trim(),

  whatsapp: z
    .string()
    .regex(indonesianPhoneRegex, {
      message: 'Format WhatsApp tidak valid (contoh: 081234567890)',
    })
    .trim(),

  email: z
    .string()
    .email({ message: 'Format email tidak valid' })
    .max(200, { message: 'Email maksimal 200 karakter' })
    .trim()
    .optional()
    .or(z.literal('')),

  inquiryType: InquiryTypeEnum,

  message: z
    .string()
    .min(20, { message: 'Pesan minimal 20 karakter' })
    .max(2000, { message: 'Pesan maksimal 2000 karakter' })
    .trim(),

  // Type-specific optional fields
  budgetEstimate: z
    .string()
    .max(100, { message: 'Perkiraan budget maksimal 100 karakter' })
    .trim()
    .optional()
    .or(z.literal('')),

  talentSpecialty: z
    .string()
    .max(100, { message: 'Keahlian yang diminati maksimal 100 karakter' })
    .trim()
    .optional()
    .or(z.literal('')),

  eventType: z
    .string()
    .max(100, { message: 'Jenis event maksimal 100 karakter' })
    .trim()
    .optional()
    .or(z.literal('')),

  // Honeypot — must be empty
  website: honeypotSchema,
});
```

### Type-Specific Refinements

When the inquiry type is `kemitraan` (partnership), `budgetEstimate` should be required-ish (soft warning):

```typescript
export const inquiryRefinedSchema = inquirySchema.refine(
  (data) => {
    if (data.inquiryType === 'kemitraan') {
      return data.budgetEstimate && data.budgetEstimate.length > 0;
    }
    return true;
  },
  {
    message: 'Perkiraan budget membantu kami menyiapkan proposal yang sesuai',
    path: ['budgetEstimate'],
  }
).refine(
  (data) => {
    if (data.inquiryType === 'talent') {
      return data.talentSpecialty && data.talentSpecialty.length > 0;
    }
    return true;
  },
  {
    message: 'Sebutkan keahlian yang Anda minati (caster, desainer, dll)',
    path: ['talentSpecialty'],
  }
);
```

### Inquiry Type Labels (Indonesian)

```typescript
export const inquiryTypeLabels: Record<z.infer<typeof InquiryTypeEnum>, string> = {
  kemitraan: 'Kemitraan / Sponsorship',
  talent: 'Lamaran Talent',
  'event-booking': 'Booking Event',
  umum: 'Pertanyaan Umum',
};
```

---

## Admin Form Schemas

### Event Form

```typescript
export const eventFormSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { message: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung' }),
  game: z.array(z.string()).min(1, { message: 'Pilih minimal 1 game' }),
  status: z.enum(['akan_datang', 'berlangsung', 'selesai', 'dibatalkan']),
  startDate: z.string().datetime({ message: 'Format tanggal tidak valid' }),
  endDate: z.string().datetime().optional().or(z.literal('')),
  location: z.object({
    city: z.enum(['Semarang', 'Solo', 'Kendal', 'Pati', 'Lainnya']),
    venue: z.string().max(200).optional(),
    address: z.string().max(500).optional(),
    mapUrl: z.string().url({ message: 'URL tidak valid' }).optional().or(z.literal('')),
  }),
  prizePool: z.string().max(100).optional(),
  description: z.any().optional(), // Payload rich text JSON
  featuredImage: z.string().min(1, { message: 'Gambar utama wajib diisi' }),
  gallery: z.array(z.string()).max(50).optional(),
  registrationWa: z
    .string()
    .regex(indonesianPhoneRegex, { message: 'Nomor WhatsApp tidak valid' })
    .optional()
    .or(z.literal('')),
  prefilledMessage: z.string().max(500).optional(),
  resultsUrl: z.string().url().optional().or(z.literal('')),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['endDate'],
  }
);
```

### Team Member Form

```typescript
export const teamMemberFormSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  role: z.string().min(2).max(100),
  department: z.enum(['Talent', 'Produksi', 'Operasional']),
  shortBio: z.string().min(10).max(280),
  fullBio: z.any().optional(), // Rich text
  photo: z.string().optional(),
  socialLinks: z.object({
    instagram: z.string().url().optional().or(z.literal('')),
    whatsapp: z.string().regex(indonesianPhoneRegex).optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }).optional(),
  portfolio: z.array(z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(500).optional(),
    url: z.string().url().optional().or(z.literal('')),
    image: z.string().optional(),
  })).max(20).optional(),
  services: z.array(z.string()).optional(),
  displayOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});
```

### Service Form

```typescript
export const serviceFormSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  icon: z.string().max(50).optional(),
  shortDescription: z.string().min(20).max(280),
  fullDescription: z.any().optional(),
  sampleWork: z.array(z.string()).max(12).optional(),
  assignedTeam: z.array(z.string()).optional(),
  whatsappContact: z.string().regex(indonesianPhoneRegex).optional().or(z.literal('')),
  displayOrder: z.number().int().min(0).default(0),
});
```

### News Article Form

```typescript
export const newsFormSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(20).max(200),
  content: z.any(), // Rich text, required
  featuredImage: z.string().min(1, { message: 'Gambar utama wajib diisi' }),
  author: z.string().min(1, { message: 'Penulis wajib dipilih' }),
  relatedArticles: z.array(z.string()).max(3).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.status === 'published' && !data.publishedAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Tanggal publikasi wajib diisi jika status published',
    path: ['publishedAt'],
  }
);
```

### Inquiry Status Update (Admin)

```typescript
export const inquiryStatusUpdateSchema = z.object({
  status: z.enum(['baru', 'dibaca', 'dibalas', 'diarsipkan']),
  notes: z.string().max(1000).optional(),
});
```

### Media Upload Form

```typescript
export const mediaUploadSchema = z.object({
  alt: z.string().min(3, { message: 'Alt text minimal 3 karakter untuk aksesibilitas' }).max(200),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'Ukuran file terlalu besar (maks 10MB)',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type),
      { message: 'Format file tidak didukung (JPG, PNG, WebP, AVIF)' }
    ),
});
```

### User Create/Update Form

```typescript
export const userCreateSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }).max(200),
  password: z
    .string()
    .min(12, { message: 'Password minimal 12 karakter' })
    .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
    .regex(/[a-z]/, { message: 'Password harus mengandung huruf kecil' })
    .regex(/[0-9]/, { message: 'Password harus mengandung angka' }),
  displayName: z.string().min(2).max(100),
  role: z.enum(['admin', 'editor', 'viewer']),
});

export const userUpdateSchema = userCreateSchema.partial().extend({
  // Optional password update with same rules
  password: z
    .string()
    .min(12)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .optional()
    .or(z.literal('')),
});
```

---

## Type Exports

```typescript
export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryRefinedInput = z.infer<typeof inquiryRefinedSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type TeamMemberFormInput = z.infer<typeof teamMemberFormSchema>;
export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
export type NewsFormInput = z.infer<typeof newsFormSchema>;
export type InquiryStatusUpdateInput = z.infer<typeof inquiryStatusUpdateSchema>;
export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
```

---

## Usage Examples

### Client-Side Validation (React)

```typescript
// In a React form component
import { inquirySchema } from '~/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(inquirySchema),
});

const onSubmit = async (data: InquiryInput) => {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // ...
};
```

### Server-Side Validation (Astro API endpoint)

```typescript
// apps/web/src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { inquiryRefinedSchema } from '~/lib/validation';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const result = inquiryRefinedSchema.safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Validasi gagal',
        fields: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Honeypot check (already in schema, but double-check)
  if (result.data.website && result.data.website.length > 0) {
    // Bot detected — silently succeed
    return new Response(
      JSON.stringify({
        success: true,
        inquiryId: 'bot-detected',
        message: 'Terima kasih!',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ... store inquiry, send email, etc.
};
```

---

## Validation Messages (Indonesian Reference)

All error messages centralized in Indonesian. Translation table for future English:

| Key | Indonesian | English (future) |
|---|---|---|
| `required` | Wajib diisi | Required |
| `email_invalid` | Format email tidak valid | Invalid email format |
| `phone_invalid` | Format WhatsApp tidak valid | Invalid WhatsApp format |
| `slug_invalid` | Slug hanya boleh huruf kecil, angka, dan tanda hubung | Slug only allows lowercase, numbers, hyphens |
| `min_length` | Minimal {n} karakter | Minimum {n} characters |
| `max_length` | Maksimal {n} karakter | Maximum {n} characters |
| `too_large` | Ukuran file terlalu besar | File too large |
| `unsupported_format` | Format file tidak didukung | Unsupported file format |
| `date_invalid` | Format tanggal tidak valid | Invalid date format |
| `date_order` | Tanggal selesai harus setelah tanggal mulai | End date must be after start date |
| `spam_detected` | Spam terdeteksi | Spam detected |
| `permission_denied` | Anda tidak memiliki akses | Permission denied |
| `not_found` | Tidak ditemukan | Not found |
| `server_error` | Terjadi kesalahan pada server | Server error |
| `rate_limited` | Terlalu banyak percobaan | Too many attempts |

---

**Next**: See `cms-rest-api.md` for endpoint definitions, `data-model.md` for MongoDB schema.