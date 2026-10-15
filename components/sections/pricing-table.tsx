import { Check, MessageCircle } from "lucide-react";
import type { PricingPlan } from "@/types";
import { PRICE_NOTE } from "@/lib/data/mock-data";
import { whatsappFor } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

interface PricingTableProps {
  eyebrow?: string;
  title: string;
  description?: string;
  plans: PricingPlan[];
  topic: string;
  locationName?: string;
  whatsappNumber?: string;
  tone?: "white" | "gray";
}

export function PricingTable({
  eyebrow = "Harga",
  title,
  description,
  plans,
  topic,
  locationName,
  whatsappNumber,
  tone = "white",
}: PricingTableProps) {
  return (
    <Section eyebrow={eyebrow} title={title} description={description} tone={tone}>
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-2xl border p-6 shadow-soft sm:p-8",
              plan.featured
                ? "border-navy bg-navy text-white"
                : "border-neutral-200 bg-white",
            )}
          >
            {plan.featured ? (
              <span className="mb-4 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                Paling Populer
              </span>
            ) : null}
            <h3 className={cn("text-lg font-semibold", plan.featured ? "text-white" : "text-navy")}>
              {plan.name}
            </h3>
            <p className="mt-3 flex items-baseline gap-1">
              <span className={cn("font-display text-3xl font-bold tracking-tight", plan.featured ? "text-white" : "text-navy")}>
                {plan.price}
              </span>
              <span className={cn("text-sm", plan.featured ? "text-white/75" : "text-neutral-500")}>
                {plan.period}
              </span>
            </p>
            <ul className={cn("mt-6 flex-1 space-y-3 text-sm", plan.featured ? "text-white/90" : "text-neutral-700")}>
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                href={whatsappFor(`${topic} paket ${plan.name}`, locationName, whatsappNumber)}
                external
                variant={plan.featured ? "white" : "primary"}
                fullWidth
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {plan.ctaLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-neutral-500">
        {PRICE_NOTE}
      </p>
    </Section>
  );
}
