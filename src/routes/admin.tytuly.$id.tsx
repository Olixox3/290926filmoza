import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { listGenres } from "@/lib/server/catalog";
import {
  addEpisode,
  addSeason,
  addSource,
  deleteEpisode,
  deleteSeason,
  deleteSource,
  getAdminTitle,
  upsertTitle,
} from "@/lib/server/admin";
import { slugify } from "@/lib/slug";
import type { TitleKind } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tytuly/$id")({ component: Page });

type SourceDraft = { label: string; url: string; kind: "mp4" | "hls" | "embed"; language: string; isPrimary: boolean };

const emptySources: SourceDraft[] = [{ label: "Odtwarzacz", url: "", kind: "mp4", language: "pl", isPrimary: true }];

function Page() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const numericId = isNew ? null : Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const genres = useQuery({ queryKey: ["genres"], queryFn: () => listGenres() });
  const existing = useQuery({
    queryKey: ["admin-title", numericId],
    queryFn: () => getAdminTitle({ data: numericId! }),
    enabled: numericId != null && Number.isFinite(numericId),
  });

  const [kind, setKind] = useState<TitleKind>("movie");
  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [quality, setQuality] = useState("HD");
  const [ageRating, setAgeRating] = useState("");
  const [runtimeMinutes, setRuntimeMinutes] = useState("");
  const [country, setCountry] = useState("");
  const [director, setDirector] = useState("");
  const [castText, setCastText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [genreIds, setGenreIds] = useState<number[]>([]);
  const [sources, setSources] = useState<SourceDraft[]>(emptySources);
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    const t = existing.data;
    if (!t || isNew) return;
    setKind(t.kind);
    setTitle(t.title);
    setOriginalTitle(t.originalTitle ?? "");
    setSlug(t.slug);
    setYear(t.year ? String(t.year) : "");
    setDescription(t.description ?? "");
    setPosterUrl(t.posterUrl ?? "");
    setBackdropUrl(t.backdropUrl ?? "");
    setQuality(t.quality ?? "HD");
    setAgeRating(t.ageRating ?? "");
    setRuntimeMinutes(t.runtimeMinutes ? String(t.runtimeMinutes) : "");
    setCountry(t.country ?? "");
    setDirector(t.director ?? "");
    setCastText(t.castText ?? "");
    setIsFeatured(t.isFeatured);
    setIsPublished(t.isPublished);
    setGenreIds(t.genres.map((g) => g.id));
    setSources(
      t.sources.length
        ? t.sources.map((s) => ({
            label: s.label,
            url: s.url,
            kind: s.kind,
            language: s.language,
            isPrimary: s.isPrimary,
          }))
        : emptySources,
    );
    setHydrated(true);
  }, [existing.data, isNew]);

  const save = useMutation({
    mutationFn: () =>
      upsertTitle({
        data: {
          id: numericId ?? undefined,
          kind,
          title,
          originalTitle: originalTitle || null,
          slug: slug || slugify(title),
          year: year ? Number(year) : null,
          description: description || null,
          posterUrl: posterUrl || null,
          backdropUrl: backdropUrl || null,
          quality: quality || null,
          ageRating: ageRating || null,
          runtimeMinutes: runtimeMinutes ? Number(runtimeMinutes) : null,
          country: country || null,
          director: director || null,
          castText: castText || null,
          isFeatured,
          isPublished,
          genreIds,
          sources: kind === "movie" ? sources : [],
        },
      }),
    onSuccess: (res) => {
      toast.success("Zapisano");
      void qc.invalidateQueries({ queryKey: ["admin-titles"] });
      void qc.invalidateQueries({ queryKey: ["catalog"] });
      void qc.invalidateQueries({ queryKey: ["admin-title", res.id] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
      if (isNew) void navigate({ to: "/admin/tytuly/$id", params: { id: String(res.id) } });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Nie udało się zapisać"),
  });

  if (!isNew && (existing.isLoading || !hydrated)) {
    return <p className="text-sm text-muted">Wczytuję…</p>;
  }

  return (
    <form
      className="mx-auto max-w-3xl space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl tracking-wide">{isNew ? "Nowy tytuł" : title || "Edycja"}</h1>
        <Link to="/admin/tytuly" className="text-sm text-muted hover:text-fg">
          ← Lista
        </Link>
      </div>

      <fieldset className="grid gap-4 rounded-xl border border-border bg-bg-elevated p-4 md:grid-cols-2">
        <Field label="Typ">
          <select
            className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value as TitleKind)}
          >
            <option value="movie">Film</option>
            <option value="series">Serial</option>
            <option value="show">Program</option>
          </select>
        </Field>
        <Field label="Tytuł">
          <Input
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (isNew) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Tytuł oryginalny">
          <Input value={originalTitle} onChange={(e) => setOriginalTitle(e.target.value)} />
        </Field>
        <Field label="Slug">
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </Field>
        <Field label="Rok">
          <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </Field>
        <Field label="Jakość">
          <Input value={quality} onChange={(e) => setQuality(e.target.value)} placeholder="HD / FHD / 4K" />
        </Field>
        <Field label="Od lat">
          <Input value={ageRating} onChange={(e) => setAgeRating(e.target.value)} placeholder="7 / 12 / 16 / 18" />
        </Field>
        <Field label="Czas (min)">
          <Input type="number" value={runtimeMinutes} onChange={(e) => setRuntimeMinutes(e.target.value)} />
        </Field>
        <Field label="Kraj">
          <Input value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Reżyseria">
          <Input value={director} onChange={(e) => setDirector(e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Obsada">
            <Input value={castText} onChange={(e) => setCastText(e.target.value)} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Opis">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </Field>
        </div>
        <Field label="URL plakatu">
          <Input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder="/posters/… lub https://" />
        </Field>
        <Field label="URL tła">
          <Input value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Wyróżniony (hero)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Opublikowany
        </label>
      </fieldset>

      <fieldset className="rounded-xl border border-border bg-bg-elevated p-4">
        <legend className="px-1 text-sm font-medium">Gatunki</legend>
        <div className="flex flex-wrap gap-2">
          {(genres.data ?? []).map((g) => {
            const on = genreIds.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGenreIds((ids) => (on ? ids.filter((x) => x !== g.id) : [...ids, g.id]))}
                className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-fg bg-fg text-bg" : "border-border text-muted"}`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {kind === "movie" ? (
        <fieldset className="space-y-3 rounded-xl border border-border bg-bg-elevated p-4">
          <legend className="px-1 text-sm font-medium">Źródła wideo (MP4 / HLS)</legend>
          <p className="text-xs text-muted">
            Wklej bezpośredni link do pliku. Internet Archive, Cloudflare R2, Bunny — cokolwiek pod HTTPS.
          </p>
          {sources.map((s, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-2">
              <Input
                placeholder="Etykieta (Odtwarzacz 1)"
                value={s.label}
                onChange={(e) => setSources((all) => all.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
              />
              <Input
                placeholder="https://…/film.mp4"
                value={s.url}
                onChange={(e) => setSources((all) => all.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))}
              />
              <select
                className="h-10 rounded-md border border-border bg-bg px-3 text-sm"
                value={s.kind}
                onChange={(e) =>
                  setSources((all) =>
                    all.map((x, idx) => (idx === i ? { ...x, kind: e.target.value as SourceDraft["kind"] } : x)),
                  )
                }
              >
                <option value="mp4">MP4</option>
                <option value="hls">HLS (.m3u8)</option>
                <option value="embed">Osadzony player</option>
              </select>
              <Input
                placeholder="język"
                value={s.language}
                onChange={(e) =>
                  setSources((all) => all.map((x, idx) => (idx === i ? { ...x, language: e.target.value } : x)))
                }
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setSources((all) => [...all, { label: `Odtwarzacz ${all.length + 1}`, url: "", kind: "mp4", language: "pl", isPrimary: false }])
            }
          >
            Dodaj źródło
          </Button>
        </fieldset>
      ) : numericId ? (
        <EpisodesEditor titleId={numericId} seasons={existing.data?.seasons ?? []} />
      ) : (
        <p className="text-sm text-muted">Zapisz serial, a potem dodasz sezony i odcinki.</p>
      )}

      <Button type="submit" variant="cinema" disabled={save.isPending}>
        {save.isPending ? "Zapis…" : "Zapisz"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function EpisodesEditor({
  titleId,
  seasons,
}: {
  titleId: number;
  seasons: NonNullable<Awaited<ReturnType<typeof getAdminTitle>>>["seasons"];
}) {
  const qc = useQueryClient();
  const invalidate = () => void qc.invalidateQueries({ queryKey: ["admin-title", titleId] });
  const [seasonNo, setSeasonNo] = useState(String((seasons.at(-1)?.seasonNumber ?? 0) + 1));
  const [seasonName, setSeasonName] = useState("");
  const [epTitle, setEpTitle] = useState("");
  const [epNo, setEpNo] = useState("1");
  const [epSeason, setEpSeason] = useState<number | "">(seasons[0]?.id ?? "");
  const [srcUrl, setSrcUrl] = useState("");
  const [srcEp, setSrcEp] = useState<number | "">("");

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-bg-elevated p-4">
      <legend className="px-1 text-sm font-medium">Sezony i odcinki</legend>
      {seasons.map((s) => (
        <div key={s.id} className="rounded-md border border-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">
              {s.name ?? `Sezon ${s.seasonNumber}`}
            </p>
            <button
              type="button"
              className="text-xs text-accent"
              onClick={() => {
                if (confirm("Usunąć sezon?"))
                  void deleteSeason({ data: s.id }).then(invalidate);
              }}
            >
              Usuń sezon
            </button>
          </div>
          <ul className="space-y-2">
            {s.episodes.map((ep) => (
              <li key={ep.id} className="rounded-sm bg-bg px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    {ep.episodeNumber}. {ep.title}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-accent"
                    onClick={() => {
                      if (confirm("Usunąć odcinek?")) void deleteEpisode({ data: ep.id }).then(invalidate);
                    }}
                  >
                    Usuń
                  </button>
                </div>
                <ul className="mt-1 space-y-1 text-xs text-muted">
                  {ep.sources.map((src) => (
                    <li key={src.id} className="flex justify-between gap-2">
                      <span className="truncate">{src.label}: {src.url}</span>
                      <button
                        type="button"
                        onClick={() => void deleteSource({ data: src.id }).then(invalidate)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="grid gap-2 md:grid-cols-3">
        <Input type="number" value={seasonNo} onChange={(e) => setSeasonNo(e.target.value)} placeholder="Nr sezonu" />
        <Input value={seasonName} onChange={(e) => setSeasonName(e.target.value)} placeholder="Nazwa (Sezon 1)" />
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void addSeason({
              data: { titleId, seasonNumber: Number(seasonNo), name: seasonName || undefined },
            }).then(() => {
              invalidate();
              toast.success("Dodano sezon");
            })
          }
        >
          Dodaj sezon
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        <select
          className="h-10 rounded-md border border-border bg-bg px-3 text-sm"
          value={epSeason}
          onChange={(e) => setEpSeason(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">Sezon</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name ?? `Sezon ${s.seasonNumber}`}
            </option>
          ))}
        </select>
        <Input type="number" value={epNo} onChange={(e) => setEpNo(e.target.value)} placeholder="Nr" />
        <Input value={epTitle} onChange={(e) => setEpTitle(e.target.value)} placeholder="Tytuł odcinka" />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!epSeason || !epTitle) return;
            void addEpisode({
              data: { seasonId: Number(epSeason), episodeNumber: Number(epNo), title: epTitle },
            }).then(() => {
              invalidate();
              setEpTitle("");
              toast.success("Dodano odcinek");
            });
          }}
        >
          Dodaj odcinek
        </Button>
      </div>

      <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
        <select
          className="h-10 rounded-md border border-border bg-bg px-3 text-sm"
          value={srcEp}
          onChange={(e) => setSrcEp(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">Odcinek</option>
          {seasons.flatMap((s) =>
            s.episodes.map((ep) => (
              <option key={ep.id} value={ep.id}>
                S{s.seasonNumber}E{ep.episodeNumber} {ep.title}
              </option>
            )),
          )}
        </select>
        <Input value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} placeholder="https://…/odcinek.mp4" />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!srcEp || !srcUrl) return;
            void addSource({
              data: {
                episodeId: Number(srcEp),
                label: "Odtwarzacz",
                url: srcUrl,
                kind: srcUrl.includes(".m3u8") ? "hls" : "mp4",
                language: "pl",
                isPrimary: true,
              },
            }).then(() => {
              invalidate();
              setSrcUrl("");
              toast.success("Dodano źródło");
            });
          }}
        >
          Dodaj plik
        </Button>
      </div>
    </fieldset>
  );
}
