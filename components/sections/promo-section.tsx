import { ArrowRight, CalendarDays, MessageCircle, Tag } from "lucide-react";
import { promoNotice, promotions } from "@/lib/data/mock-data";
import { whatsappFor } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function PromoSection({
  title = "Promo Spesial",
  description = "Penawaran menarik untuk membantu Anda memulai dengan biaya lebih hemat.",
  showAllLink = true,
}: {
  title?: string;
  description?: string;
  showAllLink?: boolean;
}) {
  return (
    <Section eyebrow="Promo" title={title} description={description}>
      <div className="grid gap-6 md:grid-cols-3">
        {promotions.map((promo) => (
          <Card key={promo.title} className="flex flex-col">
            <Badge>{promo.badge}</Badge>
            <h3 className="mt-4 flex items-start gap-2 font-display text-base font-bold leading-snug text-navy">
              <Tag className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              {promo.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
              {promo.description}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-neutral-500">
              <CalendarDays className="h-4 w-4" aria-hidden />
              {promo.period}
            </p>
            <div className="mt-5">
              <Button href={whatsappFor(`promo "${promo.title}"`)} external size="sm" fullWidth>
                <MessageCircle className="h-4 w-4" aria-hidden />
                Klaim via WhatsApp
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-neutral-500">
        {promoNotice}
      </p>
      {showAllLink ? (
        <div className="mt-8 text-center">
          <Button href="/promo" variant="outline">
            Lihat Semua Promo
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      ) : null}
    </Section>
  );
}
