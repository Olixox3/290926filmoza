import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm text-fg placeholder:text-subtle",
        "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
