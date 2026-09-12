import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "muted",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "muted" | "accent" | "fg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        tone === "accent" && "bg-accent text-accent-fg",
        tone === "fg" && "bg-fg text-bg",
        tone === "muted" && "bg-bg-muted text-muted",
        className,
      )}
      {...props}
    />
  );
}
