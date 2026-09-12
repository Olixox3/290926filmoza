//#region node_modules/.nitro/vite/services/ssr/assets/json-D7LqX4r_.js
function parseJson(value, fallback) {
	if (value == null) return fallback;
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
	return value;
}
function toNumber(value) {
	if (value == null || value === "") return null;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : null;
}
function toInt(value, fallback = 0) {
	const n = toNumber(value);
	return n == null ? fallback : Math.trunc(n);
}
function toBool(value) {
	return value === true || value === "t" || value === "true" || value === 1 || value === "1";
}
//#endregion
export { toNumber as i, toBool as n, toInt as r, parseJson as t };
