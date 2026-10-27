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
const data = await request("/api/layanan-kantor?limit=100&depth=2", { headers: auth });

for (const item of data.docs ?? []) {
  const service = item.layanan && typeof item.layanan === "object" ? item.layanan.slug : "service";
  const office = item.kantor && typeof item.kantor === "object" ? item.kantor.kota : "location";
  const slug = `${String(service).toLowerCase()}-${String(office).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  if (item.slug === slug) {
    console.log(`Unchanged layanan-kantor: ${slug}`);
    continue;
  }
  await request(`/api/layanan-kantor/${item.id}`, { method: "PATCH", headers: auth, body: JSON.stringify({ slug }) });
  console.log(`Updated layanan-kantor: ${item.slug} -> ${slug}`);
}
