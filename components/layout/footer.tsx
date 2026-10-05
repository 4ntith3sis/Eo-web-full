import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { locations, services, site } from "@/lib/data/mock-data";
import { WHATSAPP_NUMBER, whatsappUrl } from "@/lib/whatsapp";
import { navItems } from "./nav";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-8 pt-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/images/logo-EO.png"
              alt="EasyOffice"
              width={1418}
              height={1225}
              className="h-12 w-auto rounded-xl bg-white px-2 py-1"
            />
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              {site.tagline}. Virtual Office, Coworking Space, dan Meeting Room
              di Bandung, Jakarta, dan Bekasi.
            </p>
            <ul className="mt-6 space-y-2.5">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/layanan/virtual-office/${loc.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    <MapPin className="h-4 w-4" aria-hidden />
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Layanan">
            <h4 className="font-display relative pb-2.5 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-10 after:bg-white/30">
              Layanan Kami
            </h4>
            <ul className="mt-5 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={s.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Perusahaan">
            <h4 className="font-display relative pb-2.5 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-10 after:bg-white/30">
              Perusahaan
            </h4>
            <ul className="mt-5 space-y-2.5">
              {navItems
                .filter((item) => item.href && item.href !== "/")
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href!} className="text-sm text-white/70 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-display relative pb-2.5 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-10 after:bg-white/30">
              Hubungi Kami
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-white/70">
              <li>
                <a
                  href={whatsappUrl("Halo EasyOffice, saya ingin bertanya tentang layanan Anda.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {site.phoneDisplay} (contoh)
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <Clock className="h-4 w-4" aria-hidden />
                Senin–Jumat, 08.00–17.00 WIB
              </li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-white/50">
              Nomor telepon dan email di atas adalah data contoh untuk pengembangan.
              ({WHATSAPP_NUMBER})
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Seluruh hak cipta dilindungi.</p>
          <p>Harga, promo, dan testimoni di situs ini adalah data contoh.</p>
        </div>
      </div>
    </footer>
  );
}
