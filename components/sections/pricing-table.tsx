import { Check, MessageCircle } from "lucide-react";
import type { PricingPlan } from "@/types";
import { whatsappFor } from "@/lib/whatsapp";
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

function discountedPrice(plan: PricingPlan) {
  if (!plan.discountPercent || plan.discountedPrice) return plan.discountedPrice;
  const numericPrice = Number(plan.price.replace(/[^0-9]/g, ""));
  if (!numericPrice) return undefined;
  return `Rp ${Math.round(numericPrice * (1 - plan.discountPercent / 100)).toLocaleString("id-ID")}`;
}

function displayPrice(value: string) {
  return value.trim().startsWith("Rp") ? value : `Rp ${value}`;
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
          (() => {
            const salePrice = discountedPrice(plan);
            return (
          <div
            key={plan.name}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft sm:p-8"
          >
            {plan.featured ? (
              <span className="mb-4 inline-flex w-fit rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                Paling Populer
              </span>
            ) : null}
            <h3 className="text-lg font-semibold text-navy">{plan.name}</h3>
            {plan.description ? (
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{plan.description}</p>
            ) : null}
            <p className="mt-3 flex items-baseline gap-1">
              {salePrice ? (
                <span className="flex flex-col">
                  <span className="text-sm text-neutral-400 line-through">
                    {displayPrice(plan.price)} {plan.period}
                  </span>
                  <span className="font-display text-3xl font-bold tracking-tight text-navy">
                    {salePrice} {plan.period}
                  </span>
                </span>
              ) : (
                <span className="font-display text-3xl font-bold tracking-tight text-navy">
                   {displayPrice(plan.price)} {plan.period}
                </span>
              )}
            </p>
            {plan.discountPercent ? (
              <span className="mt-2 inline-flex w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Hemat {plan.discountPercent}%
              </span>
            ) : null}
            <ul className="mt-6 flex-1 space-y-3 text-sm text-neutral-700">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                href={whatsappFor(`${topic} paket ${plan.name}`, locationName, whatsappNumber)}
                external
                variant="primary"
                fullWidth
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {plan.ctaLabel}
              </Button>
            </div>
          </div>
            );
          })()
        ))}
      </div>
    </Section>
  );
}
