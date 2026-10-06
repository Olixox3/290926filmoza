"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { toTitleCard, type MediaRow } from "@/lib/catalog";
import { countAdmins, ensureDbReady, newId, query } from "@/lib/db";
import { slugify } from "@/lib/slug";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Wymagane logowanie");
  return session.user;
}

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Brak uprawnień administratora");
  return user;
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!email || !email.includes("@")) throw new Error("Podaj poprawny e-mail");
  if (password.length < 8) throw new Error("Hasło musi mieć minimum 8 znaków");
  await ensureDbReady();
  const existing = await query("select id from users where lower(email) = $1", [email]);
  if (existing.length) throw new Error("Konto z tym e-mailem już istnieje");
  const hash = await bcrypt.hash(password, 12);
  const role = (await countAdmins()) === 0 ? "admin" : "user";
  await query(
    `insert into users (id, name, email, password, role, email_verified)
     values ($1,$2,$3,$4,$5, now())`,
    [newId(), name || email.split("@")[0], email, hash, role],
  );
  return { ok: true as const };
}

export async function saveMedia(form: {
  id?: number;
  title: string;
  slug?: string;
  type: "movie" | "series";
  description: string;
  poster_url: string;
  backdrop_url: string;
  video_url: string;
  release_year: string;
  genre: string;
}) {
  await requireAdmin();
  await ensureDbReady();
  const title = form.title.trim();
  if (!title) throw new Error("Tytuł jest wymagany");
  const slug = (form.slug?.trim() || slugify(title)).slice(0, 80);
  const year = form.release_year ? Number(form.release_year) : null;
  const payload = [
    title,
    slug,
    form.type,
    form.description.trim() || null,
    form.poster_url.trim() || null,
    form.backdrop_url.trim() || null,
    form.video_url.trim() || null,
    Number.isFinite(year) ? year : null,
    form.genre.trim() || null,
  ];
  if (form.id) {
    await query(
      `update media set title=$1, slug=$2, type=$3, description=$4, poster_url=$5, backdrop_url=$6, video_url=$7, release_year=$8, genre=$9
       where id=$10`,
      [...payload, form.id],
    );
    revalidatePath("/");
    revalidatePath("/admin/tytuly");
    revalidatePath(`/tytul/${slug}`);
    return { id: form.id, slug };
  }
  const rows = await query<{ id: number }>(
    `insert into media (title, slug, type, description, poster_url, backdrop_url, video_url, release_year, genre)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
    payload,
  );
  const id = rows[0]!.id;
  revalidatePath("/");
  revalidatePath("/admin/tytuly");
  return { id, slug };
}

export async function deleteMedia(id: number) {
  await requireAdmin();
  await ensureDbReady();
  await query("delete from media where id = $1", [id]);
  revalidatePath("/");
  revalidatePath("/admin/tytuly");
}

export async function saveEpisode(form: {
  id?: number;
  media_id: number;
  season_number: number;
  episode_number: number;
  title: string;
  video_url: string;
  thumbnail_url: string;
}) {
  await requireAdmin();
  await ensureDbReady();
  if (form.id) {
    await query(
      `update episodes set season_number=$1, episode_number=$2, title=$3, video_url=$4, thumbnail_url=$5 where id=$6`,
      [
        form.season_number,
        form.episode_number,
        form.title.trim(),
        form.video_url.trim() || null,
        form.thumbnail_url.trim() || null,
        form.id,
      ],
    );
  } else {
    await query(
      `insert into episodes (media_id, season_number, episode_number, title, video_url, thumbnail_url)
       values ($1,$2,$3,$4,$5,$6)`,
      [
        form.media_id,
        form.season_number,
        form.episode_number,
        form.title.trim(),
        form.video_url.trim() || null,
        form.thumbnail_url.trim() || null,
      ],
    );
  }
  revalidatePath("/admin/tytuly");
}

export async function deleteEpisode(id: number) {
  await requireAdmin();
  await ensureDbReady();
  await query("delete from episodes where id = $1", [id]);
  revalidatePath("/admin/tytuly");
}

export async function toggleFavorite(mediaId: number) {
  const user = await requireUser();
  await ensureDbReady();
  const existing = await query("select 1 from favorites where user_id = $1 and media_id = $2", [user.id, mediaId]);
  if (existing.length) {
    await query("delete from favorites where user_id = $1 and media_id = $2", [user.id, mediaId]);
    revalidatePath("/lista");
    return { saved: false };
  }
  await query("insert into favorites (user_id, media_id) values ($1,$2)", [user.id, mediaId]);
  revalidatePath("/lista");
  return { saved: true };
}

export async function isFavorite(mediaId: number) {
  const session = await auth();
  if (!session?.user?.id) return false;
  await ensureDbReady();
  const rows = await query("select 1 from favorites where user_id = $1 and media_id = $2", [
    session.user.id,
    mediaId,
  ]);
  return rows.length > 0;
}

export async function listFavorites() {
  const user = await requireUser();
  await ensureDbReady();
  const rows = await query<MediaRow>(
    `select m.* from favorites f join media m on m.id = f.media_id
     where f.user_id = $1 order by f.created_at desc`,
    [user.id],
  );
  return rows.map(toTitleCard);
}

export async function saveProgress(input: {
  mediaId: number;
  episodeId: number | null;
  positionSeconds: number;
  durationSeconds: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return;
  await ensureDbReady();
  await query(
    `insert into watch_progress (user_id, media_id, episode_id, position_seconds, duration_seconds, updated_at)
     values ($1,$2,$3,$4,$5, now())
     on conflict (user_id, media_id) do update set
       episode_id = excluded.episode_id,
       position_seconds = excluded.position_seconds,
       duration_seconds = excluded.duration_seconds,
       updated_at = now()`,
    [
      session.user.id,
      input.mediaId,
      input.episodeId,
      Math.floor(input.positionSeconds),
      Math.floor(input.durationSeconds),
    ],
  );
}

export async function listUsersAdmin() {
  await requireAdmin();
  await ensureDbReady();
  return query<{ id: string; name: string | null; email: string | null; role: string; image: string | null }>(
    `select id, name, email, role, image from users order by role desc, email`,
  );
}

export async function setUserRole(userId: string, role: "admin" | "user") {
  const me = await requireAdmin();
  if (me.id === userId && role !== "admin") throw new Error("Nie możesz odebrać sobie roli admina");
  await ensureDbReady();
  await query("update users set role = $2 where id = $1", [userId, role]);
  revalidatePath("/admin/uzytkownicy");
}
