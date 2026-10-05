"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { MobileNav } from "./mobile-nav";
import { navItems } from "./nav";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-8 px-5 sm:h-[72px] sm:px-8">
        <Link href="/" aria-label="EasyOffice — Beranda" className="shrink-0">
          <Image
            src="/images/logo-EO.png"
            alt="EasyOffice"
            width={1418}
            height={1225}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDropOpen(true)}
                onMouseLeave={() => setDropOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setDropOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={dropOpen}
                  className="inline-flex items-center gap-1 text-[0.95rem] font-semibold text-navy/70 transition-colors hover:text-navy"
                >
                  {item.label}
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", dropOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>
                {dropOpen ? (
                  <div className="absolute left-0 top-full w-64 pt-2">
                    <ul className="rounded-xl border border-neutral-200 bg-white py-2 shadow-card">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2.5 transition-colors hover:bg-neutral-50"
                          >
                            <span className="block text-sm font-medium text-neutral-800">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="block text-xs text-neutral-500">
                                {child.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : item.href ? (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "relative pb-1 text-[0.95rem] font-semibold transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-navy after:transition-all after:duration-300 hover:text-navy hover:after:w-full",
                  pathname === item.href ? "text-navy after:w-full" : "text-navy/70 after:w-0",
                )}
              >
                {item.label}
              </Link>
            ) : null,
          )}
        </nav>

        <div className="hidden lg:block">
          <a
            href={whatsappUrl("Halo EasyOffice, saya ingin bertanya tentang layanan Anda.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Hubungi Kami
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-navy hover:bg-neutral-100 lg:hidden"
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      {open ? <MobileNav onNavigate={() => setOpen(false)} /> : null}
    </header>
  );
}
