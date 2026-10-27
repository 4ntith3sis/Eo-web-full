const baseUrl = process.env.CMS_URL ?? "http://localhost:3000";
const email = process.env.PAYLOAD_ADMIN_EMAIL ?? "admin@easyoffice.local";
const password = process.env.PAYLOAD_ADMIN_PASSWORD ?? "admin123";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Accept: "application/json", ...(options.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}): ${JSON.stringify(body)}`);
  return body;
}

const login = await request("/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const auth = { Authorization: `JWT ${login.token}` };
const [legacyData, migratedData] = await Promise.all([
  request("/api/service-offices?limit=100&depth=2", { headers: auth }),
  request("/api/layanan-kantor?limit=100&depth=2", { headers: auth }),
]);

const legacy = legacyData.docs ?? [];
const migrated = migratedData.docs ?? [];
const differences = [];

function mediaId(value) {
  return value && typeof value === "object" ? value.id : value ?? null;
}

function normalizePackages(packages = []) {
  return packages.map((item) => ({
    name: item.name ?? "",
    description: item.description ?? null,
    price: item.price ?? null,
    unit: item.unit ?? "",
    benefits: (item.benefits ?? []).map((benefit) => typeof benefit === "object" ? benefit.value ?? "" : benefit),
    discount: {
      active: Boolean(item.discount?.active),
      percentage: item.discount?.percentage ?? null,
      fixed: item.discount?.fixed ?? null,
    },
  }));
}

function normalizeFacilities(items = []) {
  return items.map((item) => ({
    icon: item.icon ?? "",
    title: item.title ?? "",
    description: item.description ?? "",
    image: mediaId(item.image),
    imageAlt: item.imageAlt ?? null,
  }));
}

function normalizeGallery(items = []) {
  return items.map((item) => ({ src: mediaId(item.src), alt: item.alt ?? "" }));
}

function legacyKey(item) {
  const service = item.service && typeof item.service === "object" ? item.service.slug : "service";
  const city = item.city && typeof item.city === "object" ? item.city.name : "location";
  if (service === "virtual-office" && city === "Bandung") return "virtual-office-bandung";
  return `${String(service).toLowerCase()}-${String(city).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

const migratedByKey = new Map(migrated.map((item) => [String(item.slug ?? ""), item]));
for (const source of legacy) {
  const sourceKey = legacyKey(source);
  const target = migratedByKey.get(sourceKey) ?? migrated.find((item) => {
    const service = item.layanan && typeof item.layanan === "object" ? item.layanan.slug : "";
    const office = item.kantor && typeof item.kantor === "object" ? item.kantor.kota : "";
    return sourceKey === `${service}-${String(office).toLowerCase()}-${String(office).toLowerCase()}` || (sourceKey === "easyoffice-bandung" && service === "virtual-office" && office === "Bandung");
  });
  if (!target) {
    differences.push({ slug: legacyKey(source), field: "record", legacy: "exists", migrated: "missing" });
    continue;
  }

  const checks = [
    ["price", source.startingPrice ?? "", target.hargaMulai ?? ""],
    ["packages", normalizePackages(source.packages), normalizePackages(target.paketHarga)],
    ["facilities", normalizeFacilities(source.facilities), normalizeFacilities(target.fasilitas)],
    ["image", mediaId(source.image), mediaId(target.foto)],
    ["imageAlt", source.imageAlt ?? "", target.altFoto ?? ""],
    ["gallery", normalizeGallery(source.gallery), normalizeGallery(target.galeri)],
    ["seo", source.seo ?? null, target.seo ?? null],
  ];
  for (const [field, expected, actual] of checks) {
    if (JSON.stringify(expected) !== JSON.stringify(actual)) differences.push({ slug: legacyKey(source), field, legacy: expected, migrated: actual });
  }
}

console.log(JSON.stringify({
  legacyCount: legacy.length,
  migratedCount: migrated.length,
  differenceCount: differences.length,
  differences,
}, null, 2));

if (differences.length) process.exitCode = 1;
