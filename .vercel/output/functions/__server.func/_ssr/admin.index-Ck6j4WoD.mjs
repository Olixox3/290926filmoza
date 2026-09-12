import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CFXrErnw.mjs";
import { l as getAdminStats } from "./admin-CT_14uZJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-Ck6j4WoD.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const s = useQuery({
		queryKey: ["admin-stats"],
		queryFn: () => getAdminStats()
	}).data;
	const cards = [
		{
			label: "Tytuły",
			value: s?.titles ?? "—"
		},
		{
			label: "Filmy",
			value: s?.movies ?? "—"
		},
		{
			label: "Seriale",
			value: s?.series ?? "—"
		},
		{
			label: "Programy",
			value: s?.shows ?? "—"
		},
		{
			label: "Gatunki",
			value: s?.genres ?? "—"
		},
		{
			label: "Konta",
			value: s?.users ?? "—"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-subtle uppercase",
					children: "Admin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-wide",
					children: "Pulpit"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "cinema",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/tytuly/$id",
						params: { id: "new" },
						children: "Dodaj tytuł"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-bg-elevated p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: c.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-4xl tracking-wide tabular-nums",
						children: c.value
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-bg-elevated p-5 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-fg",
						children: "Gdzie trzymać pliki filmów"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: [
							"Filmoza zapisuje w bazie (Neon Postgres) tylko metadane — tytuł, opis, gatunki i",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "URL do pliku"
							}),
							". Same filmy wrzucasz na darmowy hosting i wklejasz link w panelu:"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 list-disc space-y-1 pl-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Internet Archive — darmowe, publiczne MP4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Cloudflare R2 — 10 GB za darmo, własne pliki" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bunny.net / własne HTTPS — MP4 albo HLS (.m3u8)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3",
						children: "Dodawaj wyłącznie materiały, do których masz prawa (domena publiczna, CC, własna produkcja)."
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
