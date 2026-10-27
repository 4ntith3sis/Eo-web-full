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
const services = (await request("/api/services?limit=100&where[isActive][equals]=true&depth=1", { headers: auth })).docs ?? [];
const offerings = (await request("/api/layanan-kantor?limit=100&depth=2", { headers: auth })).docs ?? [];
const servicesById = new Map(services.map((service) => [String(service.id), service]));
let updated = 0;
let skipped = 0;

for (const offering of offerings) {
  if (Array.isArray(offering.keunggulan) && offering.keunggulan.length > 0) {
    skipped += 1;
    console.log(`Skipped layanan-kantor: ${offering.slug} (already has keunggulan)`);
    continue;
  }

  const serviceId = offering.layanan && typeof offering.layanan === "object" ? offering.layanan.id : offering.layanan;
  const service = servicesById.get(String(serviceId));
  const source = Array.isArray(service?.benefitItems) && service.benefitItems.length > 0
    ? service.benefitItems
    : Array.isArray(service?.benefits) ? service.benefits : [];
  const keunggulan = source.map((item) => {
    if (typeof item === "string") return { icon: "sparkles", title: item, description: "" };
    return { icon: item.icon ?? "sparkles", title: item.title ?? item.value ?? "", description: item.description ?? "" };
  }).filter((item) => item.title);

  if (!keunggulan.length) {
    skipped += 1;
    console.log(`Skipped layanan-kantor: ${offering.slug} (no service benefits)`);
    continue;
  }

  await request(`/api/layanan-kantor/${offering.id}`, { method: "PATCH", headers: auth, body: JSON.stringify({ keunggulan }) });
  updated += 1;
  console.log(`Updated layanan-kantor: ${offering.slug} (${keunggulan.length} keunggulan)`);
}

console.log(JSON.stringify({ updated, skipped, total: offerings.length }, null, 2));
