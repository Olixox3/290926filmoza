import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { toBool, toInt, toNumber } from "@/lib/json";
import { TITLE_SELECT, mapCard } from "./catalog";
import type { Profile, TitleCard, WatchProgress } from "@/lib/types";

async function ensureProfile(
  sql: Sql,
  userId: string,
  displayName: string | null,
): Promise<Profile> {
  const authRows = await sql.query<{
    name: string | null;
    email: string | null;
    email_verified: boolean | null;
  }>(`select name, email, "emailVerified" as email_verified from "user" where id = $1`, [userId]);
  const authUser = authRows[0];
  const name = displayName || authUser?.name || null;
  const verified = toBool(authUser?.email_verified);

  const existing = await sql<{
    user_id: string;
    display_name: string | null;
    role: string;
    email_verified: string | null;
  }>`
    select user_id, display_name, role, email_verified from profiles where user_id = ${userId}
  `;
  if (existing[0]) {
    if (!existing[0].display_name && name) {
      await sql`update profiles set display_name = ${name} where user_id = ${userId}`;
    }
    if (verified && !existing[0].email_verified) {
      await sql`update profiles set email_verified = now() where user_id = ${userId}`;
    }
    return {
      userId: existing[0].user_id,
      displayName: existing[0].display_name || name,
      role: existing[0].role === "admin" ? "admin" : "user",
    };
  }
  const admins = await sql<{ n: number }>`select count(*)::int as n from profiles where role = 'admin'`;
  const role = toInt(admins[0]?.n) === 0 ? "admin" : "user";
  await sql`
    insert into profiles (user_id, display_name, role, email_verified)
    values (${userId}, ${name}, ${role}, ${verified ? new Date().toISOString() : null})
  `;
  return { userId, displayName: name, role };
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Profile> => {
    const sql = await getSql();
    return ensureProfile(sql, context.userId, null);
  });

export const listFavorites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<TitleCard[]> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `select ${TITLE_SELECT}
       from favorites f
       join titles t on t.id = f.title_id
       where f.user_id = $1 and t.is_published = true
       order by f.created_at desc`,
      [context.userId],
    );
    return rows.map(mapCard);
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((titleId: number) => titleId)
  .handler(async ({ context, data: titleId }) => {
    const sql = await getSql();
    const existing = await sql`
      select 1 from favorites where user_id = ${context.userId} and title_id = ${titleId}
    `;
    if (existing.length) {
      await sql`delete from favorites where user_id = ${context.userId} and title_id = ${titleId}`;
      return { saved: false };
    }
    await sql`insert into favorites (user_id, title_id) values (${context.userId}, ${titleId})`;
    return { saved: true };
  });

export const isFavorite = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((titleId: number) => titleId)
  .handler(async ({ context, data: titleId }) => {
    const sql = await getSql();
    const rows = await sql`
      select 1 from favorites where user_id = ${context.userId} and title_id = ${titleId}
    `;
    return rows.length > 0;
  });

export const saveProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { titleId: number; episodeId: number | null; positionSeconds: number; durationSeconds: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into watch_progress (user_id, title_id, episode_id, position_seconds, duration_seconds, updated_at)
      values (${context.userId}, ${data.titleId}, ${data.episodeId}, ${Math.floor(data.positionSeconds)}, ${Math.floor(data.durationSeconds)}, now())
      on conflict (user_id, title_id) do update set
        episode_id = excluded.episode_id,
        position_seconds = excluded.position_seconds,
        duration_seconds = excluded.duration_seconds,
        updated_at = now()
    `;
    return { ok: true };
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((titleId: number) => titleId)
  .handler(async ({ context, data: titleId }) => {
    const sql = await getSql();
    const rows = await sql<{
      episode_id: number | null;
      position_seconds: number;
      duration_seconds: number;
    }>`
      select episode_id, position_seconds, duration_seconds
      from watch_progress
      where user_id = ${context.userId} and title_id = ${titleId}
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      episodeId: toNumber(row.episode_id),
      positionSeconds: toInt(row.position_seconds),
      durationSeconds: toInt(row.duration_seconds),
    };
  });

export const listContinueWatching = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<WatchProgress[]> => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `select ${TITLE_SELECT},
              wp.episode_id, wp.position_seconds, wp.duration_seconds, wp.updated_at,
              e.title as episode_title
       from watch_progress wp
       join titles t on t.id = wp.title_id
       left join episodes e on e.id = wp.episode_id
       where wp.user_id = $1 and t.is_published = true
         and wp.duration_seconds > 0
         and wp.position_seconds::float / wp.duration_seconds < 0.95
       order by wp.updated_at desc
       limit 16`,
      [context.userId],
    );
    return rows.map((row) => ({
      titleId: toInt(row.id),
      episodeId: toNumber(row.episode_id),
      positionSeconds: toInt(row.position_seconds),
      durationSeconds: toInt(row.duration_seconds),
      updatedAt: String(row.updated_at ?? ""),
      title: mapCard(row),
      episodeTitle: row.episode_title ? String(row.episode_title) : null,
    }));
  });

export const rateTitle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { titleId: number; score: number }) => input)
  .handler(async ({ context, data }) => {
    const score = Math.min(10, Math.max(1, Math.round(data.score)));
    const sql = await getSql();
    await sql`
      insert into ratings (user_id, title_id, score)
      values (${context.userId}, ${data.titleId}, ${score})
      on conflict (user_id, title_id) do update set score = excluded.score
    `;
    return { score };
  });

export const getMyRating = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((titleId: number) => titleId)
  .handler(async ({ context, data: titleId }) => {
    const sql = await getSql();
    const rows = await sql<{ score: number }>`
      select score from ratings where user_id = ${context.userId} and title_id = ${titleId}
    `;
    return rows[0] ? toInt(rows[0].score) : null;
  });

export { ensureProfile };
