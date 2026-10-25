import config from "@/payload.config";
import { NotFoundPage } from "@payloadcms/next/views";
import { importMap } from "../importMap.js";

type PayloadRouteProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

const NotFound = ({ params, searchParams }: PayloadRouteProps) =>
  NotFoundPage({ config, params, searchParams, importMap });

export default NotFound;
