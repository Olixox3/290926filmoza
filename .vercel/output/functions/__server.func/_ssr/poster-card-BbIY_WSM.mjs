import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { d as Play } from "../_libs/lucide-react.mjs";
import { t as KIND_LABEL } from "./types-PJ_bBQ70.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/poster-card-BbIY_WSM.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", tone === "accent" && "bg-accent text-accent-fg", tone === "fg" && "bg-fg text-bg", tone === "muted" && "bg-bg-muted text-muted", className),
		...props
	});
}
function hashHue(input) {
	let h = 0;
	for (let i = 0; i < input.length; i++) h = h * 33 + input.charCodeAt(i) >>> 0;
	return h % 360;
}
function FallbackPoster({ title, year, kind }) {
	const hue = hashHue(title);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex flex-col justify-end p-3",
		style: { background: `linear-gradient(165deg, hsl(${hue} 14% 22%), hsl(${(hue + 40) % 360} 28% 8%))` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-2xl leading-none tracking-wide text-fg/95",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-1 text-[11px] text-fg/70",
			children: [
				year ?? "—",
				" · ",
				KIND_LABEL[kind]
			]
		})]
	});
}
function PosterCard({ title, className, progress }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/tytul/$slug",
		params: { slug: title.slug },
		className: cn("group relative block overflow-hidden rounded-md bg-card outline-none ring-offset-bg focus-visible:ring-2 focus-visible:ring-accent", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[2/3] overflow-hidden",
			children: [
				title.posterUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: title.posterUrl,
					alt: "",
					className: "size-full object-cover transition-transform duration-300 ease-[var(--ease-smooth-out)] group-hover:scale-[1.04]"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackPoster, {
					title: title.title,
					year: title.year,
					kind: title.kind
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-bg/90 via-bg/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 translate-y-1 p-2.5 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-1.5 grid size-8 place-items-center rounded-full bg-fg text-bg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 fill-current" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-2 font-medium text-sm leading-tight",
							children: title.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[11px] text-muted",
							children: [title.year ?? "—", title.runtimeMinutes ? ` · ${title.runtimeMinutes} min` : ""]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-2 left-2 flex gap-1",
					children: title.quality ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "fg",
						children: title.quality
					}) : null
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-2 right-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: KIND_LABEL[title.kind] })
				}),
				progress != null && progress > 0 && progress < .95 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 h-0.5 bg-fg/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent",
						style: { width: `${Math.round(progress * 100)}%` }
					})
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-1 pt-2 pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "line-clamp-1 text-sm font-medium",
				children: title.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: title.year ?? KIND_LABEL[title.kind]
			})]
		})]
	});
}
function PosterRow({ heading, titles, href }) {
	if (!titles.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-wide text-fg md:text-3xl",
				children: heading
			}), href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href,
				className: "text-xs font-medium text-muted hover:text-fg",
				children: "Zobacz wszystkie"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8",
			children: titles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterCard, {
				title: t,
				className: "w-32 shrink-0 sm:w-36 md:w-40"
			}, t.id))
		})]
	});
}
function PosterGrid({ titles }) {
	if (!titles.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted",
		children: "Brak tytułów w tej kategorii."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
		children: titles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterCard, { title: t }, t.id))
	});
}
//#endregion
export { PosterRow as i, PosterCard as n, PosterGrid as r, Badge as t };
