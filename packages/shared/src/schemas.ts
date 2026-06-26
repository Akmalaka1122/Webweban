// packages/shared/src/schemas.ts
// Zod validation schemas for all forms

import { z } from 'zod';

// Inquiry form schema
export const inquirySchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid').optional(),
  whatsapp: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,13}$/, 'Nomor WhatsApp tidak valid')
    .optional(),
  type: z.enum(['partnership', 'talent', 'event', 'general'], {
    required_error: 'Pilih jenis inquiry',
  }),
  message: z.string().min(10, 'Pesan harus minimal 10 karakter'),
}).refine((data) => data.email || data.whatsapp, {
  message: 'Masukkan email atau nomor WhatsApp',
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

// Event schema
export const eventSchema = z.object({
  title: z.string().min(3, 'Judul harus minimal 3 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug tidak valid'),
  game: z.string().min(1, 'Nama game harus diisi'),
  date: z.string().min(1, 'Tanggal harus diisi'),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
  description: z.string().min(10, 'Deskripsi harus minimal 10 karakter'),
  prize_pool: z.string().optional(),
  whatsapp_url: z.string().url('URL WhatsApp tidak valid').optional(),
  tags: z.array(z.string()).optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

// Team member schema
export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  slug: z
    .string()
    .min(2, 'Slug harus minimal 2 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug tidak valid'),
  role: z.string().min(2, 'Role harus minimal 2 karakter'),
  department: z.enum(['talent', 'production', 'operations'], {
    required_error: 'Pilih departemen',
  }),
  bio: z.string().optional(),
  social_links: z
    .object({
      instagram: z.string().url('URL Instagram tidak valid').optional(),
      twitter: z.string().url('URL Twitter tidak valid').optional(),
      youtube: z.string().url('URL YouTube tidak valid').optional(),
      tiktok: z.string().url('URL TikTok tidak valid').optional(),
    })
    .optional(),
  portfolio: z.string().url('URL portfolio tidak valid').optional(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

// Service schema
export const serviceSchema = z.object({
  title: z.string().min(3, 'Judul harus minimal 3 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug tidak valid'),
  description: z.string().min(10, 'Deskripsi harus minimal 10 karakter'),
  features: z.array(z.string()).min(1, 'Minimal 1 fitur harus diisi'),
  assigned_team: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().min(0, 'Urutan tidak boleh negatif'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// Article schema
export const articleSchema = z.object({
  title: z.string().min(3, 'Judul harus minimal 3 karakter'),
  slug: z
    .string()
    .min(3, 'Slug harus minimal 3 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug tidak valid'),
  content: z.string().min(50, 'Konten harus minimal 50 karakter'),
  author: z.string().optional(),
  published_at: z.string().min(1, 'Tanggal publikasi harus diisi'),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().max(300, 'Excerpt maksimal 300 karakter').optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

// Gallery photo schema
export const galleryPhotoSchema = z.object({
  caption: z.string().optional(),
  event_ref: z.string().optional(),
});

export type GalleryPhotoFormData = z.infer<typeof galleryPhotoSchema>;
