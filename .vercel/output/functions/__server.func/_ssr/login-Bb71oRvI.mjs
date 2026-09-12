import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-BcakwfUz.mjs";
import { t as Button } from "./button-CFXrErnw.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as Input } from "./input-UFm4xVQh.mjs";
import { t as Logo } from "./logo-DiMpy1Wu.mjs";
import { t as Label } from "./label-DcsU0wob.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bb71oRvI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GOOGLE = GROK_PROVIDERS.find((p) => p.idp === "google");
function GoogleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 10.2v3.7h5.2c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M5.3 14.3 4.4 15l-2.6 2C3.4 20.5 7.4 23 12 23c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.8-6-4.3z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4A90E2",
				d: "M2 7c-.6 1.2-1 2.6-1 4s.4 2.8 1 4c0 0 3.3-2.6 3.3-2.6C4.9 11.8 4.8 11.4 4.8 11S4.9 10.2 5.3 9.7z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M12 4.8c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 1.8 14.6 1 12 1 7.4 1 3.4 3.5 1.8 7l3.5 2.7C6.9 6.6 9.2 4.8 12 4.8z"
			})
		]
	});
}
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [googleBusy, setGoogleBusy] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg text-sm text-muted",
		children: "Ładowanie…"
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onEmail(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0]
				});
				if (res.error) throw new Error(res.error.message ?? "Nie udało się założyć konta");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message ?? "Nie udało się zalogować");
			}
			await authClient.getSession();
			navigate({ to: "/" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Coś poszło nie tak");
		} finally {
			setBusy(false);
		}
	}
	async function onGoogle() {
		if (!GOOGLE) return;
		setError(null);
		setGoogleBusy(true);
		try {
			await signIn(GOOGLE.providerId, {
				callbackURL: "/",
				errorCallbackURL: "/login"
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Logowanie Google nie powiodło się");
			setGoogleBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative grid min-h-dvh place-items-center overflow-hidden bg-bg px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent)/18%,transparent_55%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xs text-sm text-muted",
						children: "Katalog filmów i seriali. Zaloguj się przez Google albo e-mail."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-bg-elevated p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "h-11 w-full gap-3 text-sm font-medium",
							disabled: googleBusy || busy,
							onClick: () => void onGoogle(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {}), googleBusy ? "Otwieranie Google…" : "Kontynuuj z Google"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-5 flex items-center gap-3 text-[11px] tracking-wide text-subtle uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
								"albo e-mail",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 grid grid-cols-2 rounded-md bg-bg-muted p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `rounded-sm py-2 text-sm font-medium ${mode === "in" ? "bg-bg-elevated text-fg" : "text-muted"}`,
								onClick: () => setMode("in"),
								children: "Logowanie"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `rounded-sm py-2 text-sm font-medium ${mode === "up" ? "bg-bg-elevated text-fg" : "text-muted"}`,
								onClick: () => setMode("up"),
								children: "Rejestracja"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (ev) => void onEmail(ev),
							className: "space-y-3",
							children: [
								mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Imię"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										autoComplete: "name",
										placeholder: "Jak mamy Cię wyświetlać"
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "E-mail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										autoComplete: "email",
										placeholder: "ty@email.com"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Hasło"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										required: true,
										minLength: 8,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										autoComplete: mode === "up" ? "new-password" : "current-password",
										placeholder: "Minimum 8 znaków"
									})]
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-accent",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full",
									variant: "cinema",
									disabled: busy || googleBusy,
									children: busy ? "Chwila…" : mode === "up" ? "Załóż konto" : "Zaloguj się"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-center text-xs leading-relaxed text-subtle",
							children: "Pierwsze konto w serwisie zostaje administratorem. Google potwierdza e-mail automatycznie; przy rejestracji e-mailem konto zapisywane jest od razu."
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-fg",
						children: "Wróć na stronę główną"
					})
				})
			]
		})]
	});
}
//#endregion
export { Login as component };
