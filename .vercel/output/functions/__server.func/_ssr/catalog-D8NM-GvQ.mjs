import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as toNumber, n as toBool, r as toInt, t as parseJson } from "./json-D7LqX4r_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-D8NM-GvQ.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var listGenres = createServerFn({ method: "GET" }).handler(createSsrRpc("85d2950f0c3ab3848879431c1b154e6a2dbcce1bda706b749c34b27cee6ff39b"));
var listCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("e65ece55b2cc1c96f2f27697b78c365e90272ee35301707292dea1bb054aa0fc"));
createServerFn({ method: "GET" }).validator((kind) => kind).handler(createSsrRpc("85b375c828082d10dd6d1721e15b86463e13db9b175d72e9fd43a591b7c8cc57"));
createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("7e255133c50e4adf49c2195060fe3414ccacdda95ac668dd086a4e1a076b06e9"));
var searchTitles = createServerFn({ method: "GET" }).validator((q) => q.trim().slice(0, 80)).handler(createSsrRpc("67249fbb5f9310a8a5fc4f5a5aad958839f05d8847149db164e3f9f5ad6f5b29"));
var getTitleBySlug = createServerFn({ method: "GET" }).validator((slug) => slug).handler(createSsrRpc("ee80aeea9945b3a527d851ca158c4973f638ae1b65fcfbbd26c3f427a916bc66"));
var getWatchPayload = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("915c55207c268ecd312a422c8375a258883f6e08a37be88f3d5eeb36a466451c"));
//#endregion
export { listCatalog as a, mapSource as c, getWatchPayload as i, searchTitles as l, createSsrRpc as n, listGenres as o, getTitleBySlug as r, mapCard as s, TITLE_SELECT as t };
