import { PuckBuilderClient, type PuckBuilderInitialData } from "./puck-builder";
import crypto from "node:crypto";

export async function loadPuckBuilderData(id?: string): Promise<PuckBuilderInitialData> {
  let data: PuckBuilderInitialData["data"] = { content: [{ type: "Heading", props: { id: "starter-heading", children: "Judul halaman", level: "h1" } }, { type: "Text", props: { id: "starter-text", children: "Tulis isi halaman Anda di sini." } }, { type: "Button", props: { id: "starter-button", label: "Pelajari lebih lanjut", href: "#", variant: "primary" } }], root: {} };
  if (id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}/api/page-layout/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (response.ok) {
      const doc = await response.json() as { layout?: PuckBuilderInitialData["data"]; id?: string | number; name?: string; route?: string; status?: "draft" | "published" };
      const recordId = String(doc.id ?? id);
      const expires = Math.floor(Date.now() / 1000) + 1800;
      const tokenPayload = `${recordId}.${expires}`;
      const signature = crypto.createHmac("sha256", process.env.PAYLOAD_SECRET ?? "preview").update(tokenPayload).digest("hex");
      data = { ...(doc.layout ?? data), id: doc.id, name: doc.name, route: doc.route, status: doc.status, previewToken: `${tokenPayload}.${signature}` } as PuckBuilderInitialData["data"];
    }
  }
  return { data };
}

export async function PuckBuilder({ id }: { id?: string } = {}) {
  let initial: PuckBuilderInitialData;
  try {
    initial = await loadPuckBuilderData(id);
  } catch {
    initial = { data: { content: [], root: {} } };
  }
  const nodeTypes = initial.data.content?.map((item) => item.type).join(",") ?? "";
  return <div data-puck-homepage-node-types={nodeTypes}><PuckBuilderClient initial={initial} /></div>;
}
