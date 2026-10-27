const baseUrl = process.env.CMS_URL ?? "http://localhost:3000";
const email = process.env.PAYLOAD_ADMIN_EMAIL ?? "admin@easyoffice.local";
const password = process.env.PAYLOAD_ADMIN_PASSWORD ?? "admin123";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Accept: "application/json", ...(options.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

const login = await request("/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
const auth = { Authorization: `JWT ${login.token}`, "Content-Type": "application/json" };
const legacy = (await request("/api/service-offices?limit=100&depth=2", { headers: auth })).docs ?? [];
const offices = new Map();

async function findOne(collection, slug) {
  const query = `/api/${collection}?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`;
  return (await request(query, { headers: auth })).docs?.[0] ?? null;
}

async function upsert(collection, slug, payload) {
  const existing = await findOne(collection, slug);
  const path = existing ? `/api/${collection}/${existing.id}` : `/api/${collection}`;
  const method = existing ? "PATCH" : "POST";
  const result = await request(path, { method, headers: auth, body: JSON.stringify(payload) });
  return { doc: result.doc ?? result, action: existing ? "Updated" : "Created" };
}

for (const item of legacy) {
  const city = item.city && typeof item.city === "object" ? item.city.name : "";
  const slug = `easyoffice-${city.toLowerCase()}`;
  if (!offices.has(slug)) {
    const payload = { nama: item.name ?? `EasyOffice ${city}`, slug, kota: city, deskripsi: item.description ?? "", alamat: item.address ?? "", jamOperasional: item.operatingHours ?? "", email: item.email ?? "", telepon: item.phone ?? "", whatsapp: item.whatsapp ?? "", linkGoogleMaps: item.mapsUrl ?? "", latitude: item.latitude, longitude: item.longitude, foto: item.image?.id ?? item.image, altFoto: item.imageAlt ?? "", galeri: (item.gallery ?? []).map((entry) => ({ src: entry.src?.id ?? entry.src, alt: entry.alt ?? "" })), seo: item.seo, aktif: item.isActive !== false };
    const result = await upsert("kantor", slug, payload);
    offices.set(slug, result.doc);
    console.log(`${result.action} kantor: ${slug}`);
  }
}

for (const item of legacy) {
  const city = item.city && typeof item.city === "object" ? item.city.name : "";
  const office = offices.get(`easyoffice-${city.toLowerCase()}`);
  const service = item.service && typeof item.service === "object" ? item.service : null;
  if (!office || !service) continue;
  const slug = `${String(service.slug ?? "service").toLowerCase()}-${String(city).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  const payload = { kantor: office.id, layanan: service.id, slug, namaTampilan: item.name ?? slug, deskripsi: item.description ?? "", tagline: item.tagline ?? "", hargaMulai: item.startingPrice ?? "", paketHarga: item.packages ?? [], fasilitas: item.facilities ?? [], foto: item.image?.id ?? item.image, altFoto: item.imageAlt ?? "", galeri: (item.gallery ?? []).map((entry) => ({ src: entry.src?.id ?? entry.src, alt: entry.alt ?? "" })), seo: item.seo, aktif: item.isActive !== false };
  const result = await upsert("layanan-kantor", slug, payload);
  console.log(`${result.action} layanan-kantor: ${slug}`);
}
