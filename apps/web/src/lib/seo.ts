export function buildMeta(title: string, description: string, image?: string) {
  const siteName = 'RIKAS INDO TECHNOLOGY';
  return {
    title: `${title} | ${siteName}`,
    ogTitle: `${title} — ${siteName}`,
    description,
    ogDescription: description,
    ogImage: image || '/og-default.jpg',
    ogType: 'website' as const,
  };
}
