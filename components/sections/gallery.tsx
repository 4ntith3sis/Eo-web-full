"use client";

import Image from "next/image";
import { useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  if (images.length === 0) return null;
  const activeImage = images[activeIndex] ?? images[0];
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
        <div className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <figure className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
            <Image src={activeImage.src} alt={activeImage.alt} fill priority sizes="(max-width: 1024px) 100vw, 960px" className="object-cover" />
          </figure>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2" aria-label="Pilih foto kantor">
            {images.map((img, i) => (
              <button key={`${img.src}-${i}`} type="button" onClick={() => setActiveIndex(i)} aria-label={`Lihat foto ${i + 1}`} aria-pressed={activeIndex === i} className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all sm:h-24 sm:w-36 ${activeIndex === i ? "border-emerald-500 shadow-md" : "border-transparent opacity-75 hover:opacity-100"}`}>
                <Image src={img.src} alt={img.alt} fill sizes="144px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
