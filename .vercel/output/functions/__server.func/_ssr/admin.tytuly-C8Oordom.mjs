import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CFXrErnw.mjs";
import { t as Input } from "./input-UFm4xVQh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as KIND_LABEL } from "./types-PJ_bBQ70.mjs";
import { c as deleteTitle, d as listAdminTitles } from "./admin-CT_14uZJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tytuly-C8Oordom.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: ["admin-titles"],
		queryFn: () => listAdminTitles()
	});
	const del = useMutation({
		mutationFn: (id) => deleteTitle({ data: id }),
		onSuccess: () => {
			toast.success("Usunięto tytuł");
			qc.invalidateQueries({ queryKey: ["admin-titles"] });
			qc.invalidateQueries({ queryKey: ["catalog"] });
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		const all = list.data ?? [];
		const s = q.trim().toLowerCase();
		if (!s) return all;
		return all.filter((t) => t.title.toLowerCase().includes(s) || t.slug.includes(s));
	}, [list.data, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-wide",
					children: "Tytuły"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "cinema",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/tytuly/$id",
						params: { id: "new" },
						children: "Dodaj"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Filtruj po tytule"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-bg-muted text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Tytuł"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Typ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Rok"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 font-medium" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/tytuly/$id",
									params: { id: String(t.id) },
									className: "font-medium hover:underline",
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: t.slug
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: KIND_LABEL[t.kind]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums text-muted",
								children: t.year ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-muted",
								children: [t.isPublished ? "Opublikowany" : "Szkic", t.isFeatured ? " · wyróżniony" : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-accent hover:underline",
									onClick: () => {
										if (confirm(`Usunąć „${t.title}”?`)) del.mutate(t.id);
									},
									children: "Usuń"
								})
							})
						]
					}, t.id)) })]
				})
			})
		]
	});
}
//#endregion
export { Page as component };
