import { PuckBuilder } from "@/components/puck/puck-builder-server";

export const metadata = {
  title: "Puck Editor | EasyOffice",
};

export default async function PuckEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const params = await searchParams;
  const id = typeof params.id === "string" ? params.id : undefined;

  return <PuckBuilder id={id} />;
}
