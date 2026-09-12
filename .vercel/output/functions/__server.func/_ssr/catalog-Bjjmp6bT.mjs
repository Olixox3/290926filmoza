import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-pjU63h5f.mjs";
import { i as toNumber, n as toBool, r as toInt, t as parseJson } from "./json-D7LqX4r_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-Bjjmp6bT.js
var TITLE_SELECT = `
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
function mapSource(row) {
	const kind = row.kind === "hls" || row.kind === "embed" ? row.kind : "mp4";
	return {
		id: toInt(row.id),
		titleId: toNumber(row.title_id),
		episodeId: toNumber(row.episode_id),
		label: String(row.label ?? "Odtwarzacz"),
		url: String(row.url ?? ""),
		kind,
		language: String(row.language ?? "pl"),
		isPrimary: toBool(row.is_primary)
	};
}
function mapCard(row) {
	const kind = row.kind ?? "movie";
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
		genres: parseJson(row.genres, []),
		ratingAvg: toNumber(row.rating_avg),
		ratingCount: toInt(row.rating_count)
	};
}
async function fetchPublished(sql, whereSql, params = []) {
	return (await sql.query(`select ${TITLE_SELECT} from titles t where t.is_published = true ${whereSql} order by t.is_featured desc, t.year desc nulls last, t.title`, params)).map(mapCard);
}
var listGenres_createServerFn_handler = createServerRpc({
	id: "85d2950f0c3ab3848879431c1b154e6a2dbcce1bda706b749c34b27cee6ff39b",
	name: "listGenres",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listGenres.__executeServer(opts));
var listGenres = createServerFn({ method: "GET" }).handler(listGenres_createServerFn_handler, async () => {
	return (await (await getSql())`
    select id, name, slug, sort_order from genres order by sort_order, name
  `).map((g) => ({
		id: toInt(g.id),
		name: g.name,
		slug: g.slug,
		sortOrder: toInt(g.sort_order)
	}));
});
var listCatalog_createServerFn_handler = createServerRpc({
	id: "e65ece55b2cc1c96f2f27697b78c365e90272ee35301707292dea1bb054aa0fc",
	name: "listCatalog",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "GET" }).handler(listCatalog_createServerFn_handler, async () => {
	const sql = await getSql();
	return {
		titles: await fetchPublished(sql, ""),
		genres: (await sql`
    select id, name, slug, sort_order from genres order by sort_order, name
  `).map((g) => ({
			id: toInt(g.id),
			name: g.name,
			slug: g.slug,
			sortOrder: toInt(g.sort_order)
		}))
	};
});
var listByKind_createServerFn_handler = createServerRpc({
	id: "85b375c828082d10dd6d1721e15b86463e13db9b175d72e9fd43a591b7c8cc57",
	name: "listByKind",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listByKind.__executeServer(opts));
var listByKind = createServerFn({ method: "GET" }).validator((kind) => kind).handler(listByKind_createServerFn_handler, async ({ data: kind }) => {
	return fetchPublished(await getSql(), "and t.kind = $1", [kind]);
});
var listByGenre_createServerFn_handler = createServerRpc({
	id: "7e255133c50e4adf49c2195060fe3414ccacdda95ac668dd086a4e1a076b06e9",
	name: "listByGenre",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listByGenre.__executeServer(opts));
var listByGenre = createServerFn({ method: "GET" }).validator((slug) => slug).handler(listByGenre_createServerFn_handler, async ({ data: slug }) => {
	return fetchPublished(await getSql(), "and exists (select 1 from title_genres tg join genres g on g.id = tg.genre_id where tg.title_id = t.id and g.slug = $1)", [slug]);
});
var searchTitles_createServerFn_handler = createServerRpc({
	id: "67249fbb5f9310a8a5fc4f5a5aad958839f05d8847149db164e3f9f5ad6f5b29",
	name: "searchTitles",
	filename: "src/lib/server/catalog.ts"
}, (opts) => searchTitles.__executeServer(opts));
var searchTitles = createServerFn({ method: "GET" }).validator((q) => q.trim().slice(0, 80)).handler(searchTitles_createServerFn_handler, async ({ data: q }) => {
	if (!q) return [];
	return fetchPublished(await getSql(), "and (t.title ilike $1 or coalesce(t.original_title,'') ilike $1 or coalesce(t.description,'') ilike $1 or coalesce(t.director,'') ilike $1)", [`%${q}%`]);
});
async function loadSeasons(sql, titleId) {
	const seasonRows = await sql.query(`select * from seasons where title_id = $1 order by season_number`, [titleId]);
	if (!seasonRows.length) return [];
	const seasonIds = seasonRows.map((s) => toInt(s.id));
	const seasonPh = seasonIds.map((_, i) => `$${i + 1}`).join(", ");
	const epRows = await sql.query(`select * from episodes where season_id in (${seasonPh}) order by season_id, episode_number`, seasonIds);
	const epIds = epRows.map((e) => toInt(e.id));
	const srcRows = epIds.length ? await sql.query(`select * from video_sources where episode_id in (${epIds.map((_, i) => `$${i + 1}`).join(", ")}) order by is_primary desc, id`, epIds) : [];
	const sourcesByEp = /* @__PURE__ */ new Map();
	for (const row of srcRows) {
		const mapped = mapSource(row);
		const key = mapped.episodeId ?? 0;
		const list = sourcesByEp.get(key) ?? [];
		list.push(mapped);
		sourcesByEp.set(key, list);
	}
	const episodesBySeason = /* @__PURE__ */ new Map();
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
			sources: sourcesByEp.get(toInt(e.id)) ?? []
		});
		episodesBySeason.set(seasonId, list);
	}
	return seasonRows.map((s) => ({
		id: toInt(s.id),
		titleId: toInt(s.title_id),
		seasonNumber: toInt(s.season_number),
		name: s.name,
		episodes: episodesBySeason.get(toInt(s.id)) ?? []
	}));
}
var getTitleBySlug_createServerFn_handler = createServerRpc({
	id: "ee80aeea9945b3a527d851ca158c4973f638ae1b65fcfbbd26c3f427a916bc66",
	name: "getTitleBySlug",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getTitleBySlug.__executeServer(opts));
var getTitleBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(getTitleBySlug_createServerFn_handler, async ({ data: slug }) => {
	const sql = await getSql();
	const row = (await sql.query(`select ${TITLE_SELECT} from titles t where t.slug = $1 and t.is_published = true`, [slug]))[0];
	if (!row) return null;
	const card = mapCard(row);
	const sources = (await sql.query(`select * from video_sources where title_id = $1 order by is_primary desc, id`, [card.id])).map(mapSource);
	const seasons = await loadSeasons(sql, card.id);
	const genreIds = card.genres.map((g) => g.id);
	let similar = [];
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
		similar
	};
});
var getWatchPayload_createServerFn_handler = createServerRpc({
	id: "915c55207c268ecd312a422c8375a258883f6e08a37be88f3d5eeb36a466451c",
	name: "getWatchPayload",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getWatchPayload.__executeServer(opts));
var getWatchPayload = createServerFn({ method: "GET" }).validator((input) => input).handler(getWatchPayload_createServerFn_handler, async ({ data }) => {
	const title = await getTitleBySlug({ data: data.slug });
	if (!title) return null;
	let episode = null;
	if (title.kind !== "movie") {
		const all = title.seasons.flatMap((s) => s.episodes);
		episode = all.find((e) => e.id === data.episodeId) ?? all[0] ?? null;
	}
	const sources = title.kind === "movie" ? title.sources : episode?.sources ?? [];
	return {
		title,
		episode,
		sources
	};
});
//#endregion
export { getTitleBySlug_createServerFn_handler, getWatchPayload_createServerFn_handler, listByGenre_createServerFn_handler, listByKind_createServerFn_handler, listCatalog_createServerFn_handler, listGenres_createServerFn_handler, searchTitles_createServerFn_handler };
