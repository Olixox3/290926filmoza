import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { i as signOut } from "./_ssr/client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./_ssr/server-BcakwfUz.mjs";
import { n as getMyProfile, o as listContinueWatching, s as listFavorites } from "./_ssr/account-C_BH8a4Y.mjs";
import { t as Button } from "./_ssr/button-CFXrErnw.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./_ssr/gates-CuljDMS8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.konto-CRccNkbY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user) && !isPending
	});
	const fav = useQuery({
		queryKey: ["favorites"],
		queryFn: () => listFavorites(),
		enabled: Boolean(user) && !isPending
	});
	const cont = useQuery({
		queryKey: ["continue"],
		queryFn: () => listContinueWatching(),
		enabled: Boolean(user) && !isPending
	});
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(() => () => {}, hasGateSessionMarker, () => false);
	if (isPending) return null;
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-wide",
				children: "Konto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-bg-elevated p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-medium",
						children: user.displayName ?? "Użytkownik"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: user.primaryEmail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs uppercase tracking-wide text-subtle",
						children: profile.data?.role === "admin" ? "Administrator" : "Użytkownik"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					"Na liście: ",
					fav.data?.length ?? 0,
					" tytułów"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["W trakcie: ", cont.data?.length ?? 0] })]
			}),
			profile.data?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "cinema",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: "Panel administratora"
				})
			}) : null,
			!gateSession ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut("/").catch(() => setSigningOut(false));
				},
				children: signingOut ? "Wychodzenie…" : "Wyloguj"
			}) : null
		]
	});
}
//#endregion
export { Page as component };
