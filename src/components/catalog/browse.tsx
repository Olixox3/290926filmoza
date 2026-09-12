import { useMemo, useState } from "react";
import { PosterGrid } from "@/components/catalog/poster-card";
import type { TitleCard, TitleKind } from "@/lib/types";
import { KIND_PLURAL } from "@/lib/types";

const SORTS = [
  { id: "featured", label: "Wyróżnione" },
  { id: "year", label: "Najnowsze" },
  { id: "title", label: "A–Z" },
  { id: "rating", label: "Ocena" },
] as const;

export function BrowsePage({
  kind,
  titles,
  heading,
}: {
  kind?: TitleKind;
  titles: TitleCard[];
  heading?: string;
}) {
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");
  const genres = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of titles) for (const g of t.genres) map.set(g.slug, g.name);
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], "pl"));
  }, [titles]);

  const filtered = useMemo(() => {
    let list = titles.filter((t) => (kind ? t.kind === kind : true));
    if (genre !== "all") list = list.filter((t) => t.genres.some((g) => g.slug === genre));
    const copy = [...list];
    copy.sort((a, b) => {
      if (sort === "year") return (b.year ?? 0) - (a.year ?? 0);
      if (sort === "title") return a.title.localeCompare(b.title, "pl");
      if (sort === "rating") return (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0);
      return Number(b.isFeatured) - Number(a.isFeatured) || (b.year ?? 0) - (a.year ?? 0);
    });
    return copy;
  }, [titles, kind, genre, sort]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium tracking-[0.18em] text-subtle uppercase">Katalog</p>
        <h1 className="font-display text-4xl tracking-wide md:text-5xl">
          {heading ?? (kind ? KIND_PLURAL[kind] : "Wszystko")}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="h-10 rounded-md border border-border bg-bg-elevated px-3 text-sm"
          aria-label="Gatunek"
        >
          <option value="all">Wszystkie gatunki</option>
          {genres.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-10 rounded-md border border-border bg-bg-elevated px-3 text-sm"
          aria-label="Sortowanie"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-subtle">{filtered.length} tytułów</span>
      </div>
      <PosterGrid titles={filtered} />
    </div>
  );
}
