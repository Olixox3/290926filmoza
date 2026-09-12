import { r as createServerFn } from "./ssr.mjs";
import { n as toBool, r as toInt } from "./json-D7LqX4r_.mjs";
import { n as createSsrRpc } from "./catalog-D8NM-GvQ.mjs";
import { t as authMiddleware } from "./middleware-Bdz0XNzG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-C_BH8a4Y.js
async function ensureProfile(sql, userId, displayName) {
	const authUser = (await sql.query(`select name, email, "emailVerified" as email_verified from "user" where id = $1`, [userId]))[0];
	const name = displayName || authUser?.name || null;
	const verified = toBool(authUser?.email_verified);
	const existing = await sql`
    select user_id, display_name, role, email_verified from profiles where user_id = ${userId}
  `;
	if (existing[0]) {
		if (!existing[0].display_name && name) await sql`update profiles set display_name = ${name} where user_id = ${userId}`;
		if (verified && !existing[0].email_verified) await sql`update profiles set email_verified = now() where user_id = ${userId}`;
		return {
			userId: existing[0].user_id,
			displayName: existing[0].display_name || name,
			role: existing[0].role === "admin" ? "admin" : "user"
		};
	}
	const admins = await sql`select count(*)::int as n from profiles where role = 'admin'`;
	const role = toInt(admins[0]?.n) === 0 ? "admin" : "user";
	await sql`
    insert into profiles (user_id, display_name, role, email_verified)
    values (${userId}, ${name}, ${role}, ${verified ? (/* @__PURE__ */ new Date()).toISOString() : null})
  `;
	return {
		userId,
		displayName: name,
		role
	};
}
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a7bfb2735f11df3d6bbf55085ae071faa90bad2cde2fcce815d27570e17c5822"));
var listFavorites = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0eab18b323b47d0c87854db7918df01158c4cf13507480fc350620fd8eda3c30"));
var toggleFavorite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(createSsrRpc("0a323b87d348737b0b372fbc06a2d547da6eb4173fa7af4f01fc250ebd781594"));
var isFavorite = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(createSsrRpc("f47613597c3005b8461d3af3576e8edfc0d9d242b403a361cf90417a3d443ce3"));
var saveProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("51a818093c12a48dd81dca5d7dc079b7ce3668b64cb302c311682aff88c2e759"));
var getProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(createSsrRpc("d95dbe8ae98a3f6c7db8d275a6a9da4407fe63c0ee51d132bb1e1a37e95847c9"));
var listContinueWatching = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6f237afff210937c8fd6fecb20f154248252722c9239bde8b6619aedbe70143f"));
var rateTitle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("696074301e04bbabfad01a051e1d6c0348d945c3692c531e752f16d1c2994d9e"));
var getMyRating = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(createSsrRpc("b11832fad840986947ac8486cc60fb040442ca2cfeb6cc05ddefd123792e0200"));
//#endregion
export { isFavorite as a, rateTitle as c, getProgress as i, saveProgress as l, getMyProfile as n, listContinueWatching as o, getMyRating as r, listFavorites as s, ensureProfile as t, toggleFavorite as u };
