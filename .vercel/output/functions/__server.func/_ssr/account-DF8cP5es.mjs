import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-pjU63h5f.mjs";
import { i as toNumber, n as toBool, r as toInt } from "./json-D7LqX4r_.mjs";
import { s as mapCard, t as TITLE_SELECT } from "./catalog-D8NM-GvQ.mjs";
import { t as authMiddleware } from "./middleware-Bdz0XNzG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-DF8cP5es.js
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
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "a7bfb2735f11df3d6bbf55085ae071faa90bad2cde2fcce815d27570e17c5822",
	name: "getMyProfile",
	filename: "src/lib/server/account.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	return ensureProfile(await getSql(), context.userId, null);
});
var listFavorites_createServerFn_handler = createServerRpc({
	id: "0eab18b323b47d0c87854db7918df01158c4cf13507480fc350620fd8eda3c30",
	name: "listFavorites",
	filename: "src/lib/server/account.ts"
}, (opts) => listFavorites.__executeServer(opts));
var listFavorites = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listFavorites_createServerFn_handler, async ({ context }) => {
	return (await (await getSql()).query(`select ${TITLE_SELECT}
       from favorites f
       join titles t on t.id = f.title_id
       where f.user_id = $1 and t.is_published = true
       order by f.created_at desc`, [context.userId])).map(mapCard);
});
var toggleFavorite_createServerFn_handler = createServerRpc({
	id: "0a323b87d348737b0b372fbc06a2d547da6eb4173fa7af4f01fc250ebd781594",
	name: "toggleFavorite",
	filename: "src/lib/server/account.ts"
}, (opts) => toggleFavorite.__executeServer(opts));
var toggleFavorite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(toggleFavorite_createServerFn_handler, async ({ context, data: titleId }) => {
	const sql = await getSql();
	if ((await sql`
      select 1 from favorites where user_id = ${context.userId} and title_id = ${titleId}
    `).length) {
		await sql`delete from favorites where user_id = ${context.userId} and title_id = ${titleId}`;
		return { saved: false };
	}
	await sql`insert into favorites (user_id, title_id) values (${context.userId}, ${titleId})`;
	return { saved: true };
});
var isFavorite_createServerFn_handler = createServerRpc({
	id: "f47613597c3005b8461d3af3576e8edfc0d9d242b403a361cf90417a3d443ce3",
	name: "isFavorite",
	filename: "src/lib/server/account.ts"
}, (opts) => isFavorite.__executeServer(opts));
var isFavorite = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(isFavorite_createServerFn_handler, async ({ context, data: titleId }) => {
	return (await (await getSql())`
      select 1 from favorites where user_id = ${context.userId} and title_id = ${titleId}
    `).length > 0;
});
var saveProgress_createServerFn_handler = createServerRpc({
	id: "51a818093c12a48dd81dca5d7dc079b7ce3668b64cb302c311682aff88c2e759",
	name: "saveProgress",
	filename: "src/lib/server/account.ts"
}, (opts) => saveProgress.__executeServer(opts));
var saveProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveProgress_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
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
var getProgress_createServerFn_handler = createServerRpc({
	id: "d95dbe8ae98a3f6c7db8d275a6a9da4407fe63c0ee51d132bb1e1a37e95847c9",
	name: "getProgress",
	filename: "src/lib/server/account.ts"
}, (opts) => getProgress.__executeServer(opts));
var getProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(getProgress_createServerFn_handler, async ({ context, data: titleId }) => {
	const row = (await (await getSql())`
      select episode_id, position_seconds, duration_seconds
      from watch_progress
      where user_id = ${context.userId} and title_id = ${titleId}
    `)[0];
	if (!row) return null;
	return {
		episodeId: toNumber(row.episode_id),
		positionSeconds: toInt(row.position_seconds),
		durationSeconds: toInt(row.duration_seconds)
	};
});
var listContinueWatching_createServerFn_handler = createServerRpc({
	id: "6f237afff210937c8fd6fecb20f154248252722c9239bde8b6619aedbe70143f",
	name: "listContinueWatching",
	filename: "src/lib/server/account.ts"
}, (opts) => listContinueWatching.__executeServer(opts));
var listContinueWatching = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listContinueWatching_createServerFn_handler, async ({ context }) => {
	return (await (await getSql()).query(`select ${TITLE_SELECT},
              wp.episode_id, wp.position_seconds, wp.duration_seconds, wp.updated_at,
              e.title as episode_title
       from watch_progress wp
       join titles t on t.id = wp.title_id
       left join episodes e on e.id = wp.episode_id
       where wp.user_id = $1 and t.is_published = true
         and wp.duration_seconds > 0
         and wp.position_seconds::float / wp.duration_seconds < 0.95
       order by wp.updated_at desc
       limit 16`, [context.userId])).map((row) => ({
		titleId: toInt(row.id),
		episodeId: toNumber(row.episode_id),
		positionSeconds: toInt(row.position_seconds),
		durationSeconds: toInt(row.duration_seconds),
		updatedAt: String(row.updated_at ?? ""),
		title: mapCard(row),
		episodeTitle: row.episode_title ? String(row.episode_title) : null
	}));
});
var rateTitle_createServerFn_handler = createServerRpc({
	id: "696074301e04bbabfad01a051e1d6c0348d945c3692c531e752f16d1c2994d9e",
	name: "rateTitle",
	filename: "src/lib/server/account.ts"
}, (opts) => rateTitle.__executeServer(opts));
var rateTitle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(rateTitle_createServerFn_handler, async ({ context, data }) => {
	const score = Math.min(10, Math.max(1, Math.round(data.score)));
	await (await getSql())`
      insert into ratings (user_id, title_id, score)
      values (${context.userId}, ${data.titleId}, ${score})
      on conflict (user_id, title_id) do update set score = excluded.score
    `;
	return { score };
});
var getMyRating_createServerFn_handler = createServerRpc({
	id: "b11832fad840986947ac8486cc60fb040442ca2cfeb6cc05ddefd123792e0200",
	name: "getMyRating",
	filename: "src/lib/server/account.ts"
}, (opts) => getMyRating.__executeServer(opts));
var getMyRating = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((titleId) => titleId).handler(getMyRating_createServerFn_handler, async ({ context, data: titleId }) => {
	const rows = await (await getSql())`
      select score from ratings where user_id = ${context.userId} and title_id = ${titleId}
    `;
	return rows[0] ? toInt(rows[0].score) : null;
});
//#endregion
export { getMyProfile_createServerFn_handler, getMyRating_createServerFn_handler, getProgress_createServerFn_handler, isFavorite_createServerFn_handler, listContinueWatching_createServerFn_handler, listFavorites_createServerFn_handler, rateTitle_createServerFn_handler, saveProgress_createServerFn_handler, toggleFavorite_createServerFn_handler };
