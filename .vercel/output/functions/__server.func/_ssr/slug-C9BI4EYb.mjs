//#region node_modules/.nitro/vite/services/ssr/assets/slug-C9BI4EYb.js
var PL_MAP = {
	ą: "a",
	ć: "c",
	ę: "e",
	ł: "l",
	ń: "n",
	ó: "o",
	ś: "s",
	ź: "z",
	ż: "z"
};
function slugify(value) {
	return value.toLowerCase().replace(/[ąćęłńóśźż]/g, (ch) => PL_MAP[ch] ?? ch).normalize("NFD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
//#endregion
export { slugify as t };
