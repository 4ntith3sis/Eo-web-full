"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/types";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqs: Faq[];
}

export function FaqSection({
  title = "Pertanyaan Umum",
  description = "Jawaban atas pertanyaan yang paling sering diajukan tentang EasyOffice.",
  faqs,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section eyebrow="FAQ" title={title} description={description}>
      <div className="mx-auto max-w-3xl divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {faqs.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="text-sm font-semibold text-navy sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-navy transition-transform",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {open ? (
                <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 sm:px-6">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
