import { allFacilities, comparisonRows, generalFaqs, virtualOfficeFaqs, coworkingFaqs, meetingRoomFaqs, services, locations, serviceLocations, promotions, testimonials } from "../lib/data/mock-data.ts";

const baseUrl = process.env.CMS_URL ?? "http://localhost:3000";
const email = process.env.PAYLOAD_ADMIN_EMAIL ?? "admin@easyoffice.local";
const password = process.env.PAYLOAD_ADMIN_PASSWORD ?? "admin123";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${path} ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const login = await request("/api/users/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
const token = login.token;
const auth = { Authorization: `JWT ${token}` };

async function upsert(collection, slug, data) {
  const existing = await request(`/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, { headers: auth });
  const doc = existing.docs?.[0];
  if (doc) {
    return request(`/api/${collection}/${doc.id}`, { method: "PATCH", headers: auth, body: JSON.stringify(data) });
  }
  return request(`/api/${collection}`, { method: "POST", headers: auth, body: JSON.stringify(data) });
}

async function upsertBy(collection, field, value, data) {
  const existing = await request(`/api/${collection}?where[${field}][equals]=${encodeURIComponent(value)}&limit=1`, { headers: auth });
  const doc = existing.docs?.[0];
  if (doc) return request(`/api/${collection}/${doc.id}`, { method: "PATCH", headers: auth, body: JSON.stringify(data) });
  return request(`/api/${collection}`, { method: "POST", headers: auth, body: JSON.stringify(data) });
}

async function upsertComparison(key, data) {
  const serviceFilter = data.service ? `&where[service][equals]=${data.service}` : "&where[service][exists]=false";
  const existing = await request(`/api/comparison-rows?where[feature][equals]=${encodeURIComponent(data.feature)}${serviceFilter}&limit=1`, { headers: auth });
  const doc = existing.docs?.[0];
  if (doc) return request(`/api/comparison-rows/${doc.id}`, { method: "PATCH", headers: auth, body: JSON.stringify(data) });
  return request("/api/comparison-rows", { method: "POST", headers: auth, body: JSON.stringify(data) });
}

async function removeDuplicateDocs(collection, keyFor) {
  const result = await request(`/api/${collection}?limit=100&depth=1`, { headers: auth });
  const seen = new Set();
  for (const doc of [...(result.docs ?? [])].sort((a, b) => Number(a.id) - Number(b.id))) {
    const key = keyFor(doc);
    if (seen.has(key)) await request(`/api/${collection}/${doc.id}`, { method: "DELETE", headers: auth });
    else seen.add(key);
  }
}

async function mediaIdFromPath(path) {
  if (!path) return undefined;
  const filename = path.split("/").pop();
  if (!filename) return undefined;
  const result = await request(`/api/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1`, { headers: auth });
  return result.docs?.[0]?.id;
}

function pricingPayload(plan) {
  const priceText = String(plan.price ?? "").trim().toLowerCase();
  const numberText = priceText.replace(/rp|\s/g, "").replace(/\./g, "").replace(",", ".");
  const multiplier = /\b(jt|juta)\b/.test(priceText) ? 1_000_000 : /\b(rb|ribu)\b/.test(priceText) ? 1_000 : 1;
  const parsedPrice = Number.parseFloat(numberText.replace(/[^0-9.]/g, ""));
  const raw = Math.round((Number.isFinite(parsedPrice) ? parsedPrice : 0) * multiplier);
  return {
    name: plan.name,
    description: plan.description,
    price: Number(raw || 0),
    unit: plan.period ?? "/bulan",
    benefits: (plan.features ?? []).map((value) => ({ value })),
    discount: plan.discountPercent ? { active: true, percentage: plan.discountPercent } : { active: false },
  };
}

const facilityAdditions = {
  "virtual-office": [
    { icon: "wifi", title: "WiFi Cepat", description: "Internet stabil untuk kebutuhan kerja dan komunikasi bisnis." },
    { icon: "printer", title: "Print & Scan", description: "Fasilitas cetak dan pemindaian dokumen bisnis." },
    { icon: "car", title: "Parkir", description: "Area parkir yang memudahkan kunjungan klien dan tamu." },
  ],
  "coworking-space": [
    { icon: "car", title: "Parkir", description: "Area parkir yang mudah diakses untuk pengguna kantor." },
    { icon: "clock", title: "Akses Fleksibel", description: "Jam akses yang mendukung kebutuhan kerja harian." },
    { icon: "map-pin", title: "Lokasi Strategis", description: "Lokasi mudah dijangkau dari berbagai area kota." },
  ],
  "meeting-room": [
    { icon: "printer", title: "Print & Scan", description: "Mendukung kebutuhan dokumen selama meeting berlangsung." },
    { icon: "car", title: "Parkir", description: "Parkir tersedia untuk peserta meeting dan tamu." },
    { icon: "bell", title: "Resepsionis", description: "Tim resepsionis membantu menyambut dan mengarahkan tamu." },
  ],
};

function uniqueFacilities(serviceSlug, facilities) {
  const result = [];
  const seen = new Set();
  for (const facility of [...facilities, ...(facilityAdditions[serviceSlug] ?? [])]) {
    const key = `${String(facility.icon).toLowerCase()}-${String(facility.title).trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(facility);
  }
  return result.slice(0, 6);
}

const benefitItemsByService = {
  "virtual-office": [
    { icon: "wallet", title: "Hemat Biaya", description: "Menghemat biaya dibanding menyewa ruang kantor fisik dan membayar utilitas sendiri." },
    { icon: "laptop", title: "Fleksibilitas Kerja", description: "Tetap mendapatkan alamat bisnis profesional tanpa harus bekerja dari kantor setiap hari." },
    { icon: "briefcase", title: "Citra Profesional", description: "Gunakan alamat bisnis strategis untuk meningkatkan kepercayaan klien dan mitra." },
    { icon: "headset", title: "Dukungan Bisnis", description: "Dapatkan dukungan resepsionis dan layanan administrasi untuk operasional bisnis." },
    { icon: "map-pin", title: "Lokasi Strategis", description: "Alamat bisnis mudah dijangkau di pusat kota dan kawasan bisnis." },
    { icon: "presentation", title: "Akses Meeting Room", description: "Gunakan ruang meeting profesional saat perlu bertemu klien atau tim." },
  ],
  "coworking-space": [
    { icon: "wallet", title: "Biaya Fleksibel", description: "Bayar sesuai kebutuhan tanpa komitmen sewa ruang kantor jangka panjang." },
    { icon: "wifi", title: "Fasilitas Lengkap", description: "Nikmati internet cepat, area kerja nyaman, pantry, dan fasilitas pendukung." },
    { icon: "users", title: "Komunitas Profesional", description: "Bekerja berdampingan dengan profesional dan pelaku bisnis lain." },
    { icon: "clock", title: "Jam Operasional Luas", description: "Akses ruang kerja fleksibel sesuai kebutuhan aktivitas Anda." },
    { icon: "map-pin", title: "Lokasi Strategis", description: "Bekerja di lokasi pusat bisnis yang mudah dijangkau." },
    { icon: "headset", title: "Dukungan Harian", description: "Tim pendukung siap membantu kebutuhan operasional harian Anda." },
  ],
  "meeting-room": [
    { icon: "presentation", title: "Ruang Profesional", description: "Ruang meeting representatif untuk presentasi, wawancara, dan rapat bisnis." },
    { icon: "video", title: "Peralatan Modern", description: "Dilengkapi proyektor, layar presentasi, whiteboard, dan internet stabil." },
    { icon: "clock", title: "Pesan Per Jam", description: "Sewa fleksibel per jam sesuai kebutuhan meeting atau workshop." },
    { icon: "wallet", title: "Harga Terjangkau", description: "Lebih hemat dibanding menyewa ruang rapat permanen." },
    { icon: "map-pin", title: "Lokasi Mudah Dijangkau", description: "Alamat prestisius yang mudah ditemukan klien dan tim Anda." },
    { icon: "laptop", title: "Konektivitas Terjamin", description: "Wi-Fi cepat dan colokan listrik mendukung meeting tetap produktif." },
  ],
};

const serviceDocs = new Map();
await removeDuplicateDocs("faqs", (doc) => `${doc.service?.id ?? "global"}::${doc.question}`);
await removeDuplicateDocs("comparison-rows", (doc) => `${doc.service?.id ?? "global"}::${doc.feature}`);
for (const service of services) {
  const serviceImage = await mediaIdFromPath(service.image);
  const result = await upsert("services", service.slug, {
    title: service.title, slug: service.slug, shortTitle: service.shortTitle,
    description: service.description, intro: service.intro,
    benefits: service.benefits.map((value) => ({ value })),
    benefitsTitle: `Manfaat ${service.title} Untuk Bisnis Anda`,
    benefitsDescription: `Pahami lebih lanjut tentang pentingnya ${service.title.toLowerCase()} untuk keperluan bisnis Anda.`,
    benefitItems: benefitItemsByService[service.slug] ?? [],
    features: [...service.features, ...(service.slug === "coworking-space" ? ["Pantry dan area santai", "Akses fleksibel"] : service.slug === "meeting-room" ? ["Konsumsi rapat tersedia", "Dukungan teknis"] : [])].slice(0, service.slug === "virtual-office" ? 4 : 6).map((value) => ({ value })), icon: service.icon,
    ...(serviceImage ? { image: serviceImage } : {}), imageAlt: service.imageAlt,
    seo: { title: `${service.title} | EasyOffice`, description: `${service.title} profesional dari EasyOffice. ${service.description}`, canonicalUrl: `/layanan/${service.slug}`, noIndex: false, ...(serviceImage ? { ogImage: serviceImage } : {}) },
    isActive: true,
  });
  serviceDocs.set(service.slug, result.doc);
}

const cityDocs = new Map();
for (const city of locations) {
  const result = await upsert("cities", city.slug, {
    name: city.name, slug: city.slug, shortDescription: city.shortDescription,
    address: city.address, operatingHours: city.operatingHours, email: city.email,
    phone: city.phoneDisplay, whatsapp: city.whatsapp, latitude: city.latitude, longitude: city.longitude, isActive: true,
  });
  cityDocs.set(city.slug, result.doc);
}

for (const combo of serviceLocations) {
  const service = serviceDocs.get(combo.serviceSlug);
  const city = cityDocs.get(combo.locationSlug);
  if (!service || !city) continue;
  const offices = combo.offices?.length
    ? combo.offices
    : [{
        slug: combo.locationSlug,
        name: `EasyOffice ${locations.find((item) => item.slug === combo.locationSlug)?.name ?? combo.locationSlug}`,
        description: combo.tagline,
        address: locations.find((item) => item.slug === combo.locationSlug)?.address ?? "",
        operatingHours: locations.find((item) => item.slug === combo.locationSlug)?.operatingHours,
        phoneDisplay: locations.find((item) => item.slug === combo.locationSlug)?.phoneDisplay,
        whatsapp: combo.whatsapp ?? locations.find((item) => item.slug === combo.locationSlug)?.whatsapp,
      }];
  for (const office of offices) {
    const officeImage = await mediaIdFromPath(combo.image);
    const facilityImages = await Promise.all(combo.facilities.map(({ icon }) => mediaIdFromPath(`/images/unsplash/office-${String({ wifi: 12, door: 18, bell: 21, "map-pin": 27, printer: 30, coffee: 33, car: 35, clock: 37 }[icon] ?? 12).padStart(2, "0")}.webp`)));
    const galleryImages = await Promise.all(combo.gallery.map(({ src }) => mediaIdFromPath(src)));
    await upsert("service-offices", `${combo.serviceSlug}-${combo.locationSlug}-${office.slug}`, {
      name: office.name, slug: `${combo.serviceSlug}-${combo.locationSlug}-${office.slug}`,
      service: service.id, city: city.id, description: office.description,
      address: office.address, operatingHours: office.operatingHours, mapsUrl: office.mapsUrl ?? combo.mapsUrl, latitude: office.latitude ?? combo.latitude, longitude: office.longitude ?? combo.longitude,
      phone: office.phoneDisplay, whatsapp: office.whatsapp, whatsappNumbers: office.whatsapp ? [{ label: "Utama", number: office.whatsapp, active: true, priority: 0 }] : [], isActive: true,
      tagline: combo.tagline, startingPrice: combo.startingPrice, packages: combo.pricing.map(pricingPayload), ...(officeImage ? { image: officeImage } : {}), imageAlt: combo.imageAlt,
      facilities: uniqueFacilities(combo.serviceSlug, combo.facilities).map(({ icon, title, description }) => ({
        icon,
        title,
        description,
        ...(facilityImages[combo.facilities.findIndex((item) => item.icon === icon)] ? { image: facilityImages[combo.facilities.findIndex((item) => item.icon === icon)] } : {}),
        imageAlt: title,
      })),
      seo: { title: `${combo.serviceSlug.replaceAll("-", " ")} ${office.name} | EasyOffice`, description: `${combo.tagline} ${office.address}`, canonicalUrl: `/layanan/${combo.serviceSlug}/${combo.locationSlug}`, noIndex: false, ...(officeImage ? { ogImage: officeImage } : {}) },
      gallery: combo.gallery.map(({ alt }, index) => ({ ...(galleryImages[index] ? { src: galleryImages[index] } : {}), alt })),
    });
  }
}

for (const promotion of promotions) {
  const relatedService = services.find((service) => service.slug === promotion.serviceSlug);
  const promotionImage = await mediaIdFromPath(relatedService?.image);
  await upsertBy("promotions", "title", promotion.title, { ...promotion, ...(relatedService ? { service: serviceDocs.get(relatedService.slug)?.id } : {}), ...(promotionImage ? { image: promotionImage } : {}), isActive: true });
}
for (const testimonial of testimonials) await upsertBy("testimonials", "name", testimonial.name, { ...testimonial, isActive: true });
for (const [sortOrder, row] of comparisonRows.entries()) {
  await upsertComparison(`global-${row.feature}`, { feature: row.feature, easyoffice: row.easyoffice, typical: row.typical, sortOrder, isActive: true });
  for (const service of services) await upsertComparison(`${service.slug}-${row.feature}`, { feature: row.feature, service: serviceDocs.get(service.slug)?.id, easyoffice: row.easyoffice, typical: row.typical, sortOrder, isActive: true });
}

for (const [sortOrder, facility] of allFacilities.entries()) {
  const image = await mediaIdFromPath(facility.image);
  await upsertBy("homepage-facilities", "title", facility.title, {
    title: facility.title, description: facility.description, icon: facility.icon,
    ...(image ? { image } : {}), imageAlt: facility.imageAlt, sortOrder, isActive: true,
  });
}

for (const [sortOrder, faq] of generalFaqs.entries()) {
  await upsertBy("faqs", "question", faq.question, { question: faq.question, answer: faq.answer, category: "Umum", sortOrder, isActive: true });
}
for (const service of services) {
  const serviceFaqs = service.slug === "virtual-office" ? virtualOfficeFaqs : service.slug === "coworking-space" ? coworkingFaqs : meetingRoomFaqs;
  for (const [sortOrder, faq] of serviceFaqs.entries()) {
    await upsertBy("faqs", "question", `${service.slug}-${faq.question}`, { question: faq.question, answer: faq.answer, category: service.title, service: serviceDocs.get(service.slug)?.id, sortOrder, isActive: true });
  }
}
await removeDuplicateDocs("faqs", (doc) => `${doc.service?.id ?? "global"}::${doc.question}`);
await removeDuplicateDocs("comparison-rows", (doc) => `${doc.service?.id ?? "global"}::${doc.feature}`);

await request("/api/globals/site-settings", {
  method: "POST", headers: auth,
  body: JSON.stringify({
    siteName: "EasyOffice",
    tagline: "Solusi Ruang Kerja Profesional untuk Bisnis Anda",
     defaultWhatsapp: "6281234567890",
     primaryWhatsapp: "6281234567890",
     whatsappNumbers: [
       { label: "Sales Utama", number: "6281234567890", active: true, priority: 0 },
       { label: "Sales 2", number: "6281234567891", active: true, priority: 1 },
     ],
    email: "halo@easyoffice.id",
    phone: "+62 812 3456 7890",
    operatingHours: "Senin–Jumat, 08.00–17.00 WIB",
    headerCtaLabel: "Hubungi Kami",
    headerCtaMessage: "Halo EasyOffice, saya ingin bertanya tentang layanan Anda.",
    ...(await mediaIdFromPath("/images/logo-EO.png") ? { logo: await mediaIdFromPath("/images/logo-EO.png") } : {}),
    navigation: [
      { label: "Beranda", href: "/" },
      { label: "Layanan", children: [
        { label: "Virtual Office", href: "/layanan/virtual-office", description: "Alamat bisnis profesional" },
        { label: "Coworking Space", href: "/layanan/coworking-space", description: "Ruang kerja fleksibel" },
        { label: "Meeting Room", href: "/layanan/meeting-room", description: "Ruang meeting per jam" },
      ] },
      { label: "Promo", href: "/promo" }, { label: "Tentang Kami", href: "/tentang-kami" }, { label: "Kontak", href: "/kontak" },
    ],
    footerServicesTitle: "Layanan Kami", footerCompanyTitle: "Perusahaan", footerContactTitle: "Hubungi Kami",
    footerDescription: "Solusi ruang kerja profesional untuk bisnis Anda. Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi.",
    copyrightText: "© 2026 EasyOffice. Seluruh hak cipta dilindungi.",
    defaultSeoTitle: "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
    defaultSeoDescription: "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi.",
    homepageHeroTitle: "Solusi Ruang Kerja Profesional untuk Bisnis Anda",
    homepageHeroDescription: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional.",
      statsBanner: [
       { value: "13.000+", label: "Bisnis Terlayani" }, { value: "5 Menit", label: "Respon WhatsApp" },
       { value: "4.9 ★", label: "Rating Google (700+)" }, { value: "100%", label: "Legal & Resmi" },
     ],
    howItWorks: [
      { title: "Pilih Layanan & Lokasi", description: "Tentukan kebutuhan bisnis Anda — Virtual Office, Coworking Space, atau Meeting Room — di lokasi terdekat.", sortOrder: 0 },
      { title: "Hubungi via WhatsApp", description: "Tim kami membantu menjelaskan paket, harga, dan ketersediaan fasilitas sesuai kebutuhan Anda.", sortOrder: 1 },
      { title: "Konsultasi & Survei", description: "Jadwalkan kunjungan atau survei lokasi untuk memastikan fasilitas sesuai ekspektasi bisnis Anda.", sortOrder: 2 },
      { title: "Mulai Gunakan", description: "Proses selesai — alamat bisnis, ruang kerja, dan dukungan administrasi siap digunakan.", sortOrder: 3 },
    ],
  }),
});

const aboutHeroImage = await mediaIdFromPath("/images/unsplash/office-01.webp");
const aboutStoryImage = await mediaIdFromPath("/images/unsplash/office-02.webp");
await request("/api/globals/about-page", {
  method: "POST", headers: auth,
  body: JSON.stringify({
    eyebrow: "Tentang EasyOffice", heroTitle: "Memudahkan Bisnis Indonesia", heroTitleAccent: "Tampil Profesional.",
    heroDescription: "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi — membantu bisnis tampil profesional tanpa beban operasional kantor fisik.",
    ...(aboutHeroImage ? { heroImage: aboutHeroImage } : {}), heroImageAlt: "Ruang kerja EasyOffice", heroBadgeTitle: "Tim Profesional", heroBadgeText: "Siap Membantu Anda", heroRating: "4.9 / 5.0", heroRatingText: "Rating Google (700+)", heroHighlights: [{ value: "Alamat Bisnis Prestisius" }, { value: "Lokasi Strategis" }],
    storyEyebrow: "Cerita Kami", storyTitle: "Lahir dari kebutuhan akan ruang kerja", storyTitleAccent: "yang profesional.", storyDescription: "EasyOffice dibangun untuk membantu bisnis tampil profesional tanpa harus menanggung beban biaya dan operasional kantor fisik. Kami percaya setiap bisnis berhak memiliki alamat dan ruang kerja yang kredibel.", ...(aboutStoryImage ? { storyImage: aboutStoryImage } : {}), storyImageAlt: "Tim EasyOffice", storyBadgeTitle: "Berdiri 2023", storyBadgeText: "Melayani Bisnis Indonesia", storyHighlights: [{ value: "Alamat prestisius di pusat kota" }, { value: "Tim responsif yang mudah dihubungi" }, { value: "Paket fleksibel untuk setiap skala bisnis" }],
    stats: [{ value: "100%", label: "Legal & Resmi" }, { value: "5 Menit", label: "Respon WhatsApp" }, { value: "4.9/5", label: "Rating" }, { value: "13.000+", label: "Bisnis Terlayani" }], valuesEyebrow: "Nilai-Nilai Kami", valuesTitle: "Prinsip yang menjadi fondasi kerja kami.", valuesDescription: "Setiap layanan, biaya, dan komunikasi kami dipandu oleh nilai-nilai ini.", values: [{ icon: "award", title: "Profesional", description: "Layanan dan fasilitas setara standar kantor korporat untuk setiap skala bisnis." }, { icon: "handshake", title: "Terpercaya", description: "Proses transparan dan tim responsif yang mendampingi kebutuhan administrasi usaha Anda." }, { icon: "map-pin", title: "Terjangkau", description: "Lokasi-lokasi strategis dengan paket fleksibel yang menyesuaikan anggaran bisnis." }],
  }),
});

await upsertBy("homepage-layout", "name", "Homepage", { name: "Homepage", layout: { content: [
  { type: "Hero", props: { title: "Solusi Ruang Kerja Profesional untuk Bisnis Anda", description: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional." } },
  ...["stats", "facilities", "promotions", "services", "howItWorks", "comparison", "testimonials", "whatsapp"].map((section) => ({ type: "HomepageSection", props: { section } })),
] }, status: "published", isActive: true });

console.log(`Seeded ${services.length} services, ${locations.length} cities, and service offices.`);
