import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-DiMpy1Wu.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2.5 text-fg no-underline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-8 shrink-0 place-items-center rounded-sm bg-accent text-accent-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "size-4",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "3",
						y: "5",
						width: "18",
						height: "14",
						rx: "1.5",
						fill: "currentColor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "6",
						y: "8",
						width: "12",
						height: "8",
						fill: "#08080a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "9",
						cy: "12",
						r: "1.1",
						fill: "currentColor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "15",
						cy: "12",
						r: "1.1",
						fill: "currentColor"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-display leading-none tracking-[0.08em]", compact ? "text-2xl" : "text-[1.85rem]"),
			children: "FILMOZA"
		})]
	});
}
//#endregion
export { Logo as t };
