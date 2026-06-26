export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RIKAS INDO TECHNOLOGY',
    url: 'https://rikas.id',
    logo: 'https://rikas.id/assets/logo.png',
    description: 'Event Organizer & Komunitas Esports Jawa Tengah',
    areaServed: ['Semarang', 'Solo', 'Kendal', 'Pati'],
    sameAs: ['https://instagram.com/rikas.idn'],
  };
}

export function eventSchema(event: {
  title: string;
  date?: string;
  location?: string;
  description?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: event.location ? {
      '@type': 'Place',
      name: event.location,
      address: { '@type': 'PostalAddress', addressRegion: 'Jawa Tengah', addressCountry: 'ID' },
    } : undefined,
    description: event.description,
    image: event.image,
    organizer: { '@type': 'Organization', name: 'RIKAS INDO TECHNOLOGY' },
  };
}

export function articleSchema(article: {
  title: string;
  published_at?: string;
  excerpt?: string;
  image?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.published_at,
    description: article.excerpt,
    image: article.image,
    author: article.author ? { '@type': 'Person', name: article.author } : undefined,
    publisher: { '@type': 'Organization', name: 'RIKAS INDO TECHNOLOGY' },
  };
}

export function serviceSchema(service: {
  title: string;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: { '@type': 'Organization', name: 'RIKAS INDO TECHNOLOGY' },
    areaServed: ['Semarang', 'Solo', 'Kendal', 'Pati'],
  };
}
