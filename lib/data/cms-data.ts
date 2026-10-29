import type { ComparisonRow, ComparisonStatus, Faq, Facility, Location, Office, Promotion, Service, ServiceLocation, Testimonial } from "@/types";
import { routedWhatsappNumber } from "@/lib/whatsapp";
import { cache } from "react";
import crypto from "node:crypto";
import { normalizeMediaUrl } from "@/lib/media";

type PayloadList<T> = { docs?: T[] };

const apiBase = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
const cmsCache = { next: { revalidate: 60 } } as const;
function mediaUrl(value: unknown): string | undefined {
  if (typeof value === "string") return normalizeMediaUrl(value);
  if (value && typeof value === "object" && typeof (value as { url?: unknown }).url === "string") return normalizeMediaUrl((value as { url: string }).url);
  return undefined;
}

export type HomepageLayoutData = { content?: Array<{ type?: string; props?: Record<string, unknown> }>; root?: Record<string, unknown> };
export type PublishedPuckPage = { id?: string | number; name?: string; route?: string; seoTitle?: string; seoDescription?: string; layout?: HomepageLayoutData };

function normalizeLayout(value: unknown): unknown {
  if (typeof value === "string") return normalizeMediaUrl(value);
  if (Array.isArray(value)) return value.map(normalizeLayout);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeLayout(item)]));
  return value;
}

async function payloadList<T>(collection: string): Promise<T[]> {
    const response = await fetch(`${apiBase}/api/${collection}?limit=100&where[isActive][equals]=true`, {
      headers: { Accept: "application/json" },
      ...cmsCache,
    });
    if (!response.ok) throw new Error(`CMS request failed: ${collection} (${response.status})`);
    const data = (await response.json()) as PayloadList<T>;
    if (!Array.isArray(data.docs)) throw new Error(`CMS returned no documents: ${collection}`);
    return data.docs;
}

export const getCmsServices = cache(async function getCmsServices(): Promise<Service[]> {
  const docs = await payloadList<Partial<Service>>("services");
  if (!docs.length) throw new Error("No services configured in CMS");
  const preferredOrder = ["virtual-office", "coworking-space", "meeting-room", "private-office"];
  return docs.map((doc) => ({
    ...doc,
    slug: doc.slug ?? "",
    title: doc.title ?? "",
    shortTitle: doc.shortTitle ?? doc.title ?? "",
    description: doc.description ?? "",
    intro: doc.intro ?? "",
    benefits: Array.isArray(doc.manfaatItems) ? doc.manfaatItems.map((item: { title?: string }) => item.title ?? "").filter(Boolean) : [],
    benefitsTitle: doc.manfaatTitle ?? "",
    benefitsDescription: doc.manfaatDescription ?? "",
    keunggulanItems: Array.isArray(doc.keunggulanItems) ? doc.keunggulanItems.map((item: { icon?: string; title?: string; description?: string }) => ({ icon: item.icon ?? "sparkles", title: item.title ?? "", description: item.description ?? "" })) : [],
    manfaatItems: Array.isArray(doc.manfaatItems) ? doc.manfaatItems.map((item: { icon?: string; title?: string; description?: string }) => ({ icon: item.icon ?? "sparkles", title: item.title ?? "", description: item.description ?? "" })) : [],
    features: [],
    icon: doc.icon ?? "briefcase",
    href: `/layanan/${doc.slug ?? ""}`,
    image: mediaUrl(doc.image) ?? "",
    imageAlt: doc.imageAlt ?? doc.title ?? "",
    seo: doc.seo ? { ...(doc.seo as Record<string, unknown>), ogImage: mediaUrl((doc.seo as Record<string, unknown>).ogImage) } : undefined,
  })).sort((a, b) => {
    const aPreferred = preferredOrder.indexOf(a.slug);
    const bPreferred = preferredOrder.indexOf(b.slug);
    if (aPreferred !== -1 || bPreferred !== -1) return (aPreferred === -1 ? 1000 : aPreferred) - (bPreferred === -1 ? 1000 : bPreferred);
    return ((a as Service & { sortOrder?: number }).sortOrder ?? 9999) - ((b as Service & { sortOrder?: number }).sortOrder ?? 9999);
  });
});

export const getCmsLocations = cache(async function getCmsLocations(): Promise<Location[]> {
  const response = await fetch(`${apiBase}/api/kantor?limit=100&where[aktif][equals]=true`, { headers: { Accept: "application/json" }, ...cmsCache });
  if (!response.ok) throw new Error(`CMS request failed: kantor (${response.status})`);
  const data = (await response.json()) as PayloadList<Record<string, unknown>>;
  const docs = data.docs ?? [];
  if (!docs.length) throw new Error("No locations configured in CMS");
  return docs.map((doc) => ({
    slug: String(doc.slug ?? "").replace(/^easyoffice-/, ""),
    name: String(doc.kota ?? doc.nama ?? ""),
    card: { title: String(doc.nama ?? ""), description: String(doc.deskripsi ?? ""), image: mediaUrl(doc.foto), imageAlt: String(doc.altFoto ?? doc.nama ?? "") },
    address: String(doc.alamat ?? ""), operatingHours: String(doc.jamOperasional ?? ""), email: String(doc.email ?? ""), phoneDisplay: String(doc.telepon ?? ""), whatsappNumbers: Array.isArray(doc.whatsappNumbers) ? doc.whatsappNumbers as Office["whatsappNumbers"] : undefined, mapsUrl: String(doc.linkGoogleMaps ?? ""), latitude: typeof doc.latitude === "number" ? doc.latitude : undefined, longitude: typeof doc.longitude === "number" ? doc.longitude : undefined,
  }));
});

export const getCmsPromotions = cache(async function getCmsPromotions(): Promise<Promotion[]> {
  const docs = await payloadList<Partial<Promotion> & { service?: unknown }>("promotions");
  if (!docs.length) return [];
  return docs.map((doc) => {
    const service = doc.service && typeof doc.service === "object" ? doc.service as Record<string, unknown> : undefined;
    const title = String(doc.title ?? "");
    const inferredService = service?.slug ? String(service.slug) : /coworking/i.test(title) ? "coworking-space" : /meeting room/i.test(title) ? "meeting-room" : /virtual office/i.test(title) ? "virtual-office" : undefined;
    const badge = String(doc.badge ?? "promo").toLowerCase();
    return { badge: badge === "trial" || badge === "diskon" ? badge : "promo", title, description: doc.description ?? "", period: doc.period ?? "", image: mediaUrl(doc.image), serviceSlug: inferredService };
  });
});

export const getCmsTestimonials = cache(async function getCmsTestimonials(): Promise<Testimonial[]> {
  const docs = await payloadList<Partial<Testimonial>>("testimonials");
  if (!docs.length) return [];
  return docs.map((doc) => ({ id: doc.id, name: doc.name ?? "", company: doc.company ?? "", quote: doc.quote ?? "" }));
});

export type CmsPartner = { id?: string | number; name: string; logoUrl?: string; logoAlt?: string; href?: string; sortOrder?: number };

export const getCmsPartners = cache(async function getCmsPartners(): Promise<CmsPartner[]> {
  const response = await fetch(`${apiBase}/api/partners?limit=100&where[isActive][equals]=true`, {
    headers: { Accept: "application/json" },
    ...cmsCache,
  }).catch(() => null);
  // The collection can be absent on older deployments until its schema migration is applied.
  if (!response?.ok) return [];
  const result = await response.json() as PayloadList<{
    id?: string | number;
    name?: string;
    logo?: unknown;
    logoAlt?: string;
    href?: string;
    sortOrder?: number;
  }>;
  const docs = result.docs ?? [];
  return docs
    .filter((doc) => doc.name && mediaUrl(doc.logo))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((doc) => ({
      id: doc.id,
      name: doc.name!,
      logoUrl: mediaUrl(doc.logo),
      logoAlt: doc.logoAlt || doc.name,
      href: doc.href || undefined,
      sortOrder: doc.sortOrder ?? 0,
    }));
});

export const getCmsServiceLocations = cache(async function getCmsServiceLocations(): Promise<ServiceLocation[]> {
  const response = await fetch(`${apiBase}/api/layanan-kantor?limit=100&depth=2&where[aktif][equals]=true`, { headers: { Accept: "application/json" }, ...cmsCache });
  if (!response.ok) throw new Error(`CMS request failed: layanan-kantor (${response.status})`);
  const data = (await response.json()) as PayloadList<Record<string, unknown>>;
  const docs = data.docs ?? [];
  if (!docs.length) throw new Error("No service offices configured in CMS");
  return docs.map((doc) => {
    const service = doc.layanan && typeof doc.layanan === "object" ? doc.layanan as Record<string, unknown> : {};
    const office = doc.kantor && typeof doc.kantor === "object" ? doc.kantor as Record<string, unknown> : {};
    const serviceSlug = String(service.slug ?? "");
    const locationSlug = String(office.slug ?? "").replace(/^easyoffice-/, "") || String(office.kota ?? "").toLowerCase();
    const packages = Array.isArray(doc.paketHarga) ? doc.paketHarga.map((plan: Record<string, unknown>) => ({
      name: String(plan.name ?? ""),
      description: typeof plan.description === "string" ? plan.description : undefined,
      price: typeof plan.price === "number" ? `Rp ${new Intl.NumberFormat("id-ID").format(plan.price)}` : (String(plan.price ?? "").startsWith("Rp") ? String(plan.price) : `Rp ${String(plan.price ?? "")}`),
      period: String(plan.unit ?? "/bulan"),
      features: Array.isArray(plan.benefits) ? plan.benefits.map((benefit: string | { value?: string }) => typeof benefit === "string" ? benefit : String(benefit.value ?? "")) : [],
      discountPercent: typeof (plan.discount as Record<string, unknown> | undefined)?.percentage === "number" ? (plan.discount as Record<string, number>).percentage : undefined,
      ctaLabel: "Hubungi via WhatsApp",
    })) : [];
    const numbers = Array.isArray(office.whatsappNumbers) ? office.whatsappNumbers as Office["whatsappNumbers"] : undefined;
    const offices = [{ slug: locationSlug, name: String(office.nama ?? office.kota ?? ""), description: String(office.deskripsi ?? ""), address: String(office.alamat ?? ""), operatingHours: String(office.jamOperasional ?? ""), email: String(office.email ?? ""), phoneDisplay: String(office.telepon ?? ""), whatsappNumbers: numbers, mapsUrl: String(office.linkGoogleMaps ?? ""), latitude: typeof office.latitude === "number" ? office.latitude : undefined, longitude: typeof office.longitude === "number" ? office.longitude : undefined }] as Office[];
    const gallery = Array.isArray(doc.galeri) ? doc.galeri.map((item: { src?: unknown; alt?: string }) => ({ src: mediaUrl(item.src) ?? "", alt: String(item.alt ?? "") })).filter((item) => item.src) : [];
    const facilities = Array.isArray(doc.fasilitas) ? doc.fasilitas.map((item: { icon?: string; title?: string; description?: string; image?: unknown; imageAlt?: string }) => ({ icon: String(item.icon ?? "sparkles"), title: String(item.title ?? ""), description: String(item.description ?? ""), image: mediaUrl(item.image), imageAlt: item.imageAlt ?? item.title })) : [];
    return { serviceSlug, locationSlug, tagline: String(doc.tagline ?? ""), startingPrice: String(doc.hargaMulai ?? ""), pricing: packages as ServiceLocation["pricing"], image: mediaUrl(doc.foto) ?? "", imageAlt: String(doc.altFoto ?? doc.namaTampilan ?? ""), gallery, facilities, whatsappNumbers: numbers, mapsUrl: String(office.linkGoogleMaps ?? ""), latitude: typeof office.latitude === "number" ? office.latitude : undefined, longitude: typeof office.longitude === "number" ? office.longitude : undefined, offices, catatanLegalitas: String(doc.catatanLegalitas ?? ""), seo: doc.seo ? { ...(doc.seo as Record<string, unknown>), ogImage: mediaUrl((doc.seo as Record<string, unknown>).ogImage) } : undefined };
  });
});

export const getCmsSite = cache(async function getCmsSite() {
  const response = await fetch(`${apiBase}/api/globals/site-settings?depth=1`, cmsCache);
  if (!response.ok) throw new Error(`CMS request failed: site-settings (${response.status})`);
  const data = await response.json();
  // Keep the public site and the Site Settings form aligned for legacy globals
  // whose stored fields are null. These are content defaults, not guessed data.
  const siteDefaults = {
    siteName: "EasyOffice",
    headerCtaLabel: "Hubungi Kami",
    homepageHeroEyebrow: "EasyOffice",
    homepageHeroTitle: "Solusi Ruang Kerja Profesional untuk Bisnis Anda",
    homepageHeroDescription: "Virtual Office, Coworking Space, dan Meeting Room untuk mendukung kebutuhan bisnis Anda — dengan alamat prestisius dan layanan profesional.",
    homepageHeroImageLabel: "Virtual Office • Coworking Space • Meeting Room • Private Office",
    homepageHeroPrimaryCtaLabel: "Hubungi Kami",
    homepageHeroPrimaryCtaMessage: "Halo EasyOffice, saya ingin bertanya tentang layanan Anda.",
    homepageHeroSecondaryCtaLabel: "Lihat Layanan",
    homepageHeroSecondaryCtaHref: "/layanan/virtual-office",
    homepageServicesTitle: "Layanan EasyOffice",
    homepageServicesDescription: "Berbagai layanan untuk mendukung operasional dan citra profesional bisnis Anda.",
    homepageFacilitiesTitle: "Mengapa Pilih EasyOffice?",
    homepageFacilitiesDescription: "Fasilitas lengkap untuk mendukung produktivitas dan citra profesional bisnis Anda.",
    homepageComparisonTitle: "Perbandingan dengan Office Lain",
    homepageComparisonDescription: "Perbandingan fasilitas yang Anda dapatkan bersama EasyOffice.",
    homepagePromoTitle: "Penawaran Spesial untuk Anda",
    homepagePromoDescription: "Temukan penawaran EasyOffice untuk kebutuhan ruang kerja dan bisnis Anda.",
    homepageShopeeTitle: "Pesan Paket EasyOffice dengan Mudah",
    homepageShopeeDescription: "Pembayaran layanan EasyOffice tersedia melalui marketplace Shopee dengan transaksi yang aman dan terpercaya.",
    homepageCtaTitle: "Siap Menemukan Ruang Kerja yang Tepat?",
    homepageCtaDescription: "Hubungi EasyOffice melalui WhatsApp — tim kami siap membantu memilih layanan dan lokasi yang sesuai dengan kebutuhan bisnis Anda.",
    homepageCtaButtonLabel: "Hubungi via WhatsApp",
    homepageCtaSecondaryButtonLabel: "Lihat Info Kontak",
    footerDescription: "Solusi Ruang Kerja Profesional. Virtual Office, Coworking Space, dan Meeting Room di Bandung, Jakarta, dan Bekasi.",
    copyrightText: `© ${new Date().getFullYear()} EasyOffice. Seluruh hak cipta dilindungi.`,
    defaultSeoTitle: "EasyOffice — Virtual Office, Coworking Space & Meeting Room",
    defaultSeoDescription: "EasyOffice menyediakan Virtual Office, Coworking Space, dan Meeting Room profesional di Bandung, Jakarta, dan Bekasi.",
  };
  for (const [key, fallback] of Object.entries(siteDefaults)) {
    if (data[key] == null || data[key] === "") data[key] = fallback;
  }
  // Retired from Site Settings; old deployments / globals can still return it.
  delete data.homepageHeroImageAlt;
  const whatsappNumbers = Array.isArray(data.whatsappNumbers) ? data.whatsappNumbers : [];
  const primaryWhatsapp = String(data.primaryWhatsapp ?? data.phone ?? "");
  return { ...data, phoneDisplay: data.phone ?? "", logoUrl: mediaUrl(data.logo), homepageHeroImage: mediaUrl(data.homepageHeroImage), homepageShopeeImage: mediaUrl(data.homepageShopeeImage), statsBanner: Array.isArray(data.statsBanner) ? data.statsBanner : [], socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [], primaryWhatsapp, whatsappNumbers, whatsappNumber: routedWhatsappNumber(whatsappNumbers, primaryWhatsapp) };
});

export const getCmsAbout = cache(async function getCmsAbout() {
  const response = await fetch(`${apiBase}/api/globals/about-page?depth=1`, cmsCache);
  if (!response.ok) throw new Error(`CMS request failed: about-page (${response.status})`);
  const data = await response.json();
  return {
    ...data,
    heroImage: mediaUrl(data.heroImage) ?? "",
    storyImage: mediaUrl(data.storyImage) ?? "",
    heroHighlights: Array.isArray(data.heroHighlights) ? data.heroHighlights.map((item: { value?: string }) => item.value ?? "") : [],
    storyHighlights: Array.isArray(data.storyHighlights) ? data.storyHighlights.map((item: { value?: string }) => item.value ?? "") : [],
    stats: Array.isArray(data.stats) ? data.stats.map((item: { value?: string; label?: string }) => ({ value: item.value ?? "", label: item.label ?? "" })) : [],
    values: Array.isArray(data.values) ? data.values.map((item: { icon?: string; title?: string; description?: string }) => ({ icon: item.icon ?? "award", title: item.title ?? "", description: item.description ?? "" })) : [],
  };
});

export const getCmsFaqs = cache(async function getCmsFaqs(serviceSlug?: string) {
  const docs = await payloadList<Partial<Faq> & { placement?: string; service?: unknown; items?: Array<{ question?: string; answer?: string; sortOrder?: number }> }>("faqs");
  if (!docs.length) return [];
  return docs.filter((doc) => {
    const service = doc.service && typeof doc.service === "object" ? doc.service as Record<string, unknown> : undefined;
    return serviceSlug ? doc.placement === "service" && !!service && service.slug === serviceSlug : doc.placement === "global";
  }).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).flatMap((doc) => Array.isArray(doc.items) ? [...doc.items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => ({ question: item.question ?? "", answer: item.answer ?? "" })) : []);
});

export const getCmsHomepageFacilities = cache(async function getCmsHomepageFacilities(): Promise<Facility[]> {
  const docs = await payloadList<Partial<Facility>>("homepage-facilities");
  if (!docs.length) return [];
  return [...docs]
    .sort((a, b) => ((a as Partial<Facility> & { sortOrder?: number }).sortOrder ?? 0) - ((b as Partial<Facility> & { sortOrder?: number }).sortOrder ?? 0))
    .map((doc) => ({ icon: doc.icon ?? "sparkles", title: doc.title ?? "", description: doc.description ?? "" }));
});

export const getCmsComparisonRows = cache(async function getCmsComparisonRows(serviceSlug?: string): Promise<ComparisonRow[]> {
  const docs = await payloadList<Partial<ComparisonRow> & { placement?: string; sortOrder?: number; service?: unknown; items?: Array<{ feature?: string; easyoffice?: string | boolean; typical?: string | boolean; sortOrder?: number }> }>("comparison-rows");
  if (!docs.length) return [];
  const seen = new Set<string>();
  return docs
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((doc) => { const service = doc.service && typeof doc.service === "object" ? doc.service as Record<string, unknown> : undefined; return serviceSlug ? doc.placement === "service" && !!service && service.slug === serviceSlug : doc.placement === "global"; })
    .flatMap((doc) => Array.isArray(doc.items) && doc.items.length ? [...doc.items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => ({ feature: item.feature ?? "", easyoffice: normalizeComparisonStatus(item.easyoffice), typical: normalizeComparisonStatus(item.typical), serviceSlug })) : [{ feature: doc.feature ?? "", easyoffice: normalizeComparisonStatus(doc.easyoffice), typical: normalizeComparisonStatus(doc.typical), serviceSlug }])
    .filter((row) => { if (seen.has(row.feature)) return false; seen.add(row.feature); return true; });
});

function normalizeComparisonStatus(value: string | boolean | undefined): ComparisonStatus {
  if (value === true || value === "true") return "true";
  if (value === false || value === "false") return "false";
  return "neutral";
}

export async function getCmsHomepageLayout(): Promise<HomepageLayoutData | null> {
  const response = await fetch(`${apiBase}/api/page-layout?limit=1&where[isActive][equals]=true&where[status][equals]=published`, cmsCache);
  if (!response.ok) return null;
  const data = (await response.json()) as { docs?: Array<{ layout?: HomepageLayoutData }> };
  const docs = data.docs;
  return (normalizeLayout(docs?.[0]?.layout) as HomepageLayoutData | undefined) ?? null;
}

export async function getCmsHomepageLayoutById(id: string): Promise<HomepageLayoutData | null> {
  const response = await fetch(`${apiBase}/api/page-layout/${encodeURIComponent(id)}`, cmsCache);
  if (!response.ok) return null;
  const data = (await response.json()) as { layout?: HomepageLayoutData };
  return (normalizeLayout(data.layout) as HomepageLayoutData | undefined) ?? null;
}

export async function getCmsPublishedPuckPage(route: string, previewToken?: string): Promise<PublishedPuckPage | null> {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const tokenParts = previewToken?.split(".");
  const tokenPayload = tokenParts?.length === 3 ? `${tokenParts[0]}.${tokenParts[1]}` : "";
  const expected = tokenPayload ? crypto.createHmac("sha256", process.env.PAYLOAD_SECRET ?? "preview").update(tokenPayload).digest("hex") : "";
  const validPreview = Boolean(tokenParts?.length === 3 && Number(tokenParts[1]) > Math.floor(Date.now() / 1000) && expected && tokenParts[2] && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(tokenParts[2])));
  if (validPreview) {
    const draftResponse = await fetch(`${apiBase}/api/page-layout/${encodeURIComponent(tokenParts![0])}`, { cache: "no-store" });
    if (!draftResponse.ok) return null;
    const draft = await draftResponse.json() as PublishedPuckPage;
    return draft.route === normalizedRoute ? { ...draft, layout: normalizeLayout(draft.layout) as HomepageLayoutData } : null;
  }
  const where = encodeURIComponent(JSON.stringify({ and: [{ route: { equals: normalizedRoute } }, ...(validPreview ? [] : [{ status: { equals: "published" } }, { isActive: { equals: true } }])] }));
  const response = await fetch(`${apiBase}/api/page-layout?limit=1&where=${where}`, cmsCache);
  if (!response.ok) return null;
  const data = (await response.json()) as { docs?: PublishedPuckPage[] };
  const page = data.docs?.[0];
  return page ? { ...page, layout: normalizeLayout(page.layout) as HomepageLayoutData } : null;
}
