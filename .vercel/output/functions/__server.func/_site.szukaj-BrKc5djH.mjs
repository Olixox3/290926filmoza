import { b as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { l as searchTitles } from "./_ssr/catalog-D8NM-GvQ.mjs";
import { t as Input } from "./_ssr/input-UFm4xVQh.mjs";
import { u as Search } from "./_libs/lucide-react.mjs";
import { o as Route$9 } from "./_ssr/router-CUEcgZPL.mjs";
import { r as PosterGrid } from "./_ssr/poster-card-BbIY_WSM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.szukaj-BrKc5djH.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { q } = Route$9.useSearch();
	const navigate = useNavigate();
	const results = useQuery({
		queryKey: ["search", q],
		queryFn: () => searchTitles({ data: q }),
		enabled: q.trim().length > 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-wide",
				children: "Szukaj"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					defaultValue: q,
					placeholder: "Tytuł, reżyser, opis…",
					className: "pl-9",
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							const value = e.target.value;
							navigate({
								to: "/szukaj",
								search: { q: value }
							});
						}
					}
				})]
			}),
			q.trim() ? results.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Szukam…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Wyniki dla „",
					q,
					"” · ",
					results.data?.length ?? 0
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterGrid, { titles: results.data ?? [] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Wpisz tytuł filmu, serialu albo nazwisko reżysera."
			})
		]
	});
}
//#endregion
export { Page as component };
