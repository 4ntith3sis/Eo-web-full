import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.CMS_URL ?? "http://localhost:3000";
const email = process.env.PAYLOAD_ADMIN_EMAIL ?? "admin@easyoffice.local";
const password = process.env.PAYLOAD_ADMIN_PASSWORD ?? "admin123";
const directory = path.resolve("public/images/unsplash");

async function jsonRequest(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${pathname} ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const login = await jsonRequest("/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const auth = { Authorization: `JWT ${login.token}` };
const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".webp")).sort();

for (const file of files) {
  const existing = await jsonRequest(`/api/media?where[filename][equals]=${encodeURIComponent(file)}&limit=1`, { headers: auth });
  if (existing.docs?.length) {
    console.log(`skip ${file}`);
    continue;
  }
  const buffer = await fs.readFile(path.join(directory, file));
  const form = new FormData();
  form.append("alt", `EasyOffice office image ${file.replace(".webp", "")}`);
  form.append("file", new Blob([buffer], { type: "image/webp" }), file);
  const response = await fetch(`${baseUrl}/api/media`, { method: "POST", headers: auth, body: form });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`POST /api/media ${response.status}: ${JSON.stringify(body)}`);
  console.log(`uploaded ${file}`);
}

console.log(`Processed ${files.length} WebP media files.`);
