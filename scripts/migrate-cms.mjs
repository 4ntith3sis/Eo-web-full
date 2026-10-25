import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const baseUrl = process.env.CMS_URL ?? "http://localhost:3000";
const email = process.env.PAYLOAD_ADMIN_EMAIL ?? "admin@easyoffice.local";
const password = process.env.PAYLOAD_ADMIN_PASSWORD ?? "admin123";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Accept: "application/json", ...(options.headers ?? {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${path} failed with ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

console.log("[1/4] Running CMS seed...");
execFileSync(process.execPath, ["--import", "tsx", "scripts/seed-cms.mjs"], {
  stdio: "inherit",
  env: { ...process.env, CMS_URL: baseUrl, PAYLOAD_ADMIN_EMAIL: email, PAYLOAD_ADMIN_PASSWORD: password },
});

console.log("[2/4] Validating CMS REST data...");
const login = await request("/api/users/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
const auth = { Authorization: `JWT ${login.token}` };
const requiredCollections = ["services", "cities", "service-offices", "promotions", "testimonials", "comparison-rows", "homepage-facilities", "faqs"];
for (const collection of requiredCollections) {
  const data = await request(`/api/${collection}?limit=100&depth=1`, { headers: auth });
  if (!Array.isArray(data.docs)) throw new Error(`Invalid REST response for ${collection}`);
  if (["services", "cities", "service-offices"].includes(collection) && data.docs.length === 0) throw new Error(`Required CMS collection is empty: ${collection}`);
  console.log(`  ${collection}: ${data.docs.length}`);
}
const services = (await request("/api/services?limit=100&depth=1", { headers: auth })).docs;
const offices = (await request("/api/service-offices?limit=100&depth=1", { headers: auth })).docs;
const comparisonRows = (await request("/api/comparison-rows?limit=100&depth=1", { headers: auth })).docs;
if (!comparisonRows.some((row) => !row.service)) throw new Error("Global comparison table is missing");
for (const slug of services.map((item) => item.slug)) {
  if (!comparisonRows.some((row) => row.service?.slug === slug)) throw new Error(`Comparison table is missing for service: ${slug}`);
}
const globalComparison = comparisonRows.filter((row) => !row.service);
if (new Set(globalComparison.map((row) => row.feature)).size !== globalComparison.length) throw new Error("Duplicate global comparison features found");
for (const slug of services.map((item) => item.slug)) {
  const rows = comparisonRows.filter((row) => row.service?.slug === slug);
  if (new Set(rows.map((row) => row.feature)).size !== rows.length) throw new Error(`Duplicate comparison features found for ${slug}`);
}
if (services.some((item) => !item.seo?.title || !item.seo?.description || !item.seo?.canonicalUrl)) throw new Error("Service SEO validation failed");
if (offices.some((item) => !item.seo?.title || !item.seo?.description || !item.seo?.canonicalUrl)) throw new Error("Service-office SEO validation failed");
const site = await request("/api/globals/site-settings?depth=1", { headers: auth });
const about = await request("/api/globals/about-page?depth=1", { headers: auth });
if (!Array.isArray(site.navigation) || site.navigation.length === 0) throw new Error("Site navigation is missing");
if (!about.heroTitle || !about.storyTitle) throw new Error("About Page content is incomplete");
if (!Array.isArray(site.statsBanner) || site.statsBanner.length !== 4) throw new Error("Global stats banner must contain 4 items");
for (const service of services) {
  if ((service.benefitItems?.length ?? 0) !== 6) throw new Error(`Benefit count invalid for ${service.slug}`);
  const expectedFeatures = service.slug === "virtual-office" ? 4 : 6;
  if ((service.features?.length ?? 0) !== expectedFeatures) throw new Error(`Feature count invalid for ${service.slug}`);
}
if (offices.some((office) => (office.facilities?.length ?? 0) !== 6)) throw new Error("Every service office must contain exactly 6 facilities");
if (offices.some((office) => new Set((office.facilities ?? []).map((facility) => facility.title)).size !== 6)) throw new Error("Every service office must contain 6 unique facilities");
if (offices.some((office) => !office.image || !office.startingPrice || (office.packages ?? []).some((plan) => !plan.price))) throw new Error("Service-office media or pricing is incomplete");

console.log("[3/4] Removing runtime mock fallback...");
const adapterPath = "lib/data/cms-data.ts";
const adapter = readFileSync(adapterPath, "utf8");
if (adapter.includes("mock-data")) throw new Error("Runtime mock import still exists in lib/data/cms-data.ts");
if (adapter.includes("mock-data")) throw new Error("Runtime mock import still exists in lib/data/cms-data.ts");

console.log("[4/4] Running lint and build...");
execFileSync("npm", ["run", "lint"], { stdio: "inherit" });
execFileSync("npm", ["run", "build"], { stdio: "inherit" });
console.log("CMS migration completed successfully.");
