import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as listAdminUsers, p as setUserRole } from "./admin-CT_14uZJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.uzytkownicy-tR-PWHWW.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => listAdminUsers()
	});
	const setRole = useMutation({
		mutationFn: (input) => setUserRole({ data: input }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("Zmieniono rolę");
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Błąd")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-wide",
				children: "Użytkownicy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Pierwsze konto, które się zaloguje, zostaje administratorem. Tu możesz nadać rolę kolejnym osobom."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[520px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-bg-muted text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "E-mail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Nazwa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Rola"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-[220px] truncate px-3 py-2 text-sm",
								children: u.email ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: u.displayName ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-9 rounded-md border border-border bg-bg-elevated px-2 text-sm",
									value: u.role,
									onChange: (e) => setRole.mutate({
										userId: u.userId,
										role: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "user",
										children: "Użytkownik"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "admin",
										children: "Admin"
									})]
								})
							})
						]
					}, u.userId)) })]
				})
			})
		]
	});
}
//#endregion
export { Page as component };
