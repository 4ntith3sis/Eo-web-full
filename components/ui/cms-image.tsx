import Image, { type ImageProps } from "next/image";
import { normalizeMediaUrl } from "@/lib/media";

export function CmsImage({ src, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  const normalizedSrc = normalizeMediaUrl(src);
  const isSupabaseMedia = normalizedSrc.startsWith("https://qbfgapkitvhlylyrbivs.supabase.co/");
  return <Image src={normalizedSrc} unoptimized={isSupabaseMedia} {...props} />;
}
