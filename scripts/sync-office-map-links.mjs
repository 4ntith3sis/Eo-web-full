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
const [legacyData, officeData] = await Promise.all([
  request("/api/service-offices?limit=100&depth=2", { headers: auth }),
  request("/api/kantor?limit=100&depth=1", { headers: auth }),
]);

const mapsByCity = new Map();
for (const item of legacyData.docs ?? []) {
  const city = item.city && typeof item.city === "object" ? String(item.city.name ?? "") : "";
  const mapsUrl = typeof item.mapsUrl === "string" ? item.mapsUrl.trim() : "";
  if (city && mapsUrl && !mapsByCity.has(city.toLowerCase())) mapsByCity.set(city.toLowerCase(), mapsUrl);
}

let updated = 0;
for (const office of officeData.docs ?? []) {
  const mapsUrl = mapsByCity.get(String(office.kota ?? "").toLowerCase());
  if (!mapsUrl || office.linkGoogleMaps === mapsUrl) continue;
  await request(`/api/kantor/${office.id}`, { method: "PATCH", headers: auth, body: JSON.stringify({ linkGoogleMaps: mapsUrl }) });
  updated += 1;
  console.log(`Updated kantor Maps: ${office.slug}`);
}

console.log(JSON.stringify({ citiesWithMaps: [...mapsByCity.keys()], updated }, null, 2));
