import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { HomepageRenderer } from "@/components/puck/homepage-renderer";
import { getCmsComparisonRows, getCmsHomepageFacilities, getCmsPartners, getCmsPromotions, getCmsPublishedPuckPage, getCmsServices, getCmsSite, getCmsTestimonials } from "@/lib/data/cms-data";

type Props = { params: Promise<{ slug: string[] }>; searchParams?: Promise<{ preview?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const page = await getCmsPublishedPuckPage(`/${slug.join("/")}`, query.preview);
  const site = await getCmsSite();
  return page ? { title: page.seoTitle ?? page.name ?? site.defaultSeoTitle ?? "EasyOffice", description: page.seoDescription ?? site.defaultSeoDescription ?? `Informasi ${page.name ?? "EasyOffice"}.`, ...(query.preview ? { robots: { index: false, follow: false } } : {}) } : {};
}

export default async function PublishedPuckPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  const query = searchParams ? await searchParams : {};
  let previewToken = query.preview;
  if (previewToken) {
    const cookieHeader = (await cookies()).toString();
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000"}/api/users/me`, { headers: { cookie: cookieHeader }, cache: "no-store" }).catch(() => null);
    const user = userResponse?.ok ? await userResponse.json() as { user?: { role?: string } } : null;
    if (user?.user?.role !== "admin" && user?.user?.role !== "editor") previewToken = undefined;
  }
  const page = await getCmsPublishedPuckPage(route, previewToken);
  if (!page?.layout) notFound();
  const [services, testimonials, promotions, comparisonRows, facilities, partners, site] = await Promise.all([
    getCmsServices(),
    getCmsTestimonials(),
    getCmsPromotions(),
    getCmsComparisonRows(),
    getCmsHomepageFacilities(),
    getCmsPartners(),
    getCmsSite(),
  ]);
  return <HomepageRenderer layout={page.layout} services={services} promotions={promotions} testimonials={testimonials} partners={partners} comparisonRows={comparisonRows} facilities={facilities} site={site} />;
}
