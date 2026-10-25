import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Promotion, Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { whatsappFor } from "@/lib/whatsapp";

export function PromoCard({ promo, service, whatsappNumber }: { promo: Promotion; service?: Service; whatsappNumber?: string }) {
  if (!service) return null;
  return <Card className="mx-auto flex h-full w-full max-w-[306px] flex-col rounded-[1.35rem] border border-neutral-200/80 bg-white !p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:!p-3"><div className="relative aspect-[0.92/1] overflow-hidden rounded-[1.15rem] bg-navy/10"><Image src={promo.image ?? service.image} alt={service.imageAlt} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" className="object-cover" /></div><div className="flex flex-1 flex-col px-1 pb-0.5 pt-3 sm:px-1.5"><h2 className="line-clamp-2 min-h-12 font-display text-base font-semibold leading-snug text-navy sm:min-h-14 sm:text-lg">{promo.title}</h2><p className="mt-0.5 line-clamp-2 min-h-0 text-xs leading-relaxed text-neutral-600">{promo.description}</p><div className="mt-3 flex items-center gap-3"><Button href={service.href} size="md" fullWidth className="!h-12 !min-h-12 rounded-full bg-navy px-4 text-xs hover:bg-navy/90 sm:text-sm">Cek Selengkapnya <ArrowRight className="h-4 w-4" aria-hidden /> </Button><Button href={whatsappFor(`promo "${promo.title}"`, undefined, whatsappNumber)} external size="md" className="!h-12 !min-h-12 !w-12 shrink-0 !rounded-full !border-0 !bg-navy !p-0 !text-white shadow-md hover:!bg-navy/90" aria-label={`Konsultasi promo ${promo.title}`}><MessageCircle className="h-6 w-6" aria-hidden /></Button></div></div></Card>;
}
