import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-pjU63h5f.mjs";
import { i as toNumber, r as toInt } from "./json-D7LqX4r_.mjs";
import { c as mapSource, s as mapCard, t as TITLE_SELECT } from "./catalog-D8NM-GvQ.mjs";
import { t as authMiddleware } from "./middleware-Bdz0XNzG.mjs";
import { t as ensureProfile } from "./account-C_BH8a4Y.mjs";
import { t as slugify } from "./slug-C9BI4EYb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-hdSHB2Xh.js
var ForbiddenError = class extends Error {
	status = 403;
	constructor() {
		super("Forbidden");
	}
};
async function requireAdmin(sql, userId) {
	const profile = await ensureProfile(sql, userId, null);
	if (profile.role !== "admin") throw new ForbiddenError();
	return profile;
}
function inferSourceKind(url, kind) {
	const u = url.toLowerCase();
	if (u.includes(".m3u8")) return "hls";
	if (/\.(mp4|webm|ogv)(\?|$)/.test(u) || u.includes("archive.org") || u.startsWith("/videos/")) return "mp4";
	if (/streamtape|voe\.sx|dood|ok\.ru|emb\.|youtube\.com|youtu\.be|vimeo\.com/.test(u) && !/\.(mp4|m3u8)(\?|$)/.test(u)) return "embed";
	return kind;
}
var sourceSchema = object({
	label: string().min(1).max(80),
	url: string().min(1).max(2e3),
	kind: _enum([
		"mp4",
		"hls",
		"embed"
	]),
	language: string().min(1).max(8),
	isPrimary: boolean()
});
var titleSchema = object({
	id: number().int().optional(),
	kind: _enum([
		"movie",
		"series",
		"show"
	]),
	title: string().min(1).max(200),
	originalTitle: string().max(200).nullable().optional(),
	slug: string().max(80).optional(),
	year: number().int().min(1880).max(2100).nullable().optional(),
	description: string().max(8e3).nullable().optional(),
	posterUrl: string().max(2e3).nullable().optional(),
	backdropUrl: string().max(2e3).nullable().optional(),
	trailerUrl: string().max(2e3).nullable().optional(),
	quality: string().max(20).nullable().optional(),
	ageRating: string().max(10).nullable().optional(),
	runtimeMinutes: number().int().min(0).max(1e3).nullable().optional(),
	country: string().max(80).nullable().optional(),
	director: string().max(200).nullable().optional(),
	castText: string().max(2e3).nullable().optional(),
	isFeatured: boolean(),
	isPublished: boolean(),
	genreIds: array(number().int()),
	sources: array(sourceSchema).optional()
});
var getAdminStats_createServerFn_handler = createServerRpc({
	id: "6406231809d31ba8950a82a40792322c0625536ab6f17170901260c406565838",
	name: "getAdminStats",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminStats.__executeServer(opts));
var getAdminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminStats_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const titles = await sql`select count(*)::int as n from titles`;
	const movies = await sql`select count(*)::int as n from titles where kind = 'movie'`;
	const series = await sql`select count(*)::int as n from titles where kind = 'series'`;
	const shows = await sql`select count(*)::int as n from titles where kind = 'show'`;
	const users = await sql`select count(*)::int as n from profiles`;
	const genres = await sql`select count(*)::int as n from genres`;
	return {
		titles: toInt(titles[0]?.n),
		movies: toInt(movies[0]?.n),
		series: toInt(series[0]?.n),
		shows: toInt(shows[0]?.n),
		users: toInt(users[0]?.n),
		genres: toInt(genres[0]?.n)
	};
});
var listAdminTitles_createServerFn_handler = createServerRpc({
	id: "8997585f5943f697c8e17ef4cfc1f2c8414c35b5c9903534c29f50c6caa0dc27",
	name: "listAdminTitles",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAdminTitles.__executeServer(opts));
var listAdminTitles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminTitles_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return (await sql.query(`select ${TITLE_SELECT} from titles t order by t.updated_at desc`)).map(mapCard);
});
var getAdminTitle_createServerFn_handler = createServerRpc({
	id: "6db7476cd1c37b6d2190e6409ffeaa1cef68b001008b778496a979634230a441",
	name: "getAdminTitle",
	filename: "src/lib/server/admin.ts"
}, (opts) => getAdminTitle.__executeServer(opts));
var getAdminTitle = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getAdminTitle_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const rows = await sql.query(`select ${TITLE_SELECT} from titles t where t.id = $1`, [id]);
	if (!rows[0]) return null;
	const card = mapCard(rows[0]);
	const sources = (await sql.query(`select * from video_sources where title_id = $1 order by id`, [id])).map(mapSource);
	const seasons = await sql.query(`select * from seasons where title_id = $1 order by season_number`, [id]);
	const seasonPayload = [];
	for (const s of seasons) {
		const episodes = await sql.query(`select * from episodes where season_id = $1 order by episode_number`, [s.id]);
		const eps = [];
		for (const e of episodes) {
			const epSources = (await sql.query(`select * from video_sources where episode_id = $1 order by id`, [e.id])).map(mapSource);
			eps.push({
				id: toInt(e.id),
				seasonId: toInt(e.season_id),
				episodeNumber: toInt(e.episode_number),
				title: String(e.title ?? ""),
				description: e.description ? String(e.description) : null,
				runtimeMinutes: toNumber(e.runtime_minutes),
				stillUrl: e.still_url ? String(e.still_url) : null,
				sources: epSources
			});
		}
		seasonPayload.push({
			id: toInt(s.id),
			titleId: toInt(s.title_id),
			seasonNumber: toInt(s.season_number),
			name: s.name,
			episodes: eps
		});
	}
	return {
		...card,
		sources,
		seasons: seasonPayload
	};
});
var upsertTitle_createServerFn_handler = createServerRpc({
	id: "08258af574921046be77d64f6a9519a259e95b8c5207189ba7bdc291b13075f8",
	name: "upsertTitle",
	filename: "src/lib/server/admin.ts"
}, (opts) => upsertTitle.__executeServer(opts));
var upsertTitle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => titleSchema.parse(input)).handler(upsertTitle_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const slug = data.slug && data.slug.trim() || slugify(data.title);
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
	if (id) await sql`
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
	else {
		const inserted = await sql`
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
	for (const gid of data.genreIds) await sql`insert into title_genres (title_id, genre_id) values (${id}, ${gid})`;
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
	return {
		id,
		slug
	};
});
var deleteTitle_createServerFn_handler = createServerRpc({
	id: "ae1624f0167bf36359a49b0152571123eceb1e5b72319cd3e67f1c032c753476",
	name: "deleteTitle",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteTitle.__executeServer(opts));
var deleteTitle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteTitle_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`delete from titles where id = ${id}`;
	return { ok: true };
});
var upsertGenre_createServerFn_handler = createServerRpc({
	id: "07b04543236413dfe71d5688857d791c3a5f2ff5911afe6b5177bdcbcef98e35",
	name: "upsertGenre",
	filename: "src/lib/server/admin.ts"
}, (opts) => upsertGenre.__executeServer(opts));
var upsertGenre = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertGenre_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const slug = data.slug && data.slug.trim() || slugify(data.name);
	if (data.id) {
		await sql`
        update genres set name = ${data.name}, slug = ${slug}, sort_order = ${data.sortOrder}
        where id = ${data.id}
      `;
		return { id: data.id };
	}
	const inserted = await sql`
      insert into genres (name, slug, sort_order) values (${data.name}, ${slug}, ${data.sortOrder})
      returning id
    `;
	return { id: toInt(inserted[0]?.id) };
});
var deleteGenre_createServerFn_handler = createServerRpc({
	id: "c8e104d30fc3f96d6b59fe6ab50add26014b562ba8a869af88aa11d9889ae99c",
	name: "deleteGenre",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteGenre.__executeServer(opts));
var deleteGenre = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteGenre_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`delete from genres where id = ${id}`;
	return { ok: true };
});
var addSeason_createServerFn_handler = createServerRpc({
	id: "b4b895eb75918cc5fec709cbddf1bcaca6b061ea6a658ca665a136891852fc96",
	name: "addSeason",
	filename: "src/lib/server/admin.ts"
}, (opts) => addSeason.__executeServer(opts));
var addSeason = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addSeason_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const inserted = await sql`
      insert into seasons (title_id, season_number, name)
      values (${data.titleId}, ${data.seasonNumber}, ${data.name ?? null})
      returning id
    `;
	return { id: toInt(inserted[0]?.id) };
});
var deleteSeason_createServerFn_handler = createServerRpc({
	id: "1679601d593ebd180deef1e53b8b4e16071e8738e18803e0196e725ca11fa7c7",
	name: "deleteSeason",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteSeason.__executeServer(opts));
var deleteSeason = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteSeason_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`delete from seasons where id = ${id}`;
	return { ok: true };
});
var addEpisode_createServerFn_handler = createServerRpc({
	id: "cce86b45a40429e855b5882680d592ddf17eecdcb3a822073f4f39a41a0a883c",
	name: "addEpisode",
	filename: "src/lib/server/admin.ts"
}, (opts) => addEpisode.__executeServer(opts));
var addEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addEpisode_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const inserted = await sql`
      insert into episodes (season_id, episode_number, title, description, runtime_minutes)
      values (${data.seasonId}, ${data.episodeNumber}, ${data.title}, ${data.description ?? null}, ${data.runtimeMinutes ?? null})
      returning id
    `;
	return { id: toInt(inserted[0]?.id) };
});
var deleteEpisode_createServerFn_handler = createServerRpc({
	id: "ccb92b0abfd84afe5b407d803cb12b41a925a774bcdeb7aab5ef8af430fc1122",
	name: "deleteEpisode",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteEpisode.__executeServer(opts));
var deleteEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteEpisode_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`delete from episodes where id = ${id}`;
	return { ok: true };
});
var addSource_createServerFn_handler = createServerRpc({
	id: "7a847dd98829541de65f190933d7ed2d296b902e8a115ee4d66d5b975a2fda3d",
	name: "addSource",
	filename: "src/lib/server/admin.ts"
}, (opts) => addSource.__executeServer(opts));
var addSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addSource_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	const kind = inferSourceKind(data.url, data.kind);
	const inserted = await sql`
      insert into video_sources (title_id, episode_id, label, url, kind, language, is_primary)
      values (${data.titleId ?? null}, ${data.episodeId ?? null}, ${data.label}, ${data.url}, ${kind}, ${data.language}, ${data.isPrimary})
      returning id
    `;
	return { id: toInt(inserted[0]?.id) };
});
var deleteSource_createServerFn_handler = createServerRpc({
	id: "f81c56bf264dedab40abc3fb1f87a86c83cd041d844a1100f9ca00952b4b3145",
	name: "deleteSource",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteSource.__executeServer(opts));
var deleteSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteSource_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	await sql`delete from video_sources where id = ${id}`;
	return { ok: true };
});
var listAdminUsers_createServerFn_handler = createServerRpc({
	id: "de071b74b9a19d1c93f79020792bfb8cad47ffbec43a5e636819602cf90c29fa",
	name: "listAdminUsers",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAdminUsers.__executeServer(opts));
var listAdminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminUsers_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	return (await sql.query(`select p.user_id, p.display_name, p.role, p.created_at, u.email
       from profiles p
       left join "user" u on u.id = p.user_id
       order by p.created_at desc`)).map((r) => ({
		userId: r.user_id,
		displayName: r.display_name,
		email: r.email,
		role: r.role === "admin" ? "admin" : "user",
		createdAt: String(r.created_at)
	}));
});
var setUserRole_createServerFn_handler = createServerRpc({
	id: "ac3f811a02d228af5c22de1cb1fe741feaa6d4ac380686214453278a57b4d919",
	name: "setUserRole",
	filename: "src/lib/server/admin.ts"
}, (opts) => setUserRole.__executeServer(opts));
var setUserRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setUserRole_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireAdmin(sql, context.userId);
	if (data.userId === context.userId && data.role !== "admin") throw new Error("Nie możesz odebrać sobie uprawnień administratora.");
	await sql`update profiles set role = ${data.role} where user_id = ${data.userId}`;
	return { ok: true };
});
//#endregion
export { addEpisode_createServerFn_handler, addSeason_createServerFn_handler, addSource_createServerFn_handler, deleteEpisode_createServerFn_handler, deleteGenre_createServerFn_handler, deleteSeason_createServerFn_handler, deleteSource_createServerFn_handler, deleteTitle_createServerFn_handler, getAdminStats_createServerFn_handler, getAdminTitle_createServerFn_handler, listAdminTitles_createServerFn_handler, listAdminUsers_createServerFn_handler, setUserRole_createServerFn_handler, upsertGenre_createServerFn_handler, upsertTitle_createServerFn_handler };
