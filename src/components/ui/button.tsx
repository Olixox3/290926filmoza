import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,transform,opacity] duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:bg-accent/90",
        cinema: "bg-fg text-bg hover:bg-fg/90",
        secondary: "bg-bg-muted text-fg hover:bg-bg-muted/80",
        outline: "border border-border bg-transparent hover:bg-bg-muted",
        ghost: "hover:bg-bg-muted text-fg",
        link: "text-fg underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 rounded-md px-4",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "size-10 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
