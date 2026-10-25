"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { navItems as defaultNavItems, type NavItem } from "./nav";

export function MobileNav({ onNavigate, whatsappNumber, ctaLabel = "Hubungi Kami", ctaMessage, navItems }: { onNavigate: () => void; whatsappNumber?: string; ctaLabel?: string; ctaMessage?: string; navItems?: NavItem[] }) {
  const [expanded, setExpanded] = useState<string | null>("Layanan");

  const items = navItems?.length ? navItems : defaultNavItems;
  return (
    <nav
      aria-label="Navigasi seluler"
      className="border-t border-neutral-200 bg-white px-5 py-4 lg:hidden"
    >
      <ul className="flex flex-col">
        {items.map((item) =>
          item.children?.length ? (
            <li key={item.label} className="border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                aria-expanded={expanded === item.label}
                className="flex w-full items-center justify-between py-3.5 text-sm font-medium text-neutral-800"
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-navy transition-transform",
                    expanded === item.label && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {expanded === item.label ? (
                <ul className="mb-2 ml-3 border-l-2 border-navy/15 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href + child.label}>
                      <Link
                        href={child.href}
                        onClick={onNavigate}
                        className="block py-4 text-sm text-neutral-700 hover:text-navy"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ) : item.href ? (
            <li key={item.href + item.label} className="border-b border-neutral-100 last:border-0">
              <Link
                href={item.href}
                onClick={onNavigate}
                className="block py-3.5 text-sm font-medium text-neutral-800 hover:text-navy"
              >
                {item.label}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
      <a
         href={whatsappUrl(ctaMessage ?? "Halo EasyOffice, saya ingin bertanya tentang layanan Anda.", whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy/90"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
         {ctaLabel}
      </a>
    </nav>
  );
}
