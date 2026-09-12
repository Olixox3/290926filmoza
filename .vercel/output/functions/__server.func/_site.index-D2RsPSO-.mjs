import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { o as listContinueWatching } from "./_ssr/account-C_BH8a4Y.mjs";
import { t as Button } from "./_ssr/button-CFXrErnw.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { _ as Info, d as Play } from "./_libs/lucide-react.mjs";
import { u as Route$15 } from "./_ssr/router-CUEcgZPL.mjs";
import { t as KIND_LABEL } from "./_ssr/types-PJ_bBQ70.mjs";
import { i as PosterRow, t as Badge } from "./_ssr/poster-card-BbIY_WSM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.index-D2RsPSO-.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogHero({ title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-[78vw] overflow-hidden rounded-xl md:min-h-[420px] lg:min-h-[520px]",
		children: [
			title.backdropUrl || title.posterUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: title.backdropUrl ?? title.posterUrl ?? "",
				alt: "",
				className: "absolute inset-0 size-full object-cover object-center"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-r from-bg via-bg/75 to-bg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-bg via-bg/30 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex min-h-[78vw] max-w-xl flex-col justify-end gap-4 p-5 md:min-h-[420px] md:p-10 lg:min-h-[520px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "accent",
								children: KIND_LABEL[title.kind]
							}),
							title.year ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: title.year }) : null,
							title.quality ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "fg",
								children: title.quality
							}) : null,
							title.ageRating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [title.ageRating, "+"] }) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl leading-[0.9] tracking-wide md:text-7xl",
						children: title.title
					}),
					title.originalTitle && title.originalTitle !== title.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: title.originalTitle
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-3 max-w-lg text-sm leading-relaxed text-fg/85 md:text-base",
						children: title.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "cinema",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/ogladaj/$slug",
								params: { slug: title.slug },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-current" }), "Oglądaj"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/tytul/$slug",
								params: { slug: title.slug },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" }), "Więcej info"]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [title.genres.map((g) => g.name).join(" · "), title.director ? ` · reż. ${title.director}` : ""]
					})
				]
			})
		]
	});
}
function HomePage() {
	const catalog = Route$15.useLoaderData();
	const { user, isPending } = useCurrentUserState();
	const cont = useQuery({
		queryKey: ["continue"],
		queryFn: () => listContinueWatching(),
		enabled: Boolean(user) && !isPending
	});
	const titles = catalog.titles ?? [];
	const featured = titles.filter((t) => t.isFeatured);
	const hero = featured[0] ?? titles[0];
	const byGenre = (slug) => titles.filter((t) => t.genres.some((g) => g.slug === slug));
	const byKind = (kind) => titles.filter((t) => t.kind === kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogHero, { title: hero }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHome, {}),
			cont.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Oglądaj dalej",
				titles: cont.data.map((c) => c.title)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Wyróżnione",
				titles: featured
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Filmy",
				titles: byKind("movie"),
				href: "/filmy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Seriale",
				titles: byKind("series"),
				href: "/seriale"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Programy",
				titles: byKind("show"),
				href: "/programy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Animacja",
				titles: byGenre("animacja"),
				href: "/gatunek/animacja"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Klasyka",
				titles: byGenre("klasyka"),
				href: "/gatunek/klasyka"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Horror",
				titles: byGenre("horror"),
				href: "/gatunek/horror"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterRow, {
				heading: "Kino nieme",
				titles: byGenre("niemy"),
				href: "/gatunek/niemy"
			})
		]
	});
}
function EmptyHome() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-bg-elevated px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-wide",
			children: "Filmoza"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Katalog jest pusty. Zaloguj się jako admin i dodaj pierwszy tytuł."
		})]
	});
}
//#endregion
export { HomePage as component };
