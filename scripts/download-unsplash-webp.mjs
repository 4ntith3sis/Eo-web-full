import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve("lib/data/mock-data.ts");
const outputDir = path.resolve("public/images/unsplash");
const text = await fs.readFile(source, "utf8");
const urls = [...new Set([...text.matchAll(/https:\/\/images\.unsplash\.com\/[^"']+/g)].map((match) => match[0]))];
await fs.mkdir(outputDir, { recursive: true });

let updated = text;
for (const [index, url] of urls.entries()) {
  const filename = `office-${String(index + 1).padStart(2, "0")}.webp`;
  const target = path.join(outputDir, filename);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const input = Buffer.from(await response.arrayBuffer());
    await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(target);
    updated = updated.replaceAll(url, `/images/unsplash/${filename}`);
    console.log(`converted ${filename}`);
  } catch (error) {
    console.error(`failed ${url}: ${error.message}`);
  }
}
await fs.writeFile(source, updated);
console.log(`Processed ${urls.length} Unsplash URLs.`);
