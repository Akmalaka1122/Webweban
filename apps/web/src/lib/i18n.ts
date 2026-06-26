export const id = {
  nav: {
    home: 'Beranda',
    events: 'Event',
    services: 'Layanan',
    team: 'Tim',
    news: 'Berita',
    gallery: 'Galeri',
    contact: 'Kontak',
    admin: 'Admin',
  },
  cta: {
    contactUs: 'Hubungi Kami',
    registerNow: 'Daftar Sekarang',
    viewDetails: 'Lihat Detail',
    learnMore: 'Pelajari Lebih Lanjut',
  },
  footer: {
    copyright: '© 2026 RIKAS INDO TECHNOLOGY. Hak Cipta Dilindungi.',
    followUs: 'Ikuti Kami',
    contactInfo: 'Hubungi Kami',
  },
  form: {
    name: 'Nama Lengkap',
    email: 'Email',
    whatsapp: 'WhatsApp',
    type: 'Jenis Pesanan',
    message: 'Pesan',
    submit: 'Kirim Pesan',
    success: 'Pesan berhasil dikirim!',
    error: 'Terjadi kesalahan. Silakan coba lagi.',
  },
  events: {
    upcoming: 'Event Mendatang',
    past: 'Event Selesai',
    filter: 'Filter Event',
    noEvents: 'Belum ada event yang tersedia.',
  },
  misc: {
    loading: 'Memuat...',
    readMore: 'Baca Selengkapnya',
    share: 'Bagikan',
  },
} as const;

export type TranslationKey = typeof id;
