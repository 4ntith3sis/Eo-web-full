import fs from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/local-media");
const files = await fs.readdir(dir);
const entries = [];
for (const filename of files) {
  const file = await fs.readFile(path.join(dir, filename));
  const mime = filename.endsWith(".png") ? "image/png" : filename.endsWith(".jpg") || filename.endsWith(".jpeg") ? "image/jpeg" : "image/webp";
  entries.push(`  ${JSON.stringify(filename)}: ${JSON.stringify(`data:${mime};base64,${file.toString("base64")}`)},`);
}
await fs.writeFile("lib/local-media-data.ts", `export const localMediaData: Record<string, string> = {\n${entries.join("\n")}\n};\n`);
