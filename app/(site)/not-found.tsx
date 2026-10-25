import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="py-16 text-center sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-navy/60">
        404
      </p>
      <h1 className="mx-auto mt-4 max-w-xl text-3xl font-bold tracking-tight text-navy sm:text-4xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-600">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke Beranda
      </Link>
    </Container>
  );
}
