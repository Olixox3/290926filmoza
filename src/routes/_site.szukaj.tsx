import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PosterGrid } from "@/components/catalog/poster-card";
import { Input } from "@/components/ui/input";
import { searchTitles } from "@/lib/server/catalog";

type Search = { q: string };

export const Route = createFileRoute("/_site/szukaj")({
  validateSearch: (s: Record<string, unknown>): Search => ({ q: String(s.q ?? "") }),
  component: Page,
});

function Page() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const results = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchTitles({ data: q }),
    enabled: q.trim().length > 0,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl tracking-wide">Szukaj</h1>
      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
        <Input
          defaultValue={q}
          placeholder="Tytuł, reżyser, opis…"
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              void navigate({ to: "/szukaj", search: { q: value } });
            }
          }}
        />
      </div>
      {q.trim() ? (
        results.isLoading ? (
          <p className="text-sm text-muted">Szukam…</p>
        ) : (
          <>
            <p className="text-sm text-muted">
              Wyniki dla „{q}” · {results.data?.length ?? 0}
            </p>
            <PosterGrid titles={results.data ?? []} />
          </>
        )
      ) : (
        <p className="text-sm text-muted">Wpisz tytuł filmu, serialu albo nazwisko reżysera.</p>
      )}
    </div>
  );
}
