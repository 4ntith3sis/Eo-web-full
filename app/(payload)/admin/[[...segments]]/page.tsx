import config from "@/payload.config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { redirect } from "next/navigation";
import { importMap } from "../importMap.js";
import { PuckBuilder } from "@/components/puck/puck-builder";

type PayloadRouteProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: PayloadRouteProps) => generatePageMetadata({ config, params, searchParams });

const Page = async ({ params, searchParams }: PayloadRouteProps) => {
  const resolvedParams = await params;
  if (resolvedParams.segments?.join("/") === "puck-builder") {
    redirect("/admin/collections/homepage-layout");
  }
  if (resolvedParams.segments?.join("/") === "puck-builder/edit") {
    return <div className="min-h-screen bg-white"><PuckBuilder /></div>;
  }
  return RootPage({ config, params: Promise.resolve(resolvedParams), searchParams, importMap });
};

export default Page;
