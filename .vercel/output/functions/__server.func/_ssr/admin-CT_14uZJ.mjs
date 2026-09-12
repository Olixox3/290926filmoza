import { r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { n as createSsrRpc } from "./catalog-D8NM-GvQ.mjs";
import { t as authMiddleware } from "./middleware-Bdz0XNzG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CT_14uZJ.js
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
var getAdminStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6406231809d31ba8950a82a40792322c0625536ab6f17170901260c406565838"));
var listAdminTitles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8997585f5943f697c8e17ef4cfc1f2c8414c35b5c9903534c29f50c6caa0dc27"));
var getAdminTitle = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("6db7476cd1c37b6d2190e6409ffeaa1cef68b001008b778496a979634230a441"));
var upsertTitle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => titleSchema.parse(input)).handler(createSsrRpc("08258af574921046be77d64f6a9519a259e95b8c5207189ba7bdc291b13075f8"));
var deleteTitle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("ae1624f0167bf36359a49b0152571123eceb1e5b72319cd3e67f1c032c753476"));
var upsertGenre = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("07b04543236413dfe71d5688857d791c3a5f2ff5911afe6b5177bdcbcef98e35"));
var deleteGenre = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("c8e104d30fc3f96d6b59fe6ab50add26014b562ba8a869af88aa11d9889ae99c"));
var addSeason = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b4b895eb75918cc5fec709cbddf1bcaca6b061ea6a658ca665a136891852fc96"));
var deleteSeason = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("1679601d593ebd180deef1e53b8b4e16071e8738e18803e0196e725ca11fa7c7"));
var addEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cce86b45a40429e855b5882680d592ddf17eecdcb3a822073f4f39a41a0a883c"));
var deleteEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("ccb92b0abfd84afe5b407d803cb12b41a925a774bcdeb7aab5ef8af430fc1122"));
var addSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7a847dd98829541de65f190933d7ed2d296b902e8a115ee4d66d5b975a2fda3d"));
var deleteSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("f81c56bf264dedab40abc3fb1f87a86c83cd041d844a1100f9ca00952b4b3145"));
var listAdminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("de071b74b9a19d1c93f79020792bfb8cad47ffbec43a5e636819602cf90c29fa"));
var setUserRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ac3f811a02d228af5c22de1cb1fe741feaa6d4ac380686214453278a57b4d919"));
//#endregion
export { deleteGenre as a, deleteTitle as c, listAdminTitles as d, listAdminUsers as f, upsertTitle as h, deleteEpisode as i, getAdminStats as l, upsertGenre as m, addSeason as n, deleteSeason as o, setUserRole as p, addSource as r, deleteSource as s, addEpisode as t, getAdminTitle as u };
