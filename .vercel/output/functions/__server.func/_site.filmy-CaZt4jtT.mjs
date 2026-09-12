import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { l as Route$14 } from "./_ssr/router-CUEcgZPL.mjs";
import { t as BrowsePage } from "./_ssr/browse-BChuchWv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.filmy-CaZt4jtT.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const data = Route$14.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowsePage, {
		kind: "movie",
		titles: data.titles
	});
}
//#endregion
export { Page as component };
