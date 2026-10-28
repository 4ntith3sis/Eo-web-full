import config from "@/payload.config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";
import { PuckManager } from "@/components/puck/puck-manager";
import { redirect } from "next/navigation";

type PayloadRouteProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: PayloadRouteProps) => {
  return params.then(({ segments }) => {
    const path = segments?.join("/");
    if (path === "puck-builder" || path === "puck-builder/edit") {
      return { title: "Puck Builder | EasyOffice" };
    }
    return generatePageMetadata({ config, params, searchParams });
  });
};

const Page = async ({ params, searchParams }: PayloadRouteProps) => {
  const resolvedParams = await params;
  if (resolvedParams.segments?.join("/") === "puck-builder") return <div className="min-h-screen bg-white"><PuckManager /></div>;
  if (resolvedParams.segments?.join("/") === "puck-builder/edit") {
    const queryId = typeof (await searchParams).id === "string" ? (await searchParams).id as string : undefined;
    redirect(`/puck-editor/edit${queryId ? `?id=${encodeURIComponent(queryId)}` : ""}`);
  }
  return RootPage({ config, params: Promise.resolve(resolvedParams), searchParams, importMap });
};

export default Page;
