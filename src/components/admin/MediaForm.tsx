"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteEpisode, deleteMedia, saveEpisode, saveMedia } from "@/lib/actions";
import { slugify } from "@/lib/slug";
import type { EpisodeRow, MediaRow } from "@/lib/catalog";

async function uploadFile(file: File, folder: "posters" | "backdrops" | "videos" | "episodes") {
  const body = new FormData();
  body.set("file", file);
  body.set("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload nie powiódł się");
  return data.url;
}

export function MediaForm({
  media,
  episodes,
}: {
  media: MediaRow | null;
  episodes: EpisodeRow[];
}) {
  const isNew = !media;
  const router = useRouter();
  const [type, setType] = useState<"movie" | "series">(media?.type ?? "movie");
  const [title, setTitle] = useState(media?.title ?? "");
  const [slug, setSlug] = useState(media?.slug ?? "");
  const [year, setYear] = useState(media?.release_year ? String(media.release_year) : "");
  const [genre, setGenre] = useState(media?.genre ?? "");
  const [description, setDescription] = useState(media?.description ?? "");
  const [posterUrl, setPosterUrl] = useState(media?.poster_url ?? "");
  const [backdropUrl, setBackdropUrl] = useState(media?.backdrop_url ?? "");
  const [videoUrl, setVideoUrl] = useState(media?.video_url ?? "");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  async function onFile(kind: "posters" | "backdrops" | "videos", file: File | undefined) {
    if (!file) return;
    setUploading(kind);
    try {
      const url = await uploadFile(file, kind);
      if (kind === "posters") setPosterUrl(url);
      if (kind === "backdrops") setBackdropUrl(url);
      if (kind === "videos") setVideoUrl(url);
      toast.success("Zapisano plik w Supabase Storage");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload nie powiódł się");
    } finally {
      setUploading(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await saveMedia({
        id: media?.id,
        title,
        slug,
        type,
        description,
        poster_url: posterUrl,
        backdrop_url: backdropUrl,
        video_url: videoUrl,
        release_year: year,
        genre,
      });
      toast.success("Zapisano");
      if (isNew) router.push(`/admin/tytuly/${res.id}`);
      else router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nie udało się zapisać");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mx-auto max-w-3xl space-y-6" onSubmit={(e) => void onSubmit(e)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl tracking-wide">{isNew ? "Nowy tytuł" : title || "Edycja"}</h1>
        <a href="/admin/tytuly" className="text-sm text-muted hover:text-fg">
          ← Lista
        </a>
      </div>

      <fieldset className="grid gap-4 rounded-xl border border-border bg-bg-elevated p-4 md:grid-cols-2">
        <Field label="Typ">
          <select
            className="h-10 w-full rounded-md border border-border bg-bg px-3 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as "movie" | "series")}
          >
            <option value="movie">Film</option>
            <option value="series">Serial</option>
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
        <Field label="Slug">
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </Field>
        <Field label="Rok">
          <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </Field>
        <Field label="Gatunek">
          <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Animacja, Horror…" />
        </Field>
        <div className="md:col-span-2">
          <Field label="Opis">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </Field>
        </div>

        <FileAndUrl
          label="Plakat"
          folder="posters"
          url={posterUrl}
          onUrl={setPosterUrl}
          uploading={uploading === "posters"}
          onFile={(f) => void onFile("posters", f)}
        />
        <FileAndUrl
          label="Banner / tło"
          folder="backdrops"
          url={backdropUrl}
          onUrl={setBackdropUrl}
          uploading={uploading === "backdrops"}
          onFile={(f) => void onFile("backdrops", f)}
        />
        {type === "movie" ? (
          <div className="md:col-span-2">
            <FileAndUrl
              label="Wideo (MP4 / HLS / URL)"
              folder="videos"
              url={videoUrl}
              onUrl={setVideoUrl}
              uploading={uploading === "videos"}
              onFile={(f) => void onFile("videos", f)}
              accept="video/mp4,video/webm"
            />
          </div>
        ) : null}
      </fieldset>

      {type === "series" && media ? (
        <EpisodesBlock mediaId={media.id} episodes={episodes} />
      ) : type === "series" ? (
        <p className="text-sm text-muted">Zapisz serial, a potem dodasz odcinki.</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="cinema" disabled={busy}>
          {busy ? "Zapis…" : "Zapisz"}
        </Button>
        {media ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (!confirm("Usunąć tytuł?")) return;
              void deleteMedia(media.id).then(() => router.push("/admin/tytuly"));
            }}
          >
            Usuń
          </Button>
        ) : null}
      </div>
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

function FileAndUrl({
  label,
  url,
  onUrl,
  onFile,
  uploading,
  accept = "image/*",
}: {
  label: string;
  folder: string;
  url: string;
  onUrl: (v: string) => void;
  onFile: (file: File | undefined) => void;
  uploading: boolean;
  accept?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={url} onChange={(e) => onUrl(e.target.value)} placeholder="https://… lub wgraj plik" />
      <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-xs text-muted hover:bg-bg-muted">
        {uploading ? "Wgrywanie do Storage…" : "Wgraj plik do Supabase Storage"}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {url && (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:")) && !/\.(mp4|webm|m3u8)(\?|$)/i.test(url) ? (
        <img src={url} alt="" className="mt-1 max-h-28 rounded-md object-cover" />
      ) : null}
    </div>
  );
}

function EpisodesBlock({ mediaId, episodes }: { mediaId: number; episodes: EpisodeRow[] }) {
  const router = useRouter();
  const [season, setSeason] = useState("1");
  const [number, setNumber] = useState(String((episodes.at(-1)?.episode_number ?? 0) + 1));
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumb, setThumb] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-bg-elevated p-4">
      <legend className="px-1 text-sm font-medium">Odcinki</legend>
      <ul className="space-y-2">
        {episodes.map((ep) => (
          <li key={ep.id} className="flex items-center justify-between gap-3 rounded-md bg-bg px-3 py-2 text-sm">
            <span>
              S{ep.season_number}E{ep.episode_number} · {ep.title}
            </span>
            <button
              type="button"
              className="text-xs text-accent"
              onClick={() => {
                if (!confirm("Usunąć odcinek?")) return;
                void deleteEpisode(ep.id).then(() => router.refresh());
              }}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 md:grid-cols-2">
        <Input type="number" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Sezon" />
        <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Nr odcinka" />
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł odcinka" />
        <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="URL wideo" />
        <Input
          value={thumb}
          onChange={(e) => setThumb(e.target.value)}
          placeholder="Miniatura (opcjonalnie)"
          className="md:col-span-2"
        />
        <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-xs text-muted hover:bg-bg-muted md:col-span-2">
          Wgraj miniaturę
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void uploadFile(file, "episodes")
                .then(setThumb)
                .catch((err) => toast.error(err instanceof Error ? err.message : "Upload nie powiódł się"));
            }}
          />
        </label>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={busy || !title}
        onClick={() => {
          setBusy(true);
          void saveEpisode({
            media_id: mediaId,
            season_number: Number(season) || 1,
            episode_number: Number(number) || 1,
            title,
            video_url: videoUrl,
            thumbnail_url: thumb,
          })
            .then(() => {
              toast.success("Dodano odcinek");
              setTitle("");
              setVideoUrl("");
              setThumb("");
              setNumber(String((Number(number) || 1) + 1));
              router.refresh();
            })
            .catch((err) => toast.error(err instanceof Error ? err.message : "Błąd"))
            .finally(() => setBusy(false));
        }}
      >
        Dodaj odcinek
      </Button>
    </fieldset>
  );
}
