import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { r as getTitleBySlug } from "./_ssr/catalog-D8NM-GvQ.mjs";
import { a as isFavorite, c as rateTitle, r as getMyRating, u as toggleFavorite } from "./_ssr/account-C_BH8a4Y.mjs";
import { t as Button } from "./_ssr/button-CFXrErnw.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { t as Skeleton } from "./_ssr/skeleton-CabwNnmC.mjs";
import { d as Play, s as Star, v as Heart } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$2 } from "./_ssr/router-CUEcgZPL.mjs";
import { t as KIND_LABEL } from "./_ssr/types-PJ_bBQ70.mjs";
import { n as PosterCard, t as Badge } from "./_ssr/poster-card-BbIY_WSM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.tytul._slug-DFDMKYS9.js
var import_jsx_runtime = require_jsx_runtime();
function TitlePage() {
	const { slug } = Route$2.useParams();
	const loaded = Route$2.useLoaderData();
	const { user, isPending } = useCurrentUserState();
	const qc = useQueryClient();
	const title = useQuery({
		queryKey: ["title", slug],
		queryFn: () => getTitleBySlug({ data: slug }),
		initialData: loaded ?? void 0
	});
	const fav = useQuery({
		queryKey: ["fav", title.data?.id],
		queryFn: () => isFavorite({ data: title.data.id }),
		enabled: Boolean(user) && Boolean(title.data) && !isPending
	});
	const mine = useQuery({
		queryKey: ["rating", title.data?.id],
		queryFn: () => getMyRating({ data: title.data.id }),
		enabled: Boolean(user) && Boolean(title.data) && !isPending
	});
	const tog = useMutation({
		mutationFn: () => toggleFavorite({ data: title.data.id }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["fav", title.data?.id] });
			qc.invalidateQueries({ queryKey: ["favorites"] });
		},
		onError: () => toast.error("Zaloguj się, żeby dodać do listy.")
	});
	const rate = useMutation({
		mutationFn: (score) => rateTitle({ data: {
			titleId: title.data.id,
			score
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["rating", title.data?.id] });
			qc.invalidateQueries({ queryKey: ["title", slug] });
		}
	});
	if (title.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[480px] w-full rounded-xl" });
	const t = title.data;
	if (!t) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Nie znaleziono"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Ten tytuł nie istnieje albo nie jest opublikowany."
		})]
	});
	const firstEp = t.seasons[0]?.episodes[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-lg bg-card",
					children: t.posterUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: t.posterUrl,
						alt: "",
						className: "aspect-[2/3] w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[2/3] bg-bg-muted" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "accent",
									children: KIND_LABEL[t.kind]
								}),
								t.year ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t.year }) : null,
								t.quality ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "fg",
									children: t.quality
								}) : null,
								t.ageRating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [t.ageRating, "+"] }) : null,
								t.runtimeMinutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [t.runtimeMinutes, " min"] }) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl leading-none tracking-wide md:text-6xl",
							children: t.title
						}),
						t.originalTitle && t.originalTitle !== t.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: t.originalTitle
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-2xl text-sm leading-relaxed text-fg/85 md:text-base",
							children: t.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-1 text-sm text-muted",
							children: [
								t.director ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: "Reżyseria · "
								}), t.director] }) : null,
								t.castText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: "Obsada · "
								}), t.castText] }) : null,
								t.country ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: "Kraj · "
								}), t.country] }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-subtle",
									children: "Gatunki · "
								}), t.genres.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i > 0 ? ", " : "", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/gatunek/$slug",
									params: { slug: g.slug },
									className: "hover:text-fg",
									children: g.name
								})] }, g.id))] }),
								t.ratingCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-subtle",
										children: "Ocena · "
									}),
									(t.ratingAvg ?? 0).toFixed(1),
									" / 10 (",
									t.ratingCount,
									")"
								] }) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "cinema",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/ogladaj/$slug",
									params: { slug: t.slug },
									search: firstEp ? { e: firstEp.id } : {},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-current" }), "Oglądaj"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: fav.data ? "default" : "outline",
								onClick: () => tog.mutate(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: fav.data ? "size-4 fill-current" : "size-4" }), fav.data ? "Na liście" : "Moja lista"]
							})]
						}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-2 text-xs text-subtle",
								children: "Twoja ocena"
							}), Array.from({ length: 10 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => rate.mutate(n),
								className: "grid size-7 place-items-center rounded-sm hover:bg-bg-muted",
								"aria-label": `Ocena ${n}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${mine.data && n <= mine.data ? "fill-accent text-accent" : "text-subtle"}` })
							}, n))]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: "Zaloguj się, żeby oceniać i zapisywać listę."
						})
					]
				})]
			}),
			t.seasons.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl tracking-wide",
					children: "Odcinki"
				}), t.seasons.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium text-muted",
						children: s.name ?? `Sezon ${s.seasonNumber}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border overflow-hidden rounded-lg border border-border",
						children: s.episodes.map((ep) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ogladaj/$slug",
							params: { slug: t.slug },
							search: { e: ep.id },
							className: "flex items-center gap-3 px-4 py-3 hover:bg-bg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-xs tabular-nums text-subtle",
									children: ep.episodeNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-medium",
										children: ep.title
									}), ep.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "line-clamp-1 text-xs text-muted",
										children: ep.description
									}) : null]
								}),
								ep.runtimeMinutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-subtle",
									children: [ep.runtimeMinutes, " min"]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 text-muted" })
							]
						}) }, ep.id))
					})]
				}, s.id))]
			}) : null,
			t.similar.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl tracking-wide",
					children: "Podobne"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
					children: t.similar.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterCard, { title: s }, s.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { TitlePage as component };
