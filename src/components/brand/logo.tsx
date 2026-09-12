import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-fg no-underline">
      <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-accent text-accent-fg">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="1.5" fill="currentColor" />
          <rect x="6" y="8" width="12" height="8" fill="#08080a" />
          <circle cx="9" cy="12" r="1.1" fill="currentColor" />
          <circle cx="15" cy="12" r="1.1" fill="currentColor" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display leading-none tracking-[0.08em]",
          compact ? "text-2xl" : "text-[1.85rem]",
        )}
      >
        FILMOZA
      </span>
    </Link>
  );
}
