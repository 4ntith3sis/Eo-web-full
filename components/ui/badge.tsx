import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-navy/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy",
        className,
      )}
    >
      {children}
    </span>
  );
}
