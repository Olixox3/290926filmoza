import { ensureDbReady, query } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { TitleCard, TitleKind } from "@/lib/types";

export type MediaRow = {
  id: number;
  title: string;
  slug: string;
  type: "movie" | "series";
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  video_url: string | null;
  release_year: number | null;
  genre: string | null;
};

export type EpisodeRow = {
  id: number;
  media_id: number;
  season_number: number;
  episode_number: number;
  title: string;
  video_url: string | null;
  thumbnail_url: string | null;
};

export function toTitleCard(row: MediaRow): TitleCard {
  const genreSlug = row.genre ? slugify(row.genre) : "";
  return {
    id: Number(row.id),
    kind: row.type as TitleKind,
    title: row.title,
    originalTitle: null,
    slug: row.slug,
    year: row.release_year ? Number(row.release_year) : null,
    description: row.description,
    posterUrl: row.poster_url,
    backdropUrl: row.backdrop_url,
    quality: null,
    ageRating: null,
    runtimeMinutes: null,
    country: null,
    director: null,
    castText: null,
    isFeatured: Boolean(row.backdrop_url),
    isPublished: true,
    genres: row.genre ? [{ id: 0, name: row.genre, slug: genreSlug }] : [],
    ratingAvg: null,
    ratingCount: 0,
  };
}

export async function listMedia(filter?: {
  type?: "movie" | "series";
  genre?: string;
  q?: string;
}): Promise<TitleCard[]> {
  await ensureDbReady();
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (filter?.type) {
    params.push(filter.type);
    clauses.push(`type = $${params.length}`);
  }
  if (filter?.genre) {
    params.push(filter.genre.toLowerCase());
    clauses.push(`lower(regexp_replace(lower(genre), '[^a-z0-9]+', '-', 'g')) = $${params.length}
      or lower(genre) = $${params.length}`);
  }
  if (filter?.q) {
    params.push(`%${filter.q.toLowerCase()}%`);
    clauses.push(`(lower(title) like $${params.length} or lower(coalesce(description,'')) like $${params.length} or lower(coalesce(genre,'')) like $${params.length})`);
  }
  const where = clauses.length ? `where ${clauses.join(" and ")}` : "";
  const rows = await query<MediaRow>(
    `select * from media ${where} order by release_year desc nulls last, title asc`,
    params,
  );
  return rows.map(toTitleCard);
}

export async function getMediaBySlug(slug: string) {
  await ensureDbReady();
  const rows = await query<MediaRow>("select * from media where slug = $1", [slug]);
  const row = rows[0];
  if (!row) return null;
  const episodes = await query<EpisodeRow>(
    `select * from episodes where media_id = $1 order by season_number, episode_number`,
    [row.id],
  );
  return { media: row, card: toTitleCard(row), episodes };
}

export async function getMediaById(id: number) {
  await ensureDbReady();
  const rows = await query<MediaRow>("select * from media where id = $1", [id]);
  const row = rows[0];
  if (!row) return null;
  const episodes = await query<EpisodeRow>(
    `select * from episodes where media_id = $1 order by season_number, episode_number`,
    [row.id],
  );
  return { media: row, card: toTitleCard(row), episodes };
}

export async function listGenres() {
  await ensureDbReady();
  const rows = await query<{ genre: string }>(
    `select distinct genre from media where genre is not null and length(trim(genre)) > 0 order by genre`,
  );
  return rows.map((r) => ({
    name: r.genre,
    slug: slugify(r.genre),
  }));
}

export function inferKind(url: string): "mp4" | "hls" | "embed" {
  const u = url.toLowerCase();
  if (u.includes(".m3u8")) return "hls";
  if (/\.(mp4|webm|ogv)(\?|$)/.test(u) || u.startsWith("/") || u.startsWith("data:")) return "mp4";
  if (/youtube|youtu\.be|vimeo|streamtape|voe\.sx|dood|ok\.ru/.test(u)) return "embed";
  return "mp4";
}
