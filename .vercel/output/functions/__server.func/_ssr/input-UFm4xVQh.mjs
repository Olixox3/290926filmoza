import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-UFm4xVQh.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-10 w-full rounded-md border border-border bg-bg-elevated px-3 text-sm text-fg placeholder:text-subtle", "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
//#endregion
export { Input as t };
