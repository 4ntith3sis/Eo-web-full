/**
 * WhatsApp helpers — centralized so every CTA uses the same logic.
 */
export const WHATSAPP_NUMBER = "6281234567890";
export type WhatsAppRoute = { label?: string; number: string; active?: boolean; priority?: number };

/** Per-location numbers. Unknown slugs fall back to the default. */
const LOCATION_WHATSAPP: Record<string, string> = {
  bandung: "6281234567890",
  jakarta: "6281234567891",
  bekasi: "6281234567892",
};

export function locationWhatsappNumber(locationSlug: string): string {
  return LOCATION_WHATSAPP[locationSlug] ?? WHATSAPP_NUMBER;
}

export function whatsappUrl(message?: string, number: string = WHATSAPP_NUMBER): string {
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function whatsappFor(
  topic: string,
  locationName?: string,
  number: string = WHATSAPP_NUMBER,
): string {
  const location = locationName ? ` di ${locationName}` : "";
  return whatsappUrl(
    `Halo EasyOffice, saya tertarik dengan layanan ${topic}${location}. Boleh info lebih lanjut?`,
    number,
  );
}

export function routedWhatsappNumber(numbers?: WhatsAppRoute[], fallback?: string, excludedNumber?: string): string {
  const active = (numbers ?? [])
    .filter((item) => item.active !== false && item.number && item.number !== excludedNumber)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  return active[0]?.number ?? fallback ?? WHATSAPP_NUMBER;
}
