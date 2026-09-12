import { Link } from "@tanstack/react-router";
import { Info, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KIND_LABEL, type TitleCard } from "@/lib/types";

export function CatalogHero({ title }: { title: TitleCard }) {
  return (
    <section className="relative min-h-[78vw] overflow-hidden rounded-xl md:min-h-[420px] lg:min-h-[520px]">
      {title.backdropUrl || title.posterUrl ? (
        <img
          src={title.backdropUrl ?? title.posterUrl ?? ""}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-bg-muted" />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/75 to-bg/20" />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/30 to-transparent" />
      <div className="relative z-10 flex min-h-[78vw] max-w-xl flex-col justify-end gap-4 p-5 md:min-h-[420px] md:p-10 lg:min-h-[520px]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{KIND_LABEL[title.kind]}</Badge>
          {title.year ? <Badge>{title.year}</Badge> : null}
          {title.quality ? <Badge tone="fg">{title.quality}</Badge> : null}
          {title.ageRating ? <Badge>{title.ageRating}+</Badge> : null}
        </div>
        <h1 className="font-display text-5xl leading-[0.9] tracking-wide md:text-7xl">{title.title}</h1>
        {title.originalTitle && title.originalTitle !== title.title ? (
          <p className="text-sm text-muted">{title.originalTitle}</p>
        ) : null}
        <p className="line-clamp-3 max-w-lg text-sm leading-relaxed text-fg/85 md:text-base">
          {title.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="lg" variant="cinema">
            <Link to="/ogladaj/$slug" params={{ slug: title.slug }}>
              <Play className="size-4 fill-current" />
              Oglądaj
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/tytul/$slug" params={{ slug: title.slug }}>
              <Info className="size-4" />
              Więcej info
            </Link>
          </Button>
        </div>
        <p className="text-xs text-subtle">
          {title.genres.map((g) => g.name).join(" · ")}
          {title.director ? ` · reż. ${title.director}` : ""}
        </p>
      </div>
    </section>
  );
}
