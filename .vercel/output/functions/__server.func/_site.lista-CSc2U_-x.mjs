import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { s as listFavorites } from "./_ssr/account-C_BH8a4Y.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { t as RedirectToSignIn } from "./_ssr/gates-CuljDMS8.mjs";
import { t as Skeleton } from "./_ssr/skeleton-CabwNnmC.mjs";
import { r as PosterGrid } from "./_ssr/poster-card-BbIY_WSM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.lista-CSc2U_-x.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { user, isPending } = useCurrentUserState();
	const list = useQuery({
		queryKey: ["favorites"],
		queryFn: () => listFavorites(),
		enabled: Boolean(user) && !isPending
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-wide",
			children: "Moja lista"
		}), list.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterGrid, { titles: list.data ?? [] })]
	});
}
//#endregion
export { Page as component };
