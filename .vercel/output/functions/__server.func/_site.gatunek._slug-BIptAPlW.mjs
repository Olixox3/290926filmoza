import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { i as Route$3 } from "./_ssr/router-CUEcgZPL.mjs";
import { t as BrowsePage } from "./_ssr/browse-BChuchWv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site.gatunek._slug-BIptAPlW.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { slug } = Route$3.useParams();
	const data = Route$3.useLoaderData();
	const titles = data.titles.filter((t) => t.genres.some((g) => g.slug === slug));
	const name = data.genres.find((g) => g.slug === slug)?.name ?? slug;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowsePage, {
		titles,
		heading: name
	});
}
//#endregion
export { Page as component };
