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
  email: "halo@easyoffice.id",
  phoneDisplay: "+62 812 3456 7890",
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
    address: "Jl. Ir. H. Juanda No. 88, Dago, Bandung 40135",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    email: "bandung@easyoffice.id",
    phoneDisplay: "+62 812 3456 7890",
    whatsapp: "6281234567890",
  },
  {
    slug: "jakarta",
    name: "Jakarta",
    shortDescription:
      "Kantor representatif di ibu kota untuk menjangkau klien dan mitra bisnis.",
    address: "Jl. Jend. Sudirman Kav. 52, Setiabudi, Jakarta Selatan 12190",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    email: "jakarta@easyoffice.id",
    phoneDisplay: "+62 812 3456 7891",
    whatsapp: "6281234567891",
  },
  {
    slug: "bekasi",
    name: "Bekasi",
    shortDescription:
      "Alternatif strategis dengan biaya efisien di kawasan penyangga Jakarta.",
    address: "Jl. Ahmad Yani No. 67, Bekasi Selatan, Bekasi 17141",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    email: "bekasi@easyoffice.id",
    phoneDisplay: "+62 812 3456 7892",
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
    image:
      "/images/unsplash/office-01.webp",
    imageAlt: "Ruang kantor profesional untuk layanan virtual office",
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
    image:
      "/images/unsplash/office-02.webp",
    imageAlt: "Area coworking space yang nyaman dan produktif",
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
    image:
      "/images/unsplash/office-03.webp",
    imageAlt: "Ruang meeting profesional dengan meja dan kursi rapat",
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

export const virtualOfficeFaqs: Faq[] = [
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

export const coworkingFaqs: Faq[] = [
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

export const meetingRoomFaqs: Faq[] = [
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
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export const PRICE_NOTE =
  "Harga dapat berubah sewaktu-waktu. Hubungi kami untuk penawaran terbaru.";

function plan(
  name: string,
  price: string,
  period: string,
  features: string[],
): PricingPlan {
  return {
    name,
    price,
    period,
    features,
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
    image:
      "/images/unsplash/office-04.webp",
    imageAlt: "Kantor virtual office EasyOffice di Bandung",
    gallery: [
      {
        src: "/images/unsplash/office-05.webp",
        alt: "Area resepsionis profesional dan meja tamu",
      },
      {
        src: "/images/unsplash/office-06.webp",
        alt: "Suasana ruang kerja kantor modern yang produktif",
      },
      {
        src: "/images/unsplash/office-07.webp",
        alt: "Bilik meja kerja profesional dan komputer kantor",
      },
    ],
    pricing: [
      plan("Basic", "Rp 350 rb", "/bulan", [
        "Alamat bisnis",
        "Penanganan surat",
        "Pemberitahuan via email",
      ]),
      {
        ...plan("Business", "Rp 550.000", "/bulan", [
          "Semua fitur Basic",
          "Layanan resepsionis",
          "2 jam meeting room / bulan",
          "Nomor telepon khusus",
        ]),
        description: "Paket kantor virtual untuk bisnis yang membutuhkan alamat dan layanan administrasi profesional.",
        discountPercent: 20,
      },
      plan("Premium", "Rp 1,2 jt", "/bulan", [
        "Semua fitur Business",
        "8 jam meeting room / bulan",
        "Akses coworking 4 hari / bulan",
        "Prioritas dukungan",
      ]),
    ],
    facilities: pickFacilities("map-pin", "bell", "printer", "wifi", "door", "coffee"),
    offices: [
      {
        slug: "asia-afrika",
        name: "EasyOffice Asia Afrika",
        description: "Kantor virtual di kawasan Asia Afrika, Bandung, dengan alamat bisnis strategis dan layanan surat untuk mendukung citra profesional perusahaan Anda.",
        address: "Jl. Asia Afrika No. 123, Sumur Bandung, Bandung 40113",
        operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
        phoneDisplay: "+62 812 3456 7890",
        whatsapp: "6281234567890",
      },
      {
        slug: "dago",
        name: "EasyOffice Dago",
        description: "Kantor virtual di kawasan Dago, Bandung, dengan alamat bisnis representatif dan layanan kantor yang mendukung aktivitas bisnis Anda.",
        address: "Jl. Ir. H. Juanda No. 88, Dago, Bandung 40135",
        operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
        phoneDisplay: "+62 812 3456 7893",
        whatsapp: "6281234567893",
      },
    ],
  },
  {
    serviceSlug: "virtual-office",
    locationSlug: "jakarta",
    tagline: "Alamat prestisius ibu kota untuk jangkauan bisnis nasional.",
    startingPrice: "Rp 450 rb",
    image:
      "/images/unsplash/office-08.webp",
    imageAlt: "Kantor virtual office EasyOffice di Jakarta",
    gallery: [
      {
        src: "/images/unsplash/office-09.webp",
        alt: "Area resepsionis dan front office representatif",
      },
      {
        src: "/images/unsplash/office-10.webp",
        alt: "Sudut fasilitas cetak dan mesin fotokopi kantor",
      },
      {
        src: "/images/unsplash/office-11.webp",
        alt: "Area lounge santai untuk istirahat dan diskusi",
      },
    ],
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
      ]),
      plan("Premium", "Rp 1,6 jt", "/bulan", [
        "Semua fitur Business",
        "12 jam meeting room / bulan",
        "Akses coworking 8 hari / bulan",
        "Prioritas dukungan",
      ]),
    ],
    facilities: pickFacilities("map-pin", "bell", "printer", "wifi", "door", "coffee", "car", "clock"),
  },
  {
    serviceSlug: "virtual-office",
    locationSlug: "bekasi",
    tagline: "Solusi hemat di kawasan penyangga Jakarta.",
    startingPrice: "Rp 300 rb",
    image:
      "/images/unsplash/office-12.webp",
    imageAlt: "Kantor virtual office EasyOffice di Bekasi",
    gallery: [
      {
        src: "/images/unsplash/office-13.webp",
        alt: "Meja resepsionis dan penyambutan tamu profesional",
      },
      {
        src: "/images/unsplash/office-14.webp",
        alt: "Fasilitas loker surat dan penanganan paket",
      },
      {
        src: "/images/unsplash/office-15.webp",
        alt: "Area pantry dengan perlengkapan kopi dan teh",
      },
    ],
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
      ]),
      plan("Premium", "Rp 1 jt", "/bulan", [
        "Semua fitur Business",
        "6 jam meeting room / bulan",
        "Akses coworking 4 hari / bulan",
        "Prioritas dukungan",
      ]),
    ],
    facilities: pickFacilities("map-pin", "bell", "printer", "wifi", "door"),
  },
  {
    serviceSlug: "coworking-space",
    locationSlug: "bandung",
    tagline: "Ruang kerja fleksibel di jantung kota Bandung.",
    startingPrice: "Rp 75 rb",
    image:
      "/images/unsplash/office-16.webp",
    imageAlt: "Coworking space EasyOffice di Bandung",
    gallery: [
      {
        src: "/images/unsplash/office-17.webp",
        alt: "Area hot desk kerja bersama yang terang dan luas",
      },
      {
        src: "/images/unsplash/office-18.webp",
        alt: "Meja kerja dedicated dan fasilitas stopkontak individual",
      },
      {
        src: "/images/unsplash/office-19.webp",
        alt: "Fasilitas mesin cetak dan scanner dokumen cepat",
      },
    ],
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
      ]),
      plan("Dedicated", "Rp 1,5 jt", "/bulan", [
        "Meja khusus permanen",
        "Locker pribadi",
        "8 jam meeting room / bulan",
        "Alamat surat",
      ]),
    ],
    facilities: pickFacilities("wifi", "coffee", "printer", "door", "clock", "car"),
  },
  {
    serviceSlug: "coworking-space",
    locationSlug: "jakarta",
    tagline: "Ruang kerja fleksibel di jantung bisnis Jakarta.",
    startingPrice: "Rp 95 rb",
    image:
      "/images/unsplash/office-20.webp",
    imageAlt: "Coworking space EasyOffice di Jakarta",
    gallery: [
      {
        src: "/images/unsplash/office-21.webp",
        alt: "Area hot desk modern dengan koneksi Wi-Fi super cepat",
      },
      {
        src: "/images/unsplash/office-22.webp",
        alt: "Sudut diskusi santai dan area kolaborasi terbuka",
      },
      {
        src: "/images/unsplash/office-07.webp",
        alt: "Pantry lengkap dengan mesin espresso dan air minum",
      },
    ],
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
      ]),
      plan("Dedicated", "Rp 1,9 jt", "/bulan", [
        "Meja khusus permanen",
        "Locker pribadi",
        "8 jam meeting room / bulan",
        "Alamat surat",
      ]),
    ],
    facilities: pickFacilities("wifi", "coffee", "printer", "door", "clock", "car"),
  },
  {
    serviceSlug: "coworking-space",
    locationSlug: "bekasi",
    tagline: "Ruang kerja hemat di kawasan penyangga Jakarta.",
    startingPrice: "Rp 60 rb",
    image:
      "/images/unsplash/office-23.webp",
    imageAlt: "Coworking space EasyOffice di Bekasi",
    gallery: [
      {
        src: "/images/unsplash/office-24.webp",
        alt: "Ruang kerja bersama yang ergonomis dan nyaman",
      },
      {
        src: "/images/unsplash/office-25.webp",
        alt: "Area diskusi tim dan pojok santai",
      },
      {
        src: "/images/unsplash/office-09.webp",
        alt: "Fasilitas loker pribadi dan area cetak dokumen",
      },
    ],
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
      ]),
      plan("Dedicated", "Rp 1,2 jt", "/bulan", [
        "Meja khusus permanen",
        "Locker pribadi",
        "8 jam meeting room / bulan",
        "Alamat surat",
      ]),
    ],
    facilities: pickFacilities("wifi", "coffee", "printer", "door"),
  },
  {
    serviceSlug: "meeting-room",
    locationSlug: "bandung",
    tagline: "Ruang meeting profesional dan lengkap di Bandung.",
    startingPrice: "Rp 150 rb",
    image:
      "/images/unsplash/office-26.webp",
    imageAlt: "Meeting room EasyOffice di Bandung",
    gallery: [
      {
        src: "/images/unsplash/office-27.webp",
        alt: "Ruang rapat dilengkapi layar proyektor dan white board",
      },
      {
        src: "/images/unsplash/office-28.webp",
        alt: "Meja rapat besar dengan stopkontak di setiap kursi",
      },
      {
        src: "/images/unsplash/office-29.webp",
        alt: "Peralatan audio video konferensi online siap pakai",
      },
    ],
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
      ]),
      plan("Large", "Rp 450 rb", "/jam", [
        "Kapasitas hingga 20 orang",
        "Sistem audio-video",
        "Catering tersedia",
        "Asisten acara",
      ]),
    ],
    facilities: pickFacilities("door", "wifi", "coffee", "printer", "car", "clock"),
  },
  {
    serviceSlug: "meeting-room",
    locationSlug: "jakarta",
    tagline: "Ruang meeting profesional dan lengkap di Jakarta.",
    startingPrice: "Rp 200 rb",
    image:
      "/images/unsplash/office-30.webp",
    imageAlt: "Meeting room EasyOffice di Jakarta",
    gallery: [
      {
        src: "/images/unsplash/office-31.webp",
        alt: "Ruang meeting berkapasitas besar dengan pencahayaan optimal",
      },
      {
        src: "/images/unsplash/office-32.webp",
        alt: "Fasilitas proyektor high-definition dan flipchart",
      },
      {
        src: "/images/unsplash/office-33.webp",
        alt: "Layanan penyajian konsumsi dan snack rapat",
      },
    ],
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
      ]),
      plan("Large", "Rp 600 rb", "/jam", [
        "Kapasitas hingga 20 orang",
        "Sistem audio-video",
        "Catering tersedia",
        "Asisten acara",
      ]),
    ],
    facilities: pickFacilities("door", "wifi", "coffee", "printer", "car", "clock"),
  },
  {
    serviceSlug: "meeting-room",
    locationSlug: "bekasi",
    tagline: "Ruang meeting profesional dan lengkap di Bekasi.",
    startingPrice: "Rp 120 rb",
    image:
      "/images/unsplash/office-34.webp",
    imageAlt: "Meeting room EasyOffice di Bekasi",
    gallery: [
      {
        src: "/images/unsplash/office-35.webp",
        alt: "Ruang rapat eksekutif dengan peredam suara",
      },
      {
        src: "/images/unsplash/office-36.webp",
        alt: "Peralatan presentasi dan koneksi internet stabil",
      },
      {
        src: "/images/unsplash/office-37.webp",
        alt: "Area penyambutan tamu khusus ruang meeting",
      },
    ],
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
      ]),
      plan("Large", "Rp 350 rb", "/jam", [
        "Kapasitas hingga 20 orang",
        "Sistem audio-video",
        "Catering tersedia",
        "Asisten acara",
      ]),
    ],
    facilities: pickFacilities("door", "wifi", "coffee", "car"),
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
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const testimonials: Testimonial[] = [
  {
    name: "Rina Prasetyo",
    company: "Founder, Konsultan Pajak Rina & Partners",
    quote:
      "Sejak pakai Virtual Office EasyOffice, klien langsung percaya di telepon pertama — alamat Sudirman-nya bikin kami terlihat jauh lebih matang dari modal sebenarnya.",
  },
  {
    name: "Andi Wijaya",
    company: "CTO, Startup Logistik Nusantara",
    quote:
      "Tim engineering kami sewa dedicated desk di sini. Internetnya kencang, rapat cepat beres di meeting room, dan biaya sewa kantor penuh yang kami hemat bisa dipakai untuk iterasi produk.",
  },
  {
    name: "Dewi Lestari",
    company: "Marketing Manager, Brand F&B Lokal",
    quote:
      "Sering booking meeting room untuk presentasi klien. Prosesnya tinggal chat WhatsApp, dan resepsionisnya sigap menyambut tamu kami — profesional sekali.",
  },
  {
    name: "Budi Hartono",
    company: "Direktur, Konsultan Sipil Bumi Karya",
    quote:
      "Kantor virtual di Bandung ini bikin legalitas usaha kami langsung beres. Surat dan paket selalu diberitahukan, jadi tidak ada yang terlewat walau kami jarang ke lokasi.",
  },
  {
    name: "Sinta Dewi",
    company: "Freelance Designer",
    quote:
      "Hot desk coworking-nya nyaman untuk kerja seharian. Ada kopi gratis, rapat pun tidak perlu cari tempat lagi — cocok banget untuk profesional solo seperti saya.",
  },
  {
    name: "Hendra Gunawan",
    company: "Procurement Lead, Distributor Elektronik",
    quote:
      "Kami rutin pakai meeting room untuk review supplier. Kapasitas pas, proyektor dan whiteboard siap pakai, dan tim teknisnya responsif kalau butuh bantuan.",
  },
];

/* ------------------------------------------------------------------ */
/* Promotions                                                          */
/* ------------------------------------------------------------------ */

export const promotions: Promotion[] = [
  {
    badge: "Terbatas",
    title: "Diskon 20% Paket Virtual Office Tahunan",
    description:
      "Hemat 20% untuk komitmen 12 bulan di seluruh lokasi EasyOffice.",
    period: "Berlaku s.d. 31 Des",
  },
  {
    badge: "Terbatas",
    title: "Gratis 2 Jam Meeting Room",
    description:
      "Dapatkan tambahan 2 jam meeting room setelah aktivasi paket Business.",
    period: "Selama kuota tersedia",
  },
  {
    badge: "Trial",
    title: "Coba Coworking 1 Hari Gratis",
    description:
      "Nikmati hot desk gratis satu hari kerja sebelum memilih paket bulanan.",
    period: "Senin–Jumat",
  },
];

export const comparisonRows: ComparisonRow[] = [
  { feature: "Alamat bisnis profesional", easyoffice: true, typical: false },
  { feature: "Ruang meeting di lokasi", easyoffice: true, typical: false },
  { feature: "Layanan resepsionis", easyoffice: true, typical: false },
  { feature: "Penanganan surat dan paket", easyoffice: true, typical: true },
  { feature: "Akses coworking", easyoffice: true, typical: false },
  { feature: "Paket fleksibel bulanan", easyoffice: true, typical: true },
];
