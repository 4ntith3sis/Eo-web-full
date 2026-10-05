import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "./container";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-neutral-200 bg-surface">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-3 text-sm">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 ? (
                  <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden />
                ) : null}
                {item.href && !last ? (
                  <Link href={item.href} className="text-neutral-500 hover:text-navy">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-navy" : "text-neutral-500"}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
