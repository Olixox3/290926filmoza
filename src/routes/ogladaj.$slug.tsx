import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { VideoPlayer } from "@/components/player/video-player";
import { getWatchPayload } from "@/lib/server/catalog";
import { getProgress, saveProgress } from "@/lib/server/account";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

type Search = { e?: number };

export const Route = createFileRoute("/ogladaj/$slug")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    e: s.e == null || s.e === "" ? undefined : Number(s.e),
  }),
  component: WatchPage,
});

function WatchPage() {
  const { slug } = Route.useParams();
  const { e } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const payload = useQuery({
    queryKey: ["watch", slug, e ?? null],
    queryFn: () => getWatchPayload({ data: { slug, episodeId: e ?? null } }),
  });
  const titleId = payload.data?.title.id;
  const progress = useQuery({
    queryKey: ["progress", titleId],
    queryFn: () => getProgress({ data: titleId! }),
    enabled: Boolean(user) && Boolean(titleId) && !isPending,
  });
  const save = useMutation({
    mutationFn: (input: { titleId: number; episodeId: number | null; positionSeconds: number; durationSeconds: number }) =>
      saveProgress({ data: input }),
  });
  const saveMutate = save.mutate;
  const saveRef = useRef(saveMutate);
  saveRef.current = saveMutate;

  const [sourceId, setSourceId] = useState<number | null>(null);
  const sources = payload.data?.sources ?? [];
  const source = useMemo(
    () => sources.find((s) => s.id === sourceId) ?? sources.find((s) => s.isPrimary) ?? sources[0],
    [sources, sourceId],
  );

  const onProgress = useCallback(
    (position: number, duration: number) => {
      if (!user || !payload.data) return;
      saveRef.current({
        titleId: payload.data.title.id,
        episodeId: payload.data.episode?.id ?? null,
        positionSeconds: position,
        durationSeconds: duration,
      });
    },
    [payload.data, user],
  );

  const t = payload.data?.title;
  const ep = payload.data?.episode;
  const progressReady = !isPending && (!user || progress.isFetched || progress.isError);
  const startAt =
    progress.data && progress.data.episodeId === (ep?.id ?? null) ? progress.data.positionSeconds : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <Link
          to={t ? "/tytul/$slug" : "/"}
          params={t ? { slug: t.slug } : {}}
          className="grid size-10 place-items-center rounded-md hover:bg-bg-muted"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <Logo compact />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{t?.title ?? "Odtwarzacz"}</p>
          {ep ? (
            <p className="truncate text-xs text-muted">
              Odc. {ep.episodeNumber} · {ep.title}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-8">
        {payload.isLoading || !progressReady ? (
          <div className="aspect-video animate-pulse rounded-lg bg-bg-muted" />
        ) : !t ? (
          <p className="py-20 text-center text-sm text-muted">Nie znaleziono tytułu.</p>
        ) : !source ? (
          <div className="rounded-lg border border-border bg-bg-elevated px-6 py-16 text-center">
            <p className="font-medium">Brak pliku wideo</p>
            <p className="mt-2 text-sm text-muted">Administrator nie dodał jeszcze źródła odtwarzania.</p>
          </div>
        ) : (
          <VideoPlayer
            key={`${source.id}-${ep?.id ?? "movie"}`}
            src={source.url}
            kind={source.kind}
            poster={t.backdropUrl ?? t.posterUrl}
            title={ep ? `${t.title} — ${ep.title}` : t.title}
            startAt={startAt}
            onProgress={onProgress}
          />
        )}

        {sources.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSourceId(s.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  (source?.id === s.id ? "border-fg bg-fg text-bg" : "border-border hover:bg-bg-muted"),
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : null}

        {t && t.kind !== "movie" ? (
          <div className="space-y-3">
            <h2 className="font-display text-2xl tracking-wide">Odcinki</h2>
            {t.seasons.map((s) => (
              <div key={s.id}>
                <p className="mb-2 text-xs text-muted">{s.name ?? `Sezon ${s.seasonNumber}`}</p>
                <div className="grid gap-1">
                  {s.episodes.map((item) => (
                    <Link
                      key={item.id}
                      to="/ogladaj/$slug"
                      params={{ slug: t.slug }}
                      search={{ e: item.id }}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm hover:bg-bg-muted",
                        item.id === ep?.id && "bg-bg-muted",
                      )}
                    >
                      <span className="text-subtle">{item.episodeNumber}. </span>
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
