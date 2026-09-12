import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { o as listGenres } from "./catalog-D8NM-GvQ.mjs";
import { t as Button } from "./button-CFXrErnw.mjs";
import { t as Input } from "./input-UFm4xVQh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as deleteGenre, m as upsertGenre } from "./admin-CT_14uZJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.gatunki-BzX3RDXu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["genres"],
		queryFn: () => listGenres()
	});
	const [name, setName] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: (input) => upsertGenre({ data: input }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["genres"] });
			qc.invalidateQueries({ queryKey: ["catalog"] });
			setName("");
			toast.success("Zapisano gatunek");
		}
	});
	const del = useMutation({
		mutationFn: (id) => deleteGenre({ data: id }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["genres"] });
			qc.invalidateQueries({ queryKey: ["catalog"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-wide",
				children: "Gatunki"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					if (!name.trim()) return;
					save.mutate({
						name: name.trim(),
						sortOrder: (list.data?.length ?? 0) + 1
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Nowy gatunek"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "cinema",
					children: "Dodaj"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border overflow-hidden rounded-xl border border-border",
				children: (list.data ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenreRow, {
					name: g.name,
					sortOrder: g.sortOrder,
					onSave: (next, order) => save.mutate({
						id: g.id,
						name: next,
						sortOrder: order
					}),
					onDelete: () => del.mutate(g.id)
				}, g.id))
			})
		]
	});
}
function GenreRow({ name, sortOrder, onSave, onDelete }) {
	const [value, setValue] = (0, import_react.useState)(name);
	const [order, setOrder] = (0, import_react.useState)(String(sortOrder));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-wrap items-center gap-2 px-3 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => setValue(e.target.value),
				className: "min-w-40 flex-1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: order,
				onChange: (e) => setOrder(e.target.value),
				className: "w-20",
				"aria-label": "Kolejność"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: () => onSave(value, Number(order) || 0),
				children: "Zapisz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-xs text-accent",
				onClick: onDelete,
				children: "Usuń"
			})
		]
	});
}
//#endregion
export { Page as component };
