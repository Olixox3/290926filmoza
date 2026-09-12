import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as KIND_PLURAL } from "./types-PJ_bBQ70.mjs";
import { r as PosterGrid } from "./poster-card-BbIY_WSM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browse-BChuchWv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SORTS = [
	{
		id: "featured",
		label: "Wyróżnione"
	},
	{
		id: "year",
		label: "Najnowsze"
	},
	{
		id: "title",
		label: "A–Z"
	},
	{
		id: "rating",
		label: "Ocena"
	}
];
function BrowsePage({ kind, titles, heading }) {
	const [genre, setGenre] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("featured");
	const genres = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of titles) for (const g of t.genres) map.set(g.slug, g.name);
		return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], "pl"));
	}, [titles]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = titles.filter((t) => kind ? t.kind === kind : true);
		if (genre !== "all") list = list.filter((t) => t.genres.some((g) => g.slug === genre));
		const copy = [...list];
		copy.sort((a, b) => {
			if (sort === "year") return (b.year ?? 0) - (a.year ?? 0);
			if (sort === "title") return a.title.localeCompare(b.title, "pl");
			if (sort === "rating") return (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0);
			return Number(b.isFeatured) - Number(a.isFeatured) || (b.year ?? 0) - (a.year ?? 0);
		});
		return copy;
	}, [
		titles,
		kind,
		genre,
		sort
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-subtle uppercase",
				children: "Katalog"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-wide md:text-5xl",
				children: heading ?? (kind ? KIND_PLURAL[kind] : "Wszystko")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: genre,
						onChange: (e) => setGenre(e.target.value),
						className: "h-10 rounded-md border border-border bg-bg-elevated px-3 text-sm",
						"aria-label": "Gatunek",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "Wszystkie gatunki"
						}), genres.map(([slug, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: slug,
							children: name
						}, slug))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "h-10 rounded-md border border-border bg-bg-elevated px-3 text-sm",
						"aria-label": "Sortowanie",
						children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.label
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-subtle",
						children: [filtered.length, " tytułów"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterGrid, { titles: filtered })
		]
	});
}
//#endregion
export { BrowsePage as t };
