import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary:
    "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent-hover active:scale-[0.98]",
  secondary:
    "border border-border text-text-secondary hover:bg-surface-hover",
};

export function Button({ children, href, variant = "primary", className = "" }: ButtonProps) {
  const classes = `flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
