import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CatalogHero } from "@/components/catalog/hero";
import { PosterRow } from "@/components/catalog/poster-card";
import { listCatalog } from "@/lib/server/catalog";
import { listContinueWatching } from "@/lib/server/account";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { TitleCard } from "@/lib/types";

export const Route = createFileRoute("/_site/")({
  loader: () => listCatalog(),
  component: HomePage,
});

function HomePage() {
  const catalog = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const cont = useQuery({
    queryKey: ["continue"],
    queryFn: () => listContinueWatching(),
    enabled: Boolean(user) && !isPending,
  });

  const titles = catalog.titles ?? [];
  const featured = titles.filter((t) => t.isFeatured);
  const hero = featured[0] ?? titles[0];
  const byGenre = (slug: string) => titles.filter((t) => t.genres.some((g) => g.slug === slug));
  const byKind = (kind: TitleCard["kind"]) => titles.filter((t) => t.kind === kind);

  return (
    <div className="space-y-10">
      {hero ? <CatalogHero title={hero} /> : <EmptyHome />}
      {cont.data?.length ? <PosterRow heading="Oglądaj dalej" titles={cont.data.map((c) => c.title)} /> : null}
      <PosterRow heading="Wyróżnione" titles={featured} />
      <PosterRow heading="Filmy" titles={byKind("movie")} href="/filmy" />
      <PosterRow heading="Seriale" titles={byKind("series")} href="/seriale" />
      <PosterRow heading="Programy" titles={byKind("show")} href="/programy" />
      <PosterRow heading="Animacja" titles={byGenre("animacja")} href="/gatunek/animacja" />
      <PosterRow heading="Klasyka" titles={byGenre("klasyka")} href="/gatunek/klasyka" />
      <PosterRow heading="Horror" titles={byGenre("horror")} href="/gatunek/horror" />
      <PosterRow heading="Kino nieme" titles={byGenre("niemy")} href="/gatunek/niemy" />
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
