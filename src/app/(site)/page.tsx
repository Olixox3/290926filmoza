import { CatalogHero } from "@/components/catalog/hero";
import { PosterRow } from "@/components/catalog/poster-card";
import { listMedia } from "@/lib/catalog";

export default async function HomePage() {
  const titles = await listMedia();
  const featured = titles.filter((t) => t.isFeatured);
  const hero = featured[0] ?? titles[0];
  const byGenre = (slug: string) => titles.filter((t) => t.genres.some((g) => g.slug === slug));

  return (
    <div className="space-y-10">
      {hero ? <CatalogHero title={hero} /> : <EmptyHome />}
      <PosterRow heading="Wyróżnione" titles={featured} />
      <PosterRow heading="Filmy" titles={titles.filter((t) => t.kind === "movie")} href="/filmy" />
      <PosterRow heading="Seriale" titles={titles.filter((t) => t.kind === "series")} href="/seriale" />
      <PosterRow heading="Animacja" titles={byGenre("animacja")} href="/gatunek/animacja" />
      <PosterRow heading="Horror" titles={byGenre("horror")} href="/gatunek/horror" />
      <PosterRow heading="Klasyka" titles={byGenre("klasyka")} href="/gatunek/klasyka" />
    </div>
  );
}

function EmptyHome() {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated px-6 py-16 text-center">
      <h1 className="font-display text-4xl tracking-wide">Filmoza</h1>
      <p className="mt-2 text-sm text-muted">Katalog jest pusty. Zaloguj się jako admin i dodaj pierwszy tytuł.</p>
    </div>
  );
}
