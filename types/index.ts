export interface Location {
  slug: string;
  name: string;
  shortDescription: string;
  address: string;
  operatingHours: string;
  email: string;
  /** SAMPLE contact display — not a real number. */
  phoneDisplay: string;
  /** SAMPLE WhatsApp number (wa.me format) — not a real number. */
  whatsapp: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  benefits: string[];
  features: string[];
  icon: string;
  href: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  ctaLabel: string;
}

export interface Facility {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Promotion {
  badge: string;
  title: string;
  description: string;
  period: string;
}

export interface ComparisonRow {
  feature: string;
  easyoffice: boolean;
  typical: boolean;
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
  faqs: Faq[];
  /** Optional override; defaults to the location's WhatsApp number. */
  whatsapp?: string;
}
