import { PuckBuilderClient, type PuckBuilderInitialData } from "./puck-builder";

export async function loadPuckBuilderData(id?: string): Promise<PuckBuilderInitialData> {
  let data: PuckBuilderInitialData["data"] = { content: [], root: {} };
  if (id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}/api/page-layout/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (response.ok) {
      const doc = await response.json() as { layout?: PuckBuilderInitialData["data"]; id?: string | number; name?: string; route?: string };
      data = { ...(doc.layout ?? { content: [], root: {} }), id: doc.id, name: doc.name, route: doc.route } as PuckBuilderInitialData["data"];
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
