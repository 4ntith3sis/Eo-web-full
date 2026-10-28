export interface Location {
  slug: string;
  name: string;
  card?: { title?: string; description?: string; image?: string; imageAlt?: string };
  /** Legacy fields retained for type compatibility; office pages should use Office. */
  shortDescription?: string;
  address?: string;
  operatingHours?: string;
  email?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  whatsappNumbers?: WhatsAppNumber[];
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  benefits: string[];
  keunggulanItems?: Benefit[];
  manfaatItems?: Benefit[];
  benefitsTitle?: string;
  benefitsDescription?: string;
  manfaatTitle?: string;
  manfaatDescription?: string;
  features: string[];
  icon: string;
  href: string;
  /** Unique image URL — must not be reused across services or combos. */
  image: string;
  imageAlt: string;
  seo?: SeoMetadata;
  catatanLegalitas?: string;
  linkShopee?: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface PricingPlan {
  name: string;
  description?: string;
  price: string;
  period: string;
  features: string[];
  discountPercent?: number;
  discountedPrice?: string;
  featured?: boolean;
  ctaLabel: string;
}

export interface Facility {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id?: string | number;
  name: string;
  company: string;
  quote: string;
}

export interface Faq {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  placement?: "global" | "service";
}

export interface Promotion {
  badge: "promo" | "trial" | "diskon" | string;
  title: string;
  description: string;
  period: string;
  image?: string;
  serviceSlug?: string;
  ctaLabel?: string;
  ctaMessage?: string;
  ctaHref?: string;
}

export interface ComparisonRow {
  feature: string;
  easyoffice: ComparisonStatus | boolean;
  typical: ComparisonStatus | boolean;
  serviceSlug?: string;
  placement?: "global" | "service";
}

export type ComparisonStatus = "true" | "neutral" | "false";

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Office {
  slug: string;
  name: string;
  description?: string;
  address: string;
  operatingHours?: string;
  email?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  whatsappNumbers?: WhatsAppNumber[];
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface WhatsAppNumber {
  label?: string;
  number: string;
  active?: boolean;
  priority?: number;
}

/**
 * A unique service offering: Service + Location.
 * Pricing, facilities, FAQs, and contact belong to this combination,
 * so the same package name may carry different prices per location.
 */
export interface ServiceLocation {
  serviceSlug: string;
  locationSlug: string;
  tagline: string;
  startingPrice: string;
  pricing: PricingPlan[];
  facilities: Facility[];
  /** Optional override; defaults to the location's WhatsApp number. */
  whatsapp?: string;
  whatsappNumbers?: WhatsAppNumber[];
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
  /** Unique hero image for this Service × Location page — never reused. */
  image: string;
  imageAlt: string;
  /** 3 detail gallery photos for this Service × Location page — never reused. */
  gallery: GalleryImage[];
  /** Offices shown for this service in the location (frontend prototype). */
  offices?: Office[];
  catatanLegalitas?: string;
  linkShopee?: string;
  seo?: SeoMetadata;
}
