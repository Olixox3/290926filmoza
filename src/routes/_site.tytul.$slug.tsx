import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart, Play, Star } from "lucide-react";
import { PosterCard } from "@/components/catalog/poster-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTitleBySlug } from "@/lib/server/catalog";
import { getMyRating, isFavorite, rateTitle, toggleFavorite } from "@/lib/server/account";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { KIND_LABEL } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_site/tytul/$slug")({
  loader: ({ params }) => getTitleBySlug({ data: params.slug }),
  component: TitlePage,
});

function TitlePage() {
  const { slug } = Route.useParams();
  const loaded = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const title = useQuery({
    queryKey: ["title", slug],
    queryFn: () => getTitleBySlug({ data: slug }),
    initialData: loaded ?? undefined,
  });
  const fav = useQuery({
    queryKey: ["fav", title.data?.id],
    queryFn: () => isFavorite({ data: title.data!.id }),
    enabled: Boolean(user) && Boolean(title.data) && !isPending,
  });
  const mine = useQuery({
    queryKey: ["rating", title.data?.id],
    queryFn: () => getMyRating({ data: title.data!.id }),
    enabled: Boolean(user) && Boolean(title.data) && !isPending,
  });

  const tog = useMutation({
    mutationFn: () => toggleFavorite({ data: title.data!.id }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["fav", title.data?.id] });
      void qc.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => toast.error("Zaloguj się, żeby dodać do listy."),
  });
  const rate = useMutation({
    mutationFn: (score: number) => rateTitle({ data: { titleId: title.data!.id, score } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rating", title.data?.id] });
      void qc.invalidateQueries({ queryKey: ["title", slug] });
    },
  });

  if (title.isLoading) return <Skeleton className="h-[480px] w-full rounded-xl" />;
  const t = title.data;
  if (!t) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-4xl">Nie znaleziono</h1>
        <p className="mt-2 text-sm text-muted">Ten tytuł nie istnieje albo nie jest opublikowany.</p>
      </div>
    );
  }

  const firstEp = t.seasons[0]?.episodes[0];

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-lg bg-card">
          {t.posterUrl ? (
            <img src={t.posterUrl} alt="" className="aspect-[2/3] w-full object-cover" />
          ) : (
            <div className="aspect-[2/3] bg-bg-muted" />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{KIND_LABEL[t.kind]}</Badge>
            {t.year ? <Badge>{t.year}</Badge> : null}
            {t.quality ? <Badge tone="fg">{t.quality}</Badge> : null}
            {t.ageRating ? <Badge>{t.ageRating}+</Badge> : null}
            {t.runtimeMinutes ? <Badge>{t.runtimeMinutes} min</Badge> : null}
          </div>
          <h1 className="font-display text-5xl leading-none tracking-wide md:text-6xl">{t.title}</h1>
          {t.originalTitle && t.originalTitle !== t.title ? (
            <p className="text-sm text-muted">{t.originalTitle}</p>
          ) : null}
          <p className="max-w-2xl text-sm leading-relaxed text-fg/85 md:text-base">{t.description}</p>
          <dl className="grid gap-1 text-sm text-muted">
            {t.director ? (
              <div>
                <span className="text-subtle">Reżyseria · </span>
                {t.director}
              </div>
            ) : null}
            {t.castText ? (
              <div>
                <span className="text-subtle">Obsada · </span>
                {t.castText}
              </div>
            ) : null}
            {t.country ? (
              <div>
                <span className="text-subtle">Kraj · </span>
                {t.country}
              </div>
            ) : null}
            <div>
              <span className="text-subtle">Gatunki · </span>
              {t.genres.map((g, i) => (
                <span key={g.id}>
                  {i > 0 ? ", " : ""}
                  <Link to="/gatunek/$slug" params={{ slug: g.slug }} className="hover:text-fg">
                    {g.name}
                  </Link>
                </span>
              ))}
            </div>
            {t.ratingCount > 0 ? (
              <div>
                <span className="text-subtle">Ocena · </span>
                {(t.ratingAvg ?? 0).toFixed(1)} / 10 ({t.ratingCount})
              </div>
            ) : null}
          </dl>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild size="lg" variant="cinema">
              <Link
                to="/ogladaj/$slug"
                params={{ slug: t.slug }}
                search={firstEp ? { e: firstEp.id } : {}}
              >
                <Play className="size-4 fill-current" />
                Oglądaj
              </Link>
            </Button>
            <Button
              size="lg"
              variant={fav.data ? "default" : "outline"}
              onClick={() => tog.mutate()}
            >
              <Heart className={fav.data ? "size-4 fill-current" : "size-4"} />
              {fav.data ? "Na liście" : "Moja lista"}
            </Button>
          </div>
          {user ? (
            <div className="flex items-center gap-1 pt-2">
              <span className="mr-2 text-xs text-subtle">Twoja ocena</span>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => rate.mutate(n)}
                  className="grid size-7 place-items-center rounded-sm hover:bg-bg-muted"
                  aria-label={`Ocena ${n}`}
                >
                  <Star
                    className={`size-4 ${mine.data && n <= mine.data ? "fill-accent text-accent" : "text-subtle"}`}
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-subtle">Zaloguj się, żeby oceniać i zapisywać listę.</p>
          )}
        </div>
      </div>

      {t.seasons.length ? (
        <section className="space-y-4">
          <h2 className="font-display text-3xl tracking-wide">Odcinki</h2>
          {t.seasons.map((s) => (
            <div key={s.id} className="space-y-2">
              <h3 className="text-sm font-medium text-muted">{s.name ?? `Sezon ${s.seasonNumber}`}</h3>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {s.episodes.map((ep) => (
                  <li key={ep.id}>
                    <Link
                      to="/ogladaj/$slug"
                      params={{ slug: t.slug }}
                      search={{ e: ep.id }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-bg-muted"
                    >
                      <span className="w-8 text-xs tabular-nums text-subtle">{ep.episodeNumber}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{ep.title}</p>
                        {ep.description ? (
                          <p className="line-clamp-1 text-xs text-muted">{ep.description}</p>
                        ) : null}
                      </div>
                      {ep.runtimeMinutes ? (
                        <span className="text-xs text-subtle">{ep.runtimeMinutes} min</span>
                      ) : null}
                      <Play className="size-4 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {t.similar.length ? (
        <section className="space-y-4">
          <h2 className="font-display text-3xl tracking-wide">Podobne</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {t.similar.map((s) => (
              <PosterCard key={s.id} title={s} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
