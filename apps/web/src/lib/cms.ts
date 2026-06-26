const CMS_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001';

export async function cmsFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${CMS_URL}/api${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`CMS error: ${res.status}`);
  return res.json();
}

export async function getEvents(params?: { limit?: number; where?: Record<string, unknown> }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return cmsFetch<{ docs: any[] }>(`/events?${qs}`);
}

export async function getEventBySlug(slug: string) {
  const res = await cmsFetch<{ docs: any[] }>(`/events?where[slug][equals]=${slug}`);
  return res.docs[0] || null;
}

export async function getServices() {
  return cmsFetch<{ docs: any[] }>('/services');
}

export async function getServiceBySlug(slug: string) {
  const res = await cmsFetch<{ docs: any[] }>(`/services?where[slug][equals]=${slug}`);
  return res.docs[0] || null;
}

export async function getTeamMembers() {
  return cmsFetch<{ docs: any[] }>('/team-members');
}

export async function getTeamMemberBySlug(slug: string) {
  const res = await cmsFetch<{ docs: any[] }>(`/team-members?where[slug][equals]=${slug}`);
  return res.docs[0] || null;
}

export async function getArticles(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return cmsFetch<{ docs: any[] }>(`/news?${qs}`);
}

export async function getArticleBySlug(slug: string) {
  const res = await cmsFetch<{ docs: any[] }>(`/news?where[slug][equals]=${slug}`);
  return res.docs[0] || null;
}

export async function getGallery(params?: { limit?: number; where?: Record<string, unknown> }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set('limit', String(params.limit));
  return cmsFetch<{ docs: any[] }>(`/gallery?${qs}`);
}
