// packages/shared/src/types.ts
// TypeScript types matching Payload CMS collections

export interface Media {
  id: string;
  filename: string;
  alt_text?: string;
  sizes?: {
    thumbnail?: { url: string; width: number; height: number };
    card?: { url: string; width: number; height: number };
    hero?: { url: string; width: number; height: number };
  };
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  slug: string;
  game: string;
  date: string;
  status: EventStatus;
  description: string;
  prize_pool?: string;
  whatsapp_url?: string;
  featured_image?: Media;
  gallery?: Media[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  department: 'talent' | 'production' | 'operations';
  photo?: Media;
  bio?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  portfolio?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  assigned_team?: string;
  icon?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export type InquiryType = 'partnership' | 'talent' | 'event' | 'general';
export type InquiryStatus = 'pending' | 'contacted' | 'resolved' | 'closed';

export interface Inquiry {
  id: string;
  name: string;
  email?: string;
  whatsapp?: string;
  type: InquiryType;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author?: string;
  published_at: string;
  featured_image?: Media;
  tags?: string[];
  excerpt?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryPhoto {
  id: string;
  image: Media;
  caption?: string;
  event_ref?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
