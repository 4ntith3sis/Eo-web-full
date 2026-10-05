import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "white" | "outline-white";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white shadow-soft hover:bg-navy/90",
  secondary: "border border-neutral-200 bg-white text-navy hover:border-navy/40 hover:bg-navy/5",
  outline: "border border-neutral-300 bg-white text-navy hover:border-navy hover:bg-navy/5",
  white: "bg-white text-navy hover:bg-neutral-100",
  "outline-white": "border border-white/30 bg-white/10 text-white hover:bg-white hover:text-navy",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-7 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  children,
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  onClick,
  fullWidth,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 hover:-translate-y-0.5",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
