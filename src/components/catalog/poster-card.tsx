import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { KIND_LABEL, type TitleCard } from "@/lib/types";

function hashHue(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 33 + input.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function FallbackPoster({
  title,
  year,
  kind,
}: {
  title: string;
  year: number | null;
  kind: TitleCard["kind"];
}) {
  const hue = hashHue(title);
  return (
    <div
      className="absolute inset-0 flex flex-col justify-end p-3"
      style={{
        background: `linear-gradient(165deg, hsl(${hue} 14% 22%), hsl(${(hue + 40) % 360} 28% 8%))`,
      }}
    >
      <span className="font-display text-2xl leading-none tracking-wide text-fg/95">{title}</span>
      <span className="mt-1 text-[11px] text-fg/70">
        {year ?? "—"} · {KIND_LABEL[kind]}
      </span>
    </div>
  );
}

export function PosterCard({
  title,
  className,
  progress,
}: {
  title: TitleCard;
  className?: string;
  progress?: number;
}) {
  return (
    <Link
      to="/tytul/$slug"
      params={{ slug: title.slug }}
      className={cn(
        "group relative block overflow-hidden rounded-md bg-card outline-none ring-offset-bg focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {title.posterUrl ? (
          <img
            src={title.posterUrl}
            alt=""
            className="size-full object-cover transition-transform duration-300 ease-[var(--ease-smooth-out)] group-hover:scale-[1.04]"
          />
        ) : (
          <FallbackPoster title={title.title} year={title.year} kind={title.kind} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg/90 via-bg/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-1 p-2.5 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="mb-1.5 grid size-8 place-items-center rounded-full bg-fg text-bg">
            <Play className="size-3.5 fill-current" />
          </div>
          <p className="line-clamp-2 font-medium text-sm leading-tight">{title.title}</p>
          <p className="mt-0.5 text-[11px] text-muted">
            {title.year ?? "—"}
            {title.runtimeMinutes ? ` · ${title.runtimeMinutes} min` : ""}
          </p>
        </div>
        <div className="absolute top-2 left-2 flex gap-1">
          {title.quality ? <Badge tone="fg">{title.quality}</Badge> : null}
        </div>
        <div className="absolute top-2 right-2">
          <Badge>{KIND_LABEL[title.kind]}</Badge>
        </div>
        {progress != null && progress > 0 && progress < 0.95 ? (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-fg/20">
            <div className="h-full bg-accent" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        ) : null}
      </div>
      <div className="px-1 pt-2 pb-1">
        <p className="line-clamp-1 text-sm font-medium">{title.title}</p>
        <p className="text-xs text-muted">{title.year ?? KIND_LABEL[title.kind]}</p>
      </div>
    </Link>
  );
}

export function PosterRow({
  heading,
  titles,
  href,
}: {
  heading: string;
  titles: TitleCard[];
  href?: string;
}) {
  if (!titles.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl tracking-wide text-fg md:text-3xl">{heading}</h2>
        {href ? (
          <a href={href} className="text-xs font-medium text-muted hover:text-fg">
            Zobacz wszystkie
          </a>
        ) : null}
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
        {titles.map((t) => (
          <PosterCard key={t.id} title={t} className="w-32 shrink-0 sm:w-36 md:w-40" />
        ))}
      </div>
    </section>
  );
}

export function PosterGrid({ titles }: { titles: TitleCard[] }) {
  if (!titles.length) {
    return <p className="py-16 text-center text-sm text-muted">Brak tytułów w tej kategorii.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {titles.map((t) => (
        <PosterCard key={t.id} title={t} />
      ))}
    </div>
  );
}
