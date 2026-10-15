import Image from "next/image";
import { Container } from "@/components/ui/container";

interface GalleryImage {
  src: string;
  alt: string;
}

export function Gallery({
  title = "Detail Kantor",
  description,
  images,
}: {
  title?: string;
  description?: string;
  images: GalleryImage[];
}) {
  if (images.length === 0) return null;
  return (
    <section className="bg-surface">
      <Container className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full border border-navy/15 bg-navy/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-navy">
            Detail Kantor
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-navy sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-10 grid min-w-0 gap-5 sm:mt-12 sm:grid-cols-3">
          {images.map((img, i) => (
            <figure
              key={`${img.src}-${i}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:shadow-card"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
