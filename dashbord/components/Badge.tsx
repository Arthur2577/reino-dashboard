import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "accent" | "success" | "warning" | "neutral";
};

const tones = {
  accent: "bg-accent-soft text-accent-text",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  neutral: "bg-surface-hover text-text-secondary",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
