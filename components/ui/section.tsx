import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "gray" | "navy";
  id?: string;
}

const tones: Record<NonNullable<SectionProps["tone"]>, string> = {
  white: "bg-white",
  gray: "bg-surface",
  navy: "bg-navy text-white",
};

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
  tone = "white",
  id,
}: SectionProps) {
  const dark = tone === "navy";
  return (
    <section id={id} className={cn(tones[tone], "py-10 sm:py-12 lg:py-16", className)}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em]",
                dark
                  ? "border-white/25 bg-white/10 text-white/80"
                  : "border-navy/15 bg-navy/5 text-navy",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              "mt-3 font-display text-2xl font-bold tracking-tight sm:text-4xl",
              dark ? "text-white" : "text-navy",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-white/80" : "text-neutral-600")}>
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-10 min-w-0 sm:mt-12">{children}</div>
      </Container>
    </section>
  );
}
