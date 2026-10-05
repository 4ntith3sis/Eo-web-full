/**
 * Centralized DEVELOPMENT/SAMPLE data for the Phase 2 frontend.
 *
 * Nothing here is confirmed production content:
 * - addresses, prices, promos, testimonials, and contact details are
 *   placeholders for layout and integration purposes;
 * - Phase 3 will replace this file with Payload CMS data.
 *
 * Architecture: Service + Location = ServiceLocation.
 * Pricing, facilities, FAQs, and WhatsApp belong to the
 * ServiceLocation combination — never to a page.
 */
import type {
  ComparisonRow,
  Facility,
  Faq,
  Location,
  PricingPlan,
  Promotion,
  Service,
  ServiceLocation,
  Testimonial,
} from "@/types";
import { locationWhatsappNumber } from "@/lib/whatsapp";

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

export const site = {
  name: "EasyOffice",
  tagline: "Solusi Ruang Kerja Profesional untuk Bisnis Anda",
  // SAMPLE contact details — replace with real ones before launch.
  email: "info@easyoffice.example",
  phoneDisplay: "+62 812-3456-7890",
  sampleNotice:
    "Data contoh untuk kebutuhan pengembangan — bukan informasi resmi.",
};

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export const locations: Location[] = [
  {
    slug: "bandung",
    name: "Bandung",
    shortDescription:
      "Lokasi utama EasyOffice dengan akses mudah ke pusat bisnis kota Bandung.",
    address: "Jl. Contoh Alamat No. 123, Bandung, Jawa Barat (contoh)",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    email: "bandung@easyoffice.example",
    phoneDisplay: "+62 812-3456-7890 (contoh)",
    whatsapp: "6281234567890",
  },
  {
    slug: "jakarta",
    name: "Jakarta",
    shortDescription:
      "Kantor representatif di ibu kota untuk menjangkau klien dan mitra bisnis.",
    address: "Jl. Contoh Alamat No. 45, Jakarta Selatan (contoh)",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    email: "jakarta@easyoffice.example",
    phoneDisplay: "+62 812-3456-7891 (contoh)",
    whatsapp: "6281234567891",
  },
  {
    slug: "bekasi",
    name: "Bekasi",
    shortDescription:
      "Alternatif strategis dengan biaya efisien di kawasan penyangga Jakarta.",
    address: "Jl. Contoh Alamat No. 67, Bekasi, Jawa Barat (contoh)",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    email: "bekasi@easyoffice.example",
    phoneDisplay: "+62 812-3456-7892 (contoh)",
    whatsapp: "6281234567892",
  },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const services: Service[] = [
  {
    slug: "virtual-office",
    title: "Virtual Office",
    shortTitle: "Virtual Office",
    description:
      "Alamat bisnis profesional, layanan surat, dan resepsionis tanpa perlu sewa kantor fisik.",
    intro:
      "Virtual Office cocok untuk startup, freelancer, dan perusahaan yang membutuhkan kehadiran bisnis resmi dengan biaya efisien.",
    benefits: [
      "Alamat Prestisius — tingkatkan citra dan kepercayaan klien dengan alamat bisnis profesional.",
      "Hemat Biaya — nikmati fasilitas kantor tanpa biaya sewa dan operasional ruang fisik.",
      "Layanan Resepsionis — tim profesional menyambut tamu dan menangani telepon atas nama perusahaan Anda.",
      "Fleksibel — paket bulanan yang dapat ditingkatkan seiring pertumbuhan bisnis Anda.",
    ],
    features: [
      "Alamat bisnis prestisius",
      "Penanganan surat dan paket",
      "Layanan resepsionis",
      "Akses ruang meeting",
    ],
    icon: "briefcase",
    href: "/layanan/virtual-office",
  },
  {
    slug: "coworking-space",
    title: "Coworking Space",
    shortTitle: "Coworking",
    description:
      "Ruang kerja fleksibel untuk individu dan tim, harian hingga bulanan.",
    intro:
      "Pilih hot desk untuk fleksibilitas maksimal atau dedicated desk untuk tim yang membutuhkan ruang tetap — didukung komunitas profesional.",
    benefits: [
      "Hot Desk Fleksibel — Hot desk untuk kerja harian dengan suasana produktif dan nyaman.",
      "Dedicated Desk — Dedicated desk permanen untuk tim yang butuh ruang kerja tetap.",
      "Internet Cepat — Koneksi internet cepat dan area kolaborasi untuk tim yang dinamis.",
      "Komunitas Profesional — Berkenalan dengan profesional lintas industri untuk kolaborasi bisnis.",
      "Jatah Meeting Room — Termasuk jatah jam meeting room tiap bulan untuk rapat penting.",
      "Lounge & Pantry — Lounge, pantry, dan area fokus yang nyaman sepanjang hari.",
    ],
    features: [
      "Hot desk dan dedicated desk",
      "Internet cepat",
      "Ruang kolaborasi",
      "Komunitas profesional",
    ],
    icon: "users",
    href: "/layanan/coworking-space",
  },
  {
    slug: "meeting-room",
    title: "Meeting Room",
    shortTitle: "Meeting Room",
    description:
      "Ruang meeting profesional untuk presentasi, diskusi, dan kebutuhan bisnis.",
    intro:
      "Tersedia ruangan Small (hingga 6 orang), Medium (hingga 12 orang), dan Large (hingga 20 orang) dengan whiteboard, proyektor, dan layanan konsumsi.",
    benefits: [
      "Kapasitas Fleksibel — Tiga pilihan kapasitas hingga 20 orang untuk berbagai kebutuhan rapat.",
      "Peralatan Lengkap — Proyektor, whiteboard, dan audio-video siap pakai untuk presentasi profesional.",
      "Konsumsi Tersedia — Snack, minuman, dan opsi catering untuk menemani acara Anda.",
      "Reservasi Fleksibel — Reservasi fleksibel per jam via WhatsApp tanpa ribet.",
      "Dukungan Teknis — Tim teknis siap membantu selama acara berlangsung.",
      "Lokasi Strategis — Alamat mudah dijangkau di pusat kota untuk memudahkan tamu Anda.",
    ],
    features: [
      "Kapasitas 4–20 orang",
      "Proyektor dan whiteboard",
      "Minuman dan layanan rapat",
      "Reservasi fleksibel",
    ],
    icon: "door",
    href: "/layanan/meeting-room",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Facilities (shared pool — combos pick their subset)                 */
/* ------------------------------------------------------------------ */

const facilityPool: Record<string, Facility> = {
  wifi: {
    icon: "wifi",
    title: "WiFi Cepat",
    description: "Internet stabil untuk kerja dan meeting online.",
  },
  door: {
    icon: "door",
    title: "Meeting Room",
    description: "Ruang meeting profesional dengan peralatan lengkap.",
  },
  bell: {
    icon: "bell",
    title: "Resepsionis",
    description: "Sambutan profesional untuk tamu dan klien Anda.",
  },
  "map-pin": {
    icon: "map-pin",
    title: "Alamat Bisnis",
    description: "Alamat prestisius untuk legalitas dan citra usaha.",
  },
  printer: {
    icon: "printer",
    title: "Print & Scan",
    description: "Fasilitas cetak dan pemindaian dokumen.",
  },
  coffee: {
    icon: "coffee",
    title: "Lounge & Pantry",
    description: "Area santai dengan kopi, teh, dan air minum.",
  },
  car: {
    icon: "car",
    title: "Parkir",
    description: "Area parkir yang aman dan mudah diakses.",
  },
  clock: {
    icon: "clock",
    title: "Akses Fleksibel",
    description: "Jam operasional yang menyesuaikan kebutuhan tim.",
  },
};

function pickFacilities(...keys: string[]): Facility[] {
  return keys.map((k) => facilityPool[k]);
}

export const allFacilities: Facility[] = Object.values(facilityPool);

/* ------------------------------------------------------------------ */
/* FAQs                                                               */
/* ------------------------------------------------------------------ */

export const generalFaqs: Faq[] = [
  {
    question: "Apa itu Virtual Office?",
    answer:
      "Virtual Office adalah layanan alamat bisnis profesional beserta penanganan surat dan layanan resepsionis, tanpa Anda perlu menyewa ruang kantor fisik.",
  },
  {
    question: "Apa saja layanan yang tersedia di EasyOffice?",
    answer:
      "Kami menyediakan Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi.",
  },
  {
    question: "Di mana lokasi EasyOffice?",
    answer:
      "EasyOffice hadir di Bandung, Jakarta, dan Bekasi. Detail alamat tiap lokasi tersedia di halaman Kontak.",
  },
  {
    question: "Apakah tersedia Meeting Room?",
    answer:
      "Ya. Meeting Room tersedia dengan berbagai kapasitas dan dapat dipesan per jam melalui WhatsApp.",
  },
  {
    question: "Bagaimana cara menghubungi EasyOffice?",
    answer:
      "Klik tombol WhatsApp di situs ini — Anda akan diarahkan ke chat WhatsApp tim kami untuk info dan pemesanan.",
  },
];

const virtualOfficeFaqs: Faq[] = [
  {
    question: "Apakah alamat Virtual Office bisa untuk legalitas usaha?",
    answer:
      "Alamat Virtual Office umumnya dapat digunakan untuk kebutuhan administrasi bisnis. Untuk kepastian legalitas spesifik usaha Anda, konsultasikan dengan tim kami via WhatsApp.",
  },
  {
    question: "Bagaimana sistem penerimaan surat dan paket?",
    answer:
      "Setiap surat atau paket yang tiba akan dicatat dan Anda menerima pemberitahuan untuk pengambilan atau penerusan.",
  },
  {
    question: "Apakah saya bisa menggunakan meeting room?",
    answer:
      "Ya. Setiap paket Virtual Office memiliki jatah jam meeting room per bulan yang dapat ditambah sesuai kebutuhan.",
  },
  {
    question: "Berapa lama minimal berlangganan?",
    answer:
      "Paket tersedia bulanan dengan opsi perpanjangan tahunan yang lebih hemat. Hubungi kami untuk penawaran resmi.",
  },
];

const coworkingFaqs: Faq[] = [
  {
    question: "Apa perbedaan hot desk dan dedicated desk?",
    answer:
      "Hot desk adalah meja fleksibel yang dipakai bergantian, sedangkan dedicated desk adalah meja khusus permanen untuk Anda.",
  },
  {
    question: "Apakah bisa bayar harian?",
    answer: "Ya. Tersedia tarif harian, bulanan, dan dedicated desk.",
  },
  {
    question: "Apakah tersedia akses meeting room?",
    answer:
      "Paket bulanan dan dedicated sudah termasuk jatah jam meeting room per bulan.",
  },
  {
    question: "Jam berapa coworking beroperasi?",
    answer:
      "Senin–Jumat, 08.00–17.00 WIB. Kebutuhan di luar jam tersebut dapat didiskusikan dengan tim kami.",
  },
];

const meetingRoomFaqs: Faq[] = [
  {
    question: "Berapa kapasitas meeting room yang tersedia?",
    answer:
      "Tersedia ruangan Small (hingga 6 orang), Medium (hingga 12 orang), dan Large (hingga 20 orang).",
  },
  {
    question: "Bagaimana cara memesan meeting room?",
    answer:
      "Pemesanan dilakukan melalui WhatsApp — pilih tanggal, jam, dan kapasitas ruangan yang dibutuhkan.",
  },
  {
    question: "Apakah tersedia proyektor dan konsumsi?",
    answer:
      "Ruangan Medium dan Large dilengkapi proyektor. Snack, minuman, dan catering tersedia sesuai paket.",
  },
  {
    question: "Apakah bisa dibatalkan atau dijadwalkan ulang?",
    answer:
      "Ya, dengan pemberitahuan sebelumnya sesuai ketentuan yang akan dijelaskan tim kami saat pemesanan.",
  },
];

/* ------------------------------------------------------------------ */
/* Pricing (SAMPLE — bukan harga resmi; milik tiap kombinasi)          */
/* ------------------------------------------------------------------ */

export const SAMPLE_PRICE_NOTE =
  "Harga contoh untuk kebutuhan pengembangan — hubungi kami untuk penawaran resmi.";

function plan(
  name: string,
  price: string,
  period: string,
  features: string[],
  featured = false,
): PricingPlan {
  return {
    name,
    price,
    period,
    features,
    featured,
    ctaLabel: "Hubungi via WhatsApp",
  };
}

/* ------------------------------------------------------------------ */
/* Service + Location combinations                                     */
/* ------------------------------------------------------------------ */

export const serviceLocations: ServiceLocation[] = [
  {
    serviceSlug: "virtual-office",
    locationSlug: "bandung",
    tagline: "Kehadiran bisnis kredibel di pusat kota Bandung.",
    startingPrice: "Rp 350 rb",
    pricing: [
      plan("Basic", "Rp 350 rb", "/bulan", [
        "Alamat bisnis",
        "Penanganan surat",
        "Pemberitahuan via email",
      ]),
      plan("Business", "Rp 650 rb", "/bulan", [
        "Semua fitur Basic",
        "Layanan resepsionis",
        "2 jam meeting room / bulan",
        "Nomor telepon khusus",
      ], true),
      plan("Premium", "Rp 1,2 jt", "/bulan", [
        "Semua fitur Business",
        "8 jam meeting room / bulan",
        "Akses coworking 4 hari / bulan",
        "Prioritas dukungan",
      ]),
    ],
    facilities: pickFacilities("map-pin", "bell", "printer", "wifi", "door", "coffee"),
    faqs: virtualOfficeFaqs,
  },
  {
    serviceSlug: "virtual-office",
    locationSlug: "jakarta",
    tagline: "Alamat prestisius ibu kota untuk jangkauan bisnis nasional.",
    startingPrice: "Rp 450 rb",
    pricing: [
      plan("Basic", "Rp 450 rb", "/bulan", [
        "Alamat bisnis Jakarta Selatan",
        "Penanganan surat",
        "Pemberitahuan via email",
      ]),
      plan("Business", "Rp 850 rb", "/bulan", [
        "Semua fitur Basic",
        "Layanan resepsionis",
        "4 jam meeting room / bulan",
        "Nomor telepon khusus",
      ], true),
      plan("Premium", "Rp 1,6 jt", "/bulan", [
        "Semua fitur Business",
        "12 jam meeting room / bulan",
        "Akses coworking 8 hari / bulan",
        "Prioritas dukungan",
      ]),
    ],
    facilities: pickFacilities("map-pin", "bell", "printer", "wifi", "door", "coffee", "car", "clock"),
    faqs: virtualOfficeFaqs,
  },
  {
    serviceSlug: "virtual-office",
    locationSlug: "bekasi",
    tagline: "Solusi hemat di kawasan penyangga Jakarta.",
    startingPrice: "Rp 300 rb",
    pricing: [
      plan("Basic", "Rp 300 rb", "/bulan", [
        "Alamat bisnis",
        "Penanganan surat",
        "Pemberitahuan via email",
      ]),
      plan("Business", "Rp 550 rb", "/bulan", [
        "Semua fitur Basic",
        "Layanan resepsionis",
        "2 jam meeting room / bulan",
        "Nomor telepon khusus",
      ], true),
      plan("Premium", "Rp 1 jt", "/bulan", [
        "Semua fitur Business",
        "6 jam meeting room / bulan",
        "Akses coworking 4 hari / bulan",
        "Prioritas dukungan",
      ]),
    ],
    facilities: pickFacilities("map-pin", "bell", "printer", "wifi", "door"),
    faqs: virtualOfficeFaqs,
  },
  {
    serviceSlug: "coworking-space",
    locationSlug: "bandung",
    tagline: "Ruang kerja fleksibel di jantung kota Bandung.",
    startingPrice: "Rp 75 rb",
    pricing: [
      plan("Harian", "Rp 75 rb", "/hari", [
        "Hot desk",
        "WiFi cepat",
        "Air minum",
        "Akses lounge",
      ]),
      plan("Bulanan", "Rp 850 rb", "/bulan", [
        "Hot desk fleksibel",
        "WiFi cepat",
        "2 jam meeting room / bulan",
        "Akses komunitas",
      ], true),
      plan("Dedicated", "Rp 1,5 jt", "/bulan", [
        "Meja khusus permanen",
        "Locker pribadi",
        "8 jam meeting room / bulan",
        "Alamat surat",
      ]),
    ],
    facilities: pickFacilities("wifi", "coffee", "printer", "door", "clock", "car"),
    faqs: coworkingFaqs,
  },
  {
    serviceSlug: "coworking-space",
    locationSlug: "jakarta",
    tagline: "Ruang kerja fleksibel di jantung bisnis Jakarta.",
    startingPrice: "Rp 95 rb",
    pricing: [
      plan("Harian", "Rp 95 rb", "/hari", [
        "Hot desk",
        "WiFi cepat",
        "Air minum",
        "Akses lounge",
      ]),
      plan("Bulanan", "Rp 1,1 jt", "/bulan", [
        "Hot desk fleksibel",
        "WiFi cepat",
        "2 jam meeting room / bulan",
        "Akses komunitas",
      ], true),
      plan("Dedicated", "Rp 1,9 jt", "/bulan", [
        "Meja khusus permanen",
        "Locker pribadi",
        "8 jam meeting room / bulan",
        "Alamat surat",
      ]),
    ],
    facilities: pickFacilities("wifi", "coffee", "printer", "door", "clock", "car"),
    faqs: coworkingFaqs,
  },
  {
    serviceSlug: "coworking-space",
    locationSlug: "bekasi",
    tagline: "Ruang kerja hemat di kawasan penyangga Jakarta.",
    startingPrice: "Rp 60 rb",
    pricing: [
      plan("Harian", "Rp 60 rb", "/hari", [
        "Hot desk",
        "WiFi cepat",
        "Air minum",
        "Akses lounge",
      ]),
      plan("Bulanan", "Rp 700 rb", "/bulan", [
        "Hot desk fleksibel",
        "WiFi cepat",
        "2 jam meeting room / bulan",
        "Akses komunitas",
      ], true),
      plan("Dedicated", "Rp 1,2 jt", "/bulan", [
        "Meja khusus permanen",
        "Locker pribadi",
        "8 jam meeting room / bulan",
        "Alamat surat",
      ]),
    ],
    facilities: pickFacilities("wifi", "coffee", "printer", "door"),
    faqs: coworkingFaqs,
  },
  {
    serviceSlug: "meeting-room",
    locationSlug: "bandung",
    tagline: "Ruang meeting profesional per jam di Bandung.",
    startingPrice: "Rp 150 rb",
    pricing: [
      plan("Small", "Rp 150 rb", "/jam", [
        "Kapasitas hingga 6 orang",
        "Whiteboard",
        "Air minum",
        "WiFi cepat",
      ]),
      plan("Medium", "Rp 250 rb", "/jam", [
        "Kapasitas hingga 12 orang",
        "Proyektor dan whiteboard",
        "Snack dan minuman",
        "Dukungan teknis",
      ], true),
      plan("Large", "Rp 450 rb", "/jam", [
        "Kapasitas hingga 20 orang",
        "Sistem audio-video",
        "Catering tersedia",
        "Asisten acara",
      ]),
    ],
    facilities: pickFacilities("door", "wifi", "coffee", "printer", "car", "clock"),
    faqs: meetingRoomFaqs,
  },
  {
    serviceSlug: "meeting-room",
    locationSlug: "jakarta",
    tagline: "Ruang meeting profesional per jam di Jakarta.",
    startingPrice: "Rp 200 rb",
    pricing: [
      plan("Small", "Rp 200 rb", "/jam", [
        "Kapasitas hingga 6 orang",
        "Whiteboard",
        "Air minum",
        "WiFi cepat",
      ]),
      plan("Medium", "Rp 350 rb", "/jam", [
        "Kapasitas hingga 12 orang",
        "Proyektor dan whiteboard",
        "Snack dan minuman",
        "Dukungan teknis",
      ], true),
      plan("Large", "Rp 600 rb", "/jam", [
        "Kapasitas hingga 20 orang",
        "Sistem audio-video",
        "Catering tersedia",
        "Asisten acara",
      ]),
    ],
    facilities: pickFacilities("door", "wifi", "coffee", "printer", "car", "clock"),
    faqs: meetingRoomFaqs,
  },
  {
    serviceSlug: "meeting-room",
    locationSlug: "bekasi",
    tagline: "Ruang meeting profesional per jam di Bekasi.",
    startingPrice: "Rp 120 rb",
    pricing: [
      plan("Small", "Rp 120 rb", "/jam", [
        "Kapasitas hingga 6 orang",
        "Whiteboard",
        "Air minum",
        "WiFi cepat",
      ]),
      plan("Medium", "Rp 200 rb", "/jam", [
        "Kapasitas hingga 12 orang",
        "Proyektor dan whiteboard",
        "Snack dan minuman",
        "Dukungan teknis",
      ], true),
      plan("Large", "Rp 350 rb", "/jam", [
        "Kapasitas hingga 20 orang",
        "Sistem audio-video",
        "Catering tersedia",
        "Asisten acara",
      ]),
    ],
    facilities: pickFacilities("door", "wifi", "coffee", "car"),
    faqs: meetingRoomFaqs,
  },
];

export function getServiceLocation(
  serviceSlug: string,
  locationSlug: string,
): ServiceLocation | undefined {
  return serviceLocations.find(
    (s) => s.serviceSlug === serviceSlug && s.locationSlug === locationSlug,
  );
}

/** Locations where a service is available — drives location grids. */
export function locationsForService(serviceSlug: string): Location[] {
  const slugs = new Set(
    serviceLocations
      .filter((s) => s.serviceSlug === serviceSlug)
      .map((s) => s.locationSlug),
  );
  return locations.filter((l) => slugs.has(l.slug));
}

/** Resolve the WhatsApp number for a combination (override → location). */
export function whatsappForCombination(combo: ServiceLocation): string {
  return combo.whatsapp ?? locationWhatsappNumber(combo.locationSlug);
}

/* ------------------------------------------------------------------ */
/* Comparison (SAMPLE — klaim umum, bukan tentang kompetitor nyata)    */
/* ------------------------------------------------------------------ */

export const comparisonNote =
  "Perbandingan contoh untuk kebutuhan desain — kolom pembanding bersifat umum, bukan merujuk pada perusahaan tertentu.";

export const comparisonRows: ComparisonRow[] = [
  { feature: "Alamat bisnis profesional", easyoffice: true, typical: false },
  { feature: "Ruang meeting di lokasi", easyoffice: true, typical: false },
  { feature: "Layanan resepsionis", easyoffice: true, typical: false },
  { feature: "Penanganan surat dan paket", easyoffice: true, typical: true },
  { feature: "Akses coworking", easyoffice: true, typical: false },
  { feature: "Paket fleksibel bulanan", easyoffice: true, typical: true },
];

/* ------------------------------------------------------------------ */
/* Testimonials (SAMPLE — bukan pelanggan sungguhan)                   */
/* ------------------------------------------------------------------ */

export const testimonialNotice =
  "Testimoni contoh untuk kebutuhan desain — bukan ulasan pelanggan sungguhan.";

export const testimonials: Testimonial[] = [
  {
    name: "Pelanggan Contoh 1",
    company: "Contoh Perusahaan A",
    quote:
      "Contoh testimonial untuk kebutuhan desain frontend. Layanan virtual office membantu citra bisnis kami.",
  },
  {
    name: "Pelanggan Contoh 2",
    company: "Contoh Perusahaan B",
    quote:
      "Contoh testimonial untuk kebutuhan desain frontend. Ruang coworking nyaman untuk tim kecil kami.",
  },
  {
    name: "Pelanggan Contoh 3",
    company: "Contoh Perusahaan C",
    quote:
      "Contoh testimonial untuk kebutuhan desain frontend. Meeting room rapi dan tim sangat membantu.",
  },
];

/* ------------------------------------------------------------------ */
/* Promotions (SAMPLE — bukan promo yang sedang berjalan)              */
/* ------------------------------------------------------------------ */

export const promoNotice =
  "Promo contoh untuk kebutuhan desain — bukan penawaran yang sedang berjalan.";

export const promotions: Promotion[] = [
  {
    badge: "Promo Contoh",
    title: "Diskon 20% Paket Virtual Office Tahunan",
    description:
      "Contoh penawaran untuk kebutuhan desain: hemat untuk komitmen 12 bulan.",
    period: "Periode contoh: 1–31 Des",
  },
  {
    badge: "Promo Contoh",
    title: "Gratis 2 Jam Meeting Room",
    description:
      "Contoh penawaran untuk kebutuhan desain: setiap aktivasi paket Business.",
    period: "Periode contoh: selama persediaan",
  },
  {
    badge: "Promo Contoh",
    title: "Trial Coworking 1 Hari",
    description:
      "Contoh penawaran untuk kebutuhan desain: coba hot desk sebelum berlangganan.",
    period: "Periode contoh: Senin–Jumat",
  },
];
