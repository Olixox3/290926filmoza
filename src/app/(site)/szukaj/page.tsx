import { PosterGrid } from "@/components/catalog/poster-card";
import { listMedia } from "@/lib/catalog";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const titles = query ? await listMedia({ q: query }) : [];
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl tracking-wide">Szukaj</h1>
      <form>
        <input
          name="q"
          defaultValue={query}
          placeholder="Tytuł, gatunek…"
          className="h-11 w-full max-w-md rounded-md border border-border bg-bg-elevated px-3 text-sm"
        />
      </form>
      {query ? <PosterGrid titles={titles} /> : <p className="text-sm text-muted">Wpisz frazę, żeby przeszukać katalog.</p>}
    </div>
  );
}
