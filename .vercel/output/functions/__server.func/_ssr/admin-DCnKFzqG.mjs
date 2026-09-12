import { m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as getMyProfile } from "./account-C_BH8a4Y.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./gates-CuljDMS8.mjs";
import { t as Skeleton } from "./skeleton-CabwNnmC.mjs";
import { t as Logo } from "./logo-DiMpy1Wu.mjs";
import { g as LayoutDashboard, i as Users, o as Tags, y as Clapperboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DCnKFzqG.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/admin",
		label: "Pulpit",
		icon: LayoutDashboard
	},
	{
		to: "/admin/tytuly",
		label: "Tytuły",
		icon: Clapperboard
	},
	{
		to: "/admin/gatunki",
		label: "Gatunki",
		icon: Tags
	},
	{
		to: "/admin/uzytkownicy",
		label: "Użytkownicy",
		icon: Users
	}
];
function AdminLayout() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user) && !isPending
	});
	if (isPending || user && profile.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 w-full" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.data?.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Brak dostępu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "To konto nie ma uprawnień administratora."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 inline-block text-sm hover:underline",
				children: "Wróć na Filmozę"
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg md:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "border-b border-border md:w-56 md:border-r md:border-b-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 items-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3",
				children: [LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: l.to,
					activeOptions: { exact: l.to === "/admin" },
					className: "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted hover:bg-bg-muted hover:text-fg",
					activeProps: { className: "bg-bg-muted text-fg" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "size-4" }), l.label]
				}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-2 px-3 py-2 text-xs text-subtle hover:text-fg",
					children: "← Katalog"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-w-0 flex-1 p-4 md:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };
