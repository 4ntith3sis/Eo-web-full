import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomepageRenderer } from "@/components/puck/homepage-renderer";
import { getCmsComparisonRows, getCmsHomepageFacilities, getCmsPromotions, getCmsPublishedPuckPage, getCmsServices, getCmsSite, getCmsTestimonials } from "@/lib/data/cms-data";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPublishedPuckPage(`/${slug.join("/")}`);
  return page ? { title: page.name ?? "EasyOffice" } : {};
}

export default async function PublishedPuckPage({ params }: Props) {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  const page = await getCmsPublishedPuckPage(route);
  if (!page?.layout) notFound();
  const [services, testimonials, promotions, comparisonRows, facilities, site] = await Promise.all([
    getCmsServices(),
    getCmsTestimonials(),
    getCmsPromotions(),
    getCmsComparisonRows(),
    getCmsHomepageFacilities(),
    getCmsSite(),
  ]);
  return <HomepageRenderer layout={page.layout} services={services} promotions={promotions} testimonials={testimonials} comparisonRows={comparisonRows} facilities={facilities} site={site} />;
}
