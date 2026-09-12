import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { parseJson, toBool, toInt, toNumber } from "@/lib/json";
import type {
  Episode,
  Genre,
  Season,
  TitleCard,
  TitleDetail,
  TitleKind,
  VideoSource,
} from "@/lib/types";

const TITLE_SELECT = `
  t.id, t.kind, t.title, t.original_title, t.slug, t.year, t.description,
  t.poster_url, t.backdrop_url, t.trailer_url, t.quality, t.age_rating,
  t.runtime_minutes, t.country, t.director, t.cast_text, t.is_featured,
  t.is_published,
  coalesce((
    select json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug) order by g.sort_order)
    from title_genres tg join genres g on g.id = tg.genre_id
    where tg.title_id = t.id
  ), '[]'::json) as genres,
  (select avg(score) from ratings r where r.title_id = t.id) as rating_avg,
  (select count(*) from ratings r where r.title_id = t.id) as rating_count
`;

type TitleRow = Record<string, unknown>;

function mapSource(row: Record<string, unknown>): VideoSource {
  const kind = row.kind === "hls" || row.kind === "embed" ? row.kind : "mp4";
  return {
    id: toInt(row.id),
    titleId: toNumber(row.title_id),
    episodeId: toNumber(row.episode_id),
    label: String(row.label ?? "Odtwarzacz"),
    url: String(row.url ?? ""),
    kind,
    language: String(row.language ?? "pl"),
    isPrimary: toBool(row.is_primary),
  };
}

function mapCard(row: TitleRow): TitleCard {
  const kind = (row.kind as TitleKind) ?? "movie";
  return {
    id: toInt(row.id),
    kind: kind === "series" || kind === "show" ? kind : "movie",
    title: String(row.title ?? ""),
    originalTitle: row.original_title ? String(row.original_title) : null,
    slug: String(row.slug ?? ""),
    year: toNumber(row.year),
    description: row.description ? String(row.description) : null,
    posterUrl: row.poster_url ? String(row.poster_url) : null,
    backdropUrl: row.backdrop_url ? String(row.backdrop_url) : null,
    quality: row.quality ? String(row.quality) : null,
    ageRating: row.age_rating ? String(row.age_rating) : null,
    runtimeMinutes: toNumber(row.runtime_minutes),
    country: row.country ? String(row.country) : null,
    director: row.director ? String(row.director) : null,
    castText: row.cast_text ? String(row.cast_text) : null,
    isFeatured: toBool(row.is_featured),
    isPublished: toBool(row.is_published),
    genres: parseJson<{ id: number; name: string; slug: string }[]>(row.genres, []),
    ratingAvg: toNumber(row.rating_avg),
    ratingCount: toInt(row.rating_count),
  };
}

async function fetchPublished(sql: Sql, whereSql: string, params: unknown[] = []) {
  const rows = await sql.query<TitleRow>(
    `select ${TITLE_SELECT} from titles t where t.is_published = true ${whereSql} order by t.is_featured desc, t.year desc nulls last, t.title`,
    params,
  );
  return rows.map(mapCard);
}

export const listGenres = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ id: number; name: string; slug: string; sort_order: number }>`
    select id, name, slug, sort_order from genres order by sort_order, name
  `;
  return rows.map(
    (g): Genre => ({
      id: toInt(g.id),
      name: g.name,
      slug: g.slug,
      sortOrder: toInt(g.sort_order),
    }),
  );
});

export const listCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const titles = await fetchPublished(sql, "");
  const genreRows = await sql<{ id: number; name: string; slug: string; sort_order: number }>`
    select id, name, slug, sort_order from genres order by sort_order, name
  `;
  const genres = genreRows.map(
    (g): Genre => ({
      id: toInt(g.id),
      name: g.name,
      slug: g.slug,
      sortOrder: toInt(g.sort_order),
    }),
  );
  return { titles, genres };
});

export const listByKind = createServerFn({ method: "GET" })
  .validator((kind: TitleKind) => kind)
  .handler(async ({ data: kind }) => {
    const sql = await getSql();
    return fetchPublished(sql, "and t.kind = $1", [kind]);
  });

export const listByGenre = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const sql = await getSql();
    return fetchPublished(
      sql,
      "and exists (select 1 from title_genres tg join genres g on g.id = tg.genre_id where tg.title_id = t.id and g.slug = $1)",
      [slug],
    );
  });

export const searchTitles = createServerFn({ method: "GET" })
  .validator((q: string) => q.trim().slice(0, 80))
  .handler(async ({ data: q }) => {
    if (!q) return [];
    const sql = await getSql();
    const like = `%${q}%`;
    return fetchPublished(
      sql,
      "and (t.title ilike $1 or coalesce(t.original_title,'') ilike $1 or coalesce(t.description,'') ilike $1 or coalesce(t.director,'') ilike $1)",
      [like],
    );
  });

async function loadSeasons(sql: Sql, titleId: number): Promise<Season[]> {
  const seasonRows = await sql.query<{
    id: number;
    title_id: number;
    season_number: number;
    name: string | null;
  }>(`select * from seasons where title_id = $1 order by season_number`, [titleId]);

  if (!seasonRows.length) return [];

  const seasonIds = seasonRows.map((s) => toInt(s.id));
  const seasonPh = seasonIds.map((_, i) => `$${i + 1}`).join(", ");
  const epRows = await sql.query<Record<string, unknown>>(
    `select * from episodes where season_id in (${seasonPh}) order by season_id, episode_number`,
    seasonIds,
  );
  const epIds = epRows.map((e) => toInt(e.id));
  const srcRows = epIds.length
    ? await sql.query<Record<string, unknown>>(
        `select * from video_sources where episode_id in (${epIds.map((_, i) => `$${i + 1}`).join(", ")}) order by is_primary desc, id`,
        epIds,
      )
    : [];

  const sourcesByEp = new Map<number, VideoSource[]>();
  for (const row of srcRows) {
    const mapped = mapSource(row);
    const key = mapped.episodeId ?? 0;
    const list = sourcesByEp.get(key) ?? [];
    list.push(mapped);
    sourcesByEp.set(key, list);
  }

  const episodesBySeason = new Map<number, Episode[]>();
  for (const e of epRows) {
    const seasonId = toInt(e.season_id);
    const list = episodesBySeason.get(seasonId) ?? [];
    list.push({
      id: toInt(e.id),
      seasonId,
      episodeNumber: toInt(e.episode_number),
      title: String(e.title ?? ""),
      description: e.description ? String(e.description) : null,
      runtimeMinutes: toNumber(e.runtime_minutes),
      stillUrl: e.still_url ? String(e.still_url) : null,
      sources: sourcesByEp.get(toInt(e.id)) ?? [],
    });
    episodesBySeason.set(seasonId, list);
  }

  return seasonRows.map((s) => ({
    id: toInt(s.id),
    titleId: toInt(s.title_id),
    seasonNumber: toInt(s.season_number),
    name: s.name,
    episodes: episodesBySeason.get(toInt(s.id)) ?? [],
  }));
}

export const getTitleBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<TitleDetail | null> => {
    const sql = await getSql();
    const rows = await sql.query<TitleRow>(
      `select ${TITLE_SELECT} from titles t where t.slug = $1 and t.is_published = true`,
      [slug],
    );
    const row = rows[0];
    if (!row) return null;
    const card = mapCard(row);

    const sources = (
      await sql.query<Record<string, unknown>>(
        `select * from video_sources where title_id = $1 order by is_primary desc, id`,
        [card.id],
      )
    ).map(mapSource);

    const seasons = await loadSeasons(sql, card.id);

    const genreIds = card.genres.map((g) => g.id);
    let similar: TitleCard[] = [];
    if (genreIds.length) {
      const rest = await fetchPublished(sql, "and t.id <> $1", [card.id]);
      const set = new Set(genreIds);
      similar = rest.filter((t) => t.genres.some((g) => set.has(g.id))).slice(0, 12);
    }

    return {
      ...card,
      trailerUrl: row.trailer_url ? String(row.trailer_url) : null,
      seasons,
      sources,
      similar,
    };
  });

export const getWatchPayload = createServerFn({ method: "GET" })
  .validator((input: { slug: string; episodeId?: number | null }) => input)
  .handler(async ({ data }) => {
    const title = await getTitleBySlug({ data: data.slug });
    if (!title) return null;
    let episode: Episode | null = null;
    if (title.kind !== "movie") {
      const all = title.seasons.flatMap((s) => s.episodes);
      episode = all.find((e) => e.id === data.episodeId) ?? all[0] ?? null;
    }
    const sources = title.kind === "movie" ? title.sources : (episode?.sources ?? []);
    return { title, episode, sources };
  });

export { mapCard, mapSource, TITLE_SELECT };
