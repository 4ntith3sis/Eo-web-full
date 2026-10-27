import type { ComparisonRow, ComparisonStatus, Faq, Facility, Location, Office, Promotion, Service, ServiceLocation, Testimonial } from "@/types";
import { routedWhatsappNumber } from "@/lib/whatsapp";

type PayloadList<T> = { docs?: T[] };
type PayloadText = string | { value?: string };

const apiBase = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";
function mediaUrl(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof (value as { url?: unknown }).url === "string") return (value as { url: string }).url;
  return undefined;
}

export type HomepageLayoutData = { content?: Array<{ type?: string; props?: Record<string, unknown> }>; root?: Record<string, unknown> };
export type PublishedPuckPage = { id?: string | number; name?: string; route?: string; layout?: HomepageLayoutData };

async function payloadList<T>(collection: string): Promise<T[]> {
    const response = await fetch(`${apiBase}/api/${collection}?limit=100&where[isActive][equals]=true`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`CMS request failed: ${collection} (${response.status})`);
    const data = (await response.json()) as PayloadList<T>;
    if (!Array.isArray(data.docs)) throw new Error(`CMS returned no documents: ${collection}`);
    return data.docs;
}

export async function getCmsServices(): Promise<Service[]> {
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
    benefits: (doc.benefits as PayloadText[] | undefined)?.map((item) => typeof item === "string" ? item : item.value ?? "") ?? [],
    benefitsTitle: doc.benefitsTitle ?? "",
    benefitsDescription: doc.benefitsDescription ?? "",
    benefitItems: Array.isArray(doc.benefitItems) ? doc.benefitItems.map((item: { icon?: string; title?: string; description?: string }) => ({ icon: item.icon ?? "sparkles", title: item.title ?? "", description: item.description ?? "" })) : [],
    features: (doc.features as PayloadText[] | undefined)?.map((item) => typeof item === "string" ? item : item.value ?? "") ?? [],
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
}

export async function getCmsLocations(): Promise<Location[]> {
  const response = await fetch(`${apiBase}/api/kantor?limit=100&where[aktif][equals]=true`, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`CMS request failed: kantor (${response.status})`);
  const data = (await response.json()) as PayloadList<Record<string, unknown>>;
  const docs = data.docs ?? [];
  if (!docs.length) throw new Error("No locations configured in CMS");
  return docs.map((doc) => ({
    slug: String(doc.slug ?? "").replace(/^easyoffice-/, ""),
    name: String(doc.kota ?? doc.nama ?? ""),
    card: { title: String(doc.nama ?? ""), description: String(doc.deskripsi ?? ""), image: mediaUrl(doc.foto), imageAlt: String(doc.altFoto ?? doc.nama ?? "") },
    address: String(doc.alamat ?? ""), operatingHours: String(doc.jamOperasional ?? ""), email: String(doc.email ?? ""), phoneDisplay: String(doc.telepon ?? ""), whatsapp: String(doc.whatsapp ?? ""), whatsappNumbers: Array.isArray(doc.whatsappNumbers) ? doc.whatsappNumbers as Office["whatsappNumbers"] : undefined, mapsUrl: String(doc.linkGoogleMaps ?? ""), latitude: typeof doc.latitude === "number" ? doc.latitude : undefined, longitude: typeof doc.longitude === "number" ? doc.longitude : undefined,
  }));
}

export async function getCmsPromotions(): Promise<Promotion[]> {
  const docs = await payloadList<Partial<Promotion> & { service?: unknown }>("promotions");
  if (!docs.length) return [];
  return docs.map((doc) => {
    const service = doc.service && typeof doc.service === "object" ? doc.service as Record<string, unknown> : undefined;
    const title = String(doc.title ?? "");
    const inferredService = service?.slug ? String(service.slug) : /coworking/i.test(title) ? "coworking-space" : /meeting room/i.test(title) ? "meeting-room" : /virtual office/i.test(title) ? "virtual-office" : undefined;
    const badge = String(doc.badge ?? "promo").toLowerCase();
    return { badge: badge === "trial" || badge === "diskon" ? badge : "promo", title, description: doc.description ?? "", period: doc.period ?? "", image: mediaUrl(doc.image), serviceSlug: inferredService };
  });
}

export async function getCmsTestimonials(): Promise<Testimonial[]> {
  const docs = await payloadList<Partial<Testimonial>>("testimonials");
  if (!docs.length) return [];
  return docs.map((doc) => ({ id: doc.id, name: doc.name ?? "", company: doc.company ?? "", quote: doc.quote ?? "" }));
}

export async function getCmsServiceLocations(): Promise<ServiceLocation[]> {
  const response = await fetch(`${apiBase}/api/layanan-kantor?limit=100&depth=2&where[aktif][equals]=true`, { headers: { Accept: "application/json" }, cache: "no-store" });
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
    const offices = [{ slug: locationSlug, name: String(office.nama ?? office.kota ?? ""), description: String(office.deskripsi ?? ""), address: String(office.alamat ?? ""), operatingHours: String(office.jamOperasional ?? ""), email: String(office.email ?? ""), phoneDisplay: String(office.telepon ?? ""), whatsapp: String(office.whatsapp ?? ""), whatsappNumbers: numbers, mapsUrl: String(office.linkGoogleMaps ?? ""), latitude: typeof office.latitude === "number" ? office.latitude : undefined, longitude: typeof office.longitude === "number" ? office.longitude : undefined }] as Office[];
    const gallery = Array.isArray(doc.galeri) ? doc.galeri.map((item: { src?: unknown; alt?: string }) => ({ src: mediaUrl(item.src) ?? "", alt: String(item.alt ?? "") })).filter((item) => item.src) : [];
    const facilities = Array.isArray(doc.fasilitas) ? doc.fasilitas.map((item: { icon?: string; title?: string; description?: string; image?: unknown; imageAlt?: string }) => ({ icon: String(item.icon ?? "sparkles"), title: String(item.title ?? ""), description: String(item.description ?? ""), image: mediaUrl(item.image), imageAlt: item.imageAlt ?? item.title })) : [];
    return { serviceSlug, locationSlug, tagline: String(doc.tagline ?? ""), startingPrice: String(doc.hargaMulai ?? ""), pricing: packages as ServiceLocation["pricing"], image: mediaUrl(doc.foto) ?? "", imageAlt: String(doc.altFoto ?? doc.namaTampilan ?? ""), gallery, facilities, whatsapp: String(office.whatsapp ?? ""), whatsappNumbers: numbers, mapsUrl: String(office.linkGoogleMaps ?? ""), latitude: typeof office.latitude === "number" ? office.latitude : undefined, longitude: typeof office.longitude === "number" ? office.longitude : undefined, offices, catatanLegalitas: String(doc.catatanLegalitas ?? ""), seo: doc.seo ? { ...(doc.seo as Record<string, unknown>), ogImage: mediaUrl((doc.seo as Record<string, unknown>).ogImage) } : undefined };
  });
}

export async function getCmsSite() {
  const response = await fetch(`${apiBase}/api/globals/site-settings?depth=1`, { cache: "no-store" });
  if (!response.ok) throw new Error(`CMS request failed: site-settings (${response.status})`);
  const data = await response.json();
  const whatsappNumbers = Array.isArray(data.whatsappNumbers) ? data.whatsappNumbers : [];
  const primaryWhatsapp = String(data.primaryWhatsapp ?? data.phone ?? "");
  return { ...data, phoneDisplay: data.phone ?? "", logoUrl: mediaUrl(data.logo), homepageHeroImage: mediaUrl(data.homepageHeroImage), homepageShopeeImage: mediaUrl(data.homepageShopeeImage), statsBanner: Array.isArray(data.statsBanner) ? data.statsBanner : [], primaryWhatsapp, whatsappNumbers, whatsappNumber: routedWhatsappNumber(whatsappNumbers, typeof data.defaultWhatsapp === "string" ? data.defaultWhatsapp : undefined, primaryWhatsapp) };
}

export async function getCmsAbout() {
  const response = await fetch(`${apiBase}/api/globals/about-page?depth=1`, { cache: "no-store" });
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
}

export async function getCmsFaqs(serviceSlug?: string) {
  const docs = await payloadList<Partial<Faq> & { service?: unknown; items?: Array<{ question?: string; answer?: string; sortOrder?: number }> }>("faqs");
  if (!docs.length) return [];
  return docs.filter((doc) => {
    const service = doc.service && typeof doc.service === "object" ? doc.service as Record<string, unknown> : undefined;
    return serviceSlug ? !service || service.slug === serviceSlug : !service;
  }).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).flatMap((doc) => Array.isArray(doc.items) && doc.items.length ? [...doc.items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => ({ question: item.question ?? "", answer: item.answer ?? "" })) : [{ question: doc.question ?? "", answer: doc.answer ?? "" }]);
}

export async function getCmsHomepageFacilities(): Promise<Facility[]> {
  const docs = await payloadList<Partial<Facility>>("homepage-facilities");
  if (!docs.length) return [];
  return docs.map((doc) => ({ icon: doc.icon ?? "sparkles", title: doc.title ?? "", description: doc.description ?? "", image: mediaUrl(doc.image), imageAlt: doc.imageAlt }));
}

export async function getCmsComparisonRows(serviceSlug?: string): Promise<ComparisonRow[]> {
  const docs = await payloadList<Partial<ComparisonRow> & { sortOrder?: number; service?: unknown; items?: Array<{ feature?: string; easyoffice?: string | boolean; typical?: string | boolean; sortOrder?: number }> }>("comparison-rows");
  if (!docs.length) return [];
  const seen = new Set<string>();
  return docs
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((doc) => { const service = doc.service && typeof doc.service === "object" ? doc.service as Record<string, unknown> : undefined; return serviceSlug ? !service || service.slug === serviceSlug : !service; })
    .flatMap((doc) => Array.isArray(doc.items) && doc.items.length ? [...doc.items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => ({ feature: item.feature ?? "", easyoffice: normalizeComparisonStatus(item.easyoffice), typical: normalizeComparisonStatus(item.typical), serviceSlug })) : [{ feature: doc.feature ?? "", easyoffice: normalizeComparisonStatus(doc.easyoffice), typical: normalizeComparisonStatus(doc.typical), serviceSlug }])
    .filter((row) => { if (seen.has(row.feature)) return false; seen.add(row.feature); return true; });
}

function normalizeComparisonStatus(value: string | boolean | undefined): ComparisonStatus {
  if (value === true || value === "true") return "true";
  if (value === false || value === "false") return "false";
  return "neutral";
}

export async function getCmsHomepageLayout(): Promise<HomepageLayoutData | null> {
  const response = await fetch(`${apiBase}/api/homepage-layout?limit=1&where[isActive][equals]=true&where[status][equals]=published`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = (await response.json()) as { docs?: Array<{ layout?: HomepageLayoutData }> };
  const docs = data.docs;
  return docs?.[0]?.layout ?? null;
}

export async function getCmsHomepageLayoutById(id: string): Promise<HomepageLayoutData | null> {
  const response = await fetch(`${apiBase}/api/homepage-layout/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = (await response.json()) as { layout?: HomepageLayoutData };
  return data.layout ?? null;
}

export async function getCmsPublishedPuckPage(route: string): Promise<PublishedPuckPage | null> {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const where = encodeURIComponent(JSON.stringify({
    and: [
      { route: { equals: normalizedRoute } },
      { status: { equals: "published" } },
      { isActive: { equals: true } },
    ],
  }));
  const response = await fetch(`${apiBase}/api/homepage-layout?limit=1&where=${where}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = (await response.json()) as { docs?: PublishedPuckPage[] };
  return data.docs?.[0] ?? null;
}
