import { type ReactNode } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  return <div className="scroll-reveal-root">{children}</div>;
}
