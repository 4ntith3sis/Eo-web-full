import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-neutral-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
