import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle",
        "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
        className,
      )}
      {...props}
    />
  );
}
