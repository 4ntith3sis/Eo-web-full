"use client";

import { Puck, type Config, type Data } from "@measured/puck";
export type { Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { useMemo, useState } from "react";
export type PuckBuilderInitialData = { data: Data };

export function PuckBuilderClient({ initial }: { initial: PuckBuilderInitialData }) {
  const [data, setData] = useState<Data>(() => initial.data.content?.length ? initial.data : { content: [], root: {} });
  const config = useMemo<Config>(() => ({ components: {} }), []);
  const current = initial.data as Data & { id?: string | number; name?: string; route?: string };
  return <Puck config={config} data={data} onPublish={async (nextData) => { if (!current.id || !current.name || !current.route) return; const response = await fetch(`/api/page-layout/${current.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: current.name, route: current.route, layout: nextData, status: "published", isActive: true }) }); if (!response.ok) throw new Error("Halaman gagal dipublish"); setData(nextData); }} />;
}
