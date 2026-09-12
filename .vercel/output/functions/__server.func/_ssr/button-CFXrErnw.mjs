import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CFXrErnw.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,transform,opacity] duration-150 ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			cinema: "bg-fg text-bg hover:bg-fg/90",
			secondary: "bg-bg-muted text-fg hover:bg-bg-muted/80",
			outline: "border border-border bg-transparent hover:bg-bg-muted",
			ghost: "hover:bg-bg-muted text-fg",
			link: "text-fg underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 rounded-md px-4",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-lg px-6 text-base",
			icon: "size-10 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
