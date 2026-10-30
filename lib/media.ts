/** Normalize legacy Payload media URLs to the public object-storage URL. */
export function normalizeMediaUrl(url: string): string {
  if (url.startsWith("data:image/")) return url;

  const match = url.match(/\/api\/media\/file\/([^?#]+)/);
  if (!match) return url;

  const filename = decodeURIComponent(match[1]).split("/").pop() ?? "";
  return `https://qbfgapkitvhlylyrbivs.supabase.co/storage/v1/object/public/media/${encodeURIComponent(filename)}`;
}

/** Supabase public media is served directly when Next's optimizer rejects it. */
export function isSupabaseMediaUrl(url: string): boolean {
  try {
    return new URL(url, "https://easyoffice.local").hostname === "qbfgapkitvhlylyrbivs.supabase.co";
  } catch {
    return false;
  }
}
