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
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft sm:p-8"
          >
            {plan.featured ? (
              <span className="mb-4 inline-flex w-fit rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                Paling Populer
              </span>
            ) : null}
            <h3 className="text-lg font-semibold text-navy">{plan.name}</h3>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold tracking-tight text-navy">
                {plan.price}
              </span>
              <span className="text-sm text-neutral-500">{plan.period}</span>
            </p>
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
        ))}
      </div>
    </Section>
  );
}
