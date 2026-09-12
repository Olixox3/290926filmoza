import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { slugify } from "@/lib/slug";
import { TITLE_SELECT, mapCard, mapSource } from "./catalog";
import { ensureProfile } from "./account";
import { toInt, toNumber } from "@/lib/json";
import type { TitleCard, TitleKind } from "@/lib/types";

class ForbiddenError extends Error {
  status = 403;
  constructor() {
    super("Forbidden");
  }
}

async function requireAdmin(sql: Sql, userId: string) {
  const profile = await ensureProfile(sql, userId, null);
  if (profile.role !== "admin") throw new ForbiddenError();
  return profile;
}

function inferSourceKind(url: string, kind: "mp4" | "hls" | "embed"): "mp4" | "hls" | "embed" {
  const u = url.toLowerCase();
  if (u.includes(".m3u8")) return "hls";
  if (/\.(mp4|webm|ogv)(\?|$)/.test(u) || u.includes("archive.org") || u.startsWith("/videos/")) {
    return "mp4";
  }
  if (
    /streamtape|voe\.sx|dood|ok\.ru|emb\.|youtube\.com|youtu\.be|vimeo\.com/.test(u) &&
    !/\.(mp4|m3u8)(\?|$)/.test(u)
  ) {
    return "embed";
  }
  return kind;
}

const sourceSchema = z.object({
  label: z.string().min(1).max(80),
  url: z.string().min(1).max(2000),
  kind: z.enum(["mp4", "hls", "embed"]),
  language: z.string().min(1).max(8),
  isPrimary: z.boolean(),
});

const titleSchema = z.object({
  id: z.number().int().optional(),
  kind: z.enum(["movie", "series", "show"]),
  title: z.string().min(1).max(200),
  originalTitle: z.string().max(200).nullable().optional(),
  slug: z.string().max(80).optional(),
  year: z.number().int().min(1880).max(2100).nullable().optional(),
  description: z.string().max(8000).nullable().optional(),
  posterUrl: z.string().max(2000).nullable().optional(),
  backdropUrl: z.string().max(2000).nullable().optional(),
  trailerUrl: z.string().max(2000).nullable().optional(),
  quality: z.string().max(20).nullable().optional(),
  ageRating: z.string().max(10).nullable().optional(),
  runtimeMinutes: z.number().int().min(0).max(1000).nullable().optional(),
  country: z.string().max(80).nullable().optional(),
  director: z.string().max(200).nullable().optional(),
  castText: z.string().max(2000).nullable().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  genreIds: z.array(z.number().int()),
  sources: z.array(sourceSchema).optional(),
});

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const titles = await sql<{ n: number }>`select count(*)::int as n from titles`;
    const movies = await sql<{ n: number }>`select count(*)::int as n from titles where kind = 'movie'`;
    const series = await sql<{ n: number }>`select count(*)::int as n from titles where kind = 'series'`;
    const shows = await sql<{ n: number }>`select count(*)::int as n from titles where kind = 'show'`;
    const users = await sql<{ n: number }>`select count(*)::int as n from profiles`;
    const genres = await sql<{ n: number }>`select count(*)::int as n from genres`;
    return {
      titles: toInt(titles[0]?.n),
      movies: toInt(movies[0]?.n),
      series: toInt(series[0]?.n),
      shows: toInt(shows[0]?.n),
      users: toInt(users[0]?.n),
      genres: toInt(genres[0]?.n),
    };
  });

export const listAdminTitles = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<TitleCard[]> => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql.query<Record<string, unknown>>(
      `select ${TITLE_SELECT} from titles t order by t.updated_at desc`,
    );
    return rows.map(mapCard);
  });

export const getAdminTitle = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql.query<Record<string, unknown>>(
      `select ${TITLE_SELECT} from titles t where t.id = $1`,
      [id],
    );
    if (!rows[0]) return null;
    const card = mapCard(rows[0]);
    const sources = (
      await sql.query<Record<string, unknown>>(
        `select * from video_sources where title_id = $1 order by id`,
        [id],
      )
    ).map(mapSource);
    const seasons = await sql.query<{
      id: number;
      title_id: number;
      season_number: number;
      name: string | null;
    }>(`select * from seasons where title_id = $1 order by season_number`, [id]);
    const seasonPayload = [];
    for (const s of seasons) {
      const episodes = await sql.query<Record<string, unknown>>(
        `select * from episodes where season_id = $1 order by episode_number`,
        [s.id],
      );
      const eps = [];
      for (const e of episodes) {
        const epSources = (
          await sql.query<Record<string, unknown>>(
            `select * from video_sources where episode_id = $1 order by id`,
            [e.id],
          )
        ).map(mapSource);
        eps.push({
          id: toInt(e.id),
          seasonId: toInt(e.season_id),
          episodeNumber: toInt(e.episode_number),
          title: String(e.title ?? ""),
          description: e.description ? String(e.description) : null,
          runtimeMinutes: toNumber(e.runtime_minutes),
          stillUrl: e.still_url ? String(e.still_url) : null,
          sources: epSources,
        });
      }
      seasonPayload.push({
        id: toInt(s.id),
        titleId: toInt(s.title_id),
        seasonNumber: toInt(s.season_number),
        name: s.name,
        episodes: eps,
      });
    }
    return { ...card, sources, seasons: seasonPayload };
  });

export const upsertTitle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => titleSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const slug = (data.slug && data.slug.trim()) || slugify(data.title);
    const orig = data.originalTitle ?? null;
    const year = data.year ?? null;
    const desc = data.description ?? null;
    const poster = data.posterUrl ?? null;
    const backdrop = data.backdropUrl ?? null;
    const trailer = data.trailerUrl ?? null;
    const quality = data.quality ?? null;
    const age = data.ageRating ?? null;
    const runtime = data.runtimeMinutes ?? null;
    const country = data.country ?? null;
    const director = data.director ?? null;
    const castText = data.castText ?? null;

    let id = data.id;
    if (id) {
      await sql`
        update titles set
          kind = ${data.kind},
          title = ${data.title},
          original_title = ${orig},
          slug = ${slug},
          year = ${year},
          description = ${desc},
          poster_url = ${poster},
          backdrop_url = ${backdrop},
          trailer_url = ${trailer},
          quality = ${quality},
          age_rating = ${age},
          runtime_minutes = ${runtime},
          country = ${country},
          director = ${director},
          cast_text = ${castText},
          is_featured = ${data.isFeatured},
          is_published = ${data.isPublished},
          updated_at = now()
        where id = ${id}
      `;
    } else {
      const inserted = await sql<{ id: number }>`
        insert into titles (
          kind, title, original_title, slug, year, description, poster_url, backdrop_url,
          trailer_url, quality, age_rating, runtime_minutes, country, director, cast_text,
          is_featured, is_published
        ) values (
          ${data.kind}, ${data.title}, ${orig}, ${slug}, ${year}, ${desc}, ${poster}, ${backdrop},
          ${trailer}, ${quality}, ${age}, ${runtime}, ${country}, ${director}, ${castText},
          ${data.isFeatured}, ${data.isPublished}
        ) returning id
      `;
      id = toInt(inserted[0]?.id);
    }

    await sql`delete from title_genres where title_id = ${id}`;
    for (const gid of data.genreIds) {
      await sql`insert into title_genres (title_id, genre_id) values (${id}, ${gid})`;
    }

    if (data.kind === "movie" && data.sources) {
      await sql`delete from video_sources where title_id = ${id}`;
      for (const s of data.sources) {
        if (!s.url.trim()) continue;
        const kind = inferSourceKind(s.url, s.kind);
        await sql`
          insert into video_sources (title_id, label, url, kind, language, is_primary)
          values (${id}, ${s.label}, ${s.url}, ${kind}, ${s.language}, ${s.isPrimary})
        `;
      }
    }

    return { id, slug };
  });

export const deleteTitle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`delete from titles where id = ${id}`;
    return { ok: true };
  });

export const upsertGenre = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: number; name: string; slug?: string; sortOrder: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const slug = (data.slug && data.slug.trim()) || slugify(data.name);
    if (data.id) {
      await sql`
        update genres set name = ${data.name}, slug = ${slug}, sort_order = ${data.sortOrder}
        where id = ${data.id}
      `;
      return { id: data.id };
    }
    const inserted = await sql<{ id: number }>`
      insert into genres (name, slug, sort_order) values (${data.name}, ${slug}, ${data.sortOrder})
      returning id
    `;
    return { id: toInt(inserted[0]?.id) };
  });

export const deleteGenre = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`delete from genres where id = ${id}`;
    return { ok: true };
  });

export const addSeason = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { titleId: number; seasonNumber: number; name?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const inserted = await sql<{ id: number }>`
      insert into seasons (title_id, season_number, name)
      values (${data.titleId}, ${data.seasonNumber}, ${data.name ?? null})
      returning id
    `;
    return { id: toInt(inserted[0]?.id) };
  });

export const deleteSeason = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`delete from seasons where id = ${id}`;
    return { ok: true };
  });

export const addEpisode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      seasonId: number;
      episodeNumber: number;
      title: string;
      description?: string | null;
      runtimeMinutes?: number | null;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const inserted = await sql<{ id: number }>`
      insert into episodes (season_id, episode_number, title, description, runtime_minutes)
      values (${data.seasonId}, ${data.episodeNumber}, ${data.title}, ${data.description ?? null}, ${data.runtimeMinutes ?? null})
      returning id
    `;
    return { id: toInt(inserted[0]?.id) };
  });

export const deleteEpisode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`delete from episodes where id = ${id}`;
    return { ok: true };
  });

export const addSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      titleId?: number | null;
      episodeId?: number | null;
      label: string;
      url: string;
      kind: "mp4" | "hls" | "embed";
      language: string;
      isPrimary: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const kind = inferSourceKind(data.url, data.kind);
    const inserted = await sql<{ id: number }>`
      insert into video_sources (title_id, episode_id, label, url, kind, language, is_primary)
      values (${data.titleId ?? null}, ${data.episodeId ?? null}, ${data.label}, ${data.url}, ${kind}, ${data.language}, ${data.isPrimary})
      returning id
    `;
    return { id: toInt(inserted[0]?.id) };
  });

export const deleteSource = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`delete from video_sources where id = ${id}`;
    return { ok: true };
  });

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const rows = await sql.query<{
      user_id: string;
      display_name: string | null;
      role: string;
      created_at: string;
      email: string | null;
    }>(
      `select p.user_id, p.display_name, p.role, p.created_at, u.email
       from profiles p
       left join "user" u on u.id = p.user_id
       order by p.created_at desc`,
    );
    return rows.map((r) => ({
      userId: r.user_id,
      displayName: r.display_name,
      email: r.email,
      role: r.role === "admin" ? ("admin" as const) : ("user" as const),
      createdAt: String(r.created_at),
    }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; role: "user" | "admin" }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    if (data.userId === context.userId && data.role !== "admin") {
      throw new Error("Nie możesz odebrać sobie uprawnień administratora.");
    }
    await sql`update profiles set role = ${data.role} where user_id = ${data.userId}`;
    return { ok: true };
  });

export type { TitleKind };
