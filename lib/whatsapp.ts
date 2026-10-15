/**
 * WhatsApp helpers — centralized so every CTA uses the same logic.
 */
export const WHATSAPP_NUMBER = "6281234567890";

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
