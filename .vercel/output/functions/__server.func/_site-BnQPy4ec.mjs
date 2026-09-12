import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, m as Outlet, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { i as signOut } from "./_ssr/client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./_ssr/server-BcakwfUz.mjs";
import { o as listGenres } from "./_ssr/catalog-D8NM-GvQ.mjs";
import { n as getMyProfile } from "./_ssr/account-C_BH8a4Y.mjs";
import { t as cn } from "./_ssr/cn-Ccejyh36.mjs";
import { t as Button } from "./_ssr/button-CFXrErnw.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { n as SignedIn } from "./_ssr/gates-CuljDMS8.mjs";
import { t as Skeleton } from "./_ssr/skeleton-CabwNnmC.mjs";
import { t as Input } from "./_ssr/input-UFm4xVQh.mjs";
import { t as Logo } from "./_ssr/logo-DiMpy1Wu.mjs";
import { m as Menu, t as X, u as Search, v as Heart } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_site-BnQPy4ec.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/filmy",
		label: "Filmy"
	},
	{
		to: "/seriale",
		label: "Seriale"
	},
	{
		to: "/programy",
		label: "Programy"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const genres = useQuery({
		queryKey: ["genres"],
		queryFn: () => listGenres()
	});
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	function onSearch(e) {
		e.preventDefault();
		const query = q.trim();
		if (!query) return;
		setOpen(false);
		navigate({
			to: "/szukaj",
			search: { q: query }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "ml-4 hidden items-center gap-1 md:flex",
					children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg",
						activeProps: { className: "text-fg" },
						children: item.label
					}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "list-none rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden",
							children: "Gatunki"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-full left-0 z-50 mt-1 grid w-64 grid-cols-2 gap-x-2 rounded-lg border border-border bg-bg-elevated p-3 shadow-xl",
							children: (genres.data ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/gatunek/$slug",
								params: { slug: g.slug },
								className: "rounded-sm px-2 py-1.5 text-sm text-muted hover:bg-bg-muted hover:text-fg",
								children: g.name
							}, g.id))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: onSearch,
					className: "ml-auto hidden min-w-0 max-w-xs flex-1 md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Szukaj filmów i seriali",
							className: "h-9 pl-9",
							"aria-label": "Szukaj"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-1 md:ml-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/szukaj",
							search: { q: "" },
							className: "grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg md:hidden",
							"aria-label": "Szukaj",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/lista",
							className: "grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg",
							"aria-label": "Moja lista",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5" })
						}) }),
						isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-8 rounded-full" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountChip, {
							name: user.displayName ?? user.primaryEmail ?? "Konto",
							image: user.profileImageUrl,
							isAdmin: profile.data?.role === "admin"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "cinema",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Zaloguj się"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg md:hidden",
							onClick: () => setOpen((v) => !v),
							"aria-label": open ? "Zamknij menu" : "Otwórz menu",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border bg-bg px-4 py-4 md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: onSearch,
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Szukaj filmów i seriali",
					"aria-label": "Szukaj"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-1",
				children: [
					NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						className: "rounded-md px-3 py-3 text-base font-medium hover:bg-bg-muted",
						children: item.label
					}, item.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 px-3 text-xs font-medium tracking-wide text-subtle uppercase",
						children: "Gatunki"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1",
						children: (genres.data ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/gatunek/$slug",
							params: { slug: g.slug },
							onClick: () => setOpen(false),
							className: "rounded-md px-3 py-2.5 text-sm text-muted hover:bg-bg-muted hover:text-fg",
							children: g.name
						}, g.id))
					})
				]
			})]
		}) : null]
	});
}
function AccountChip({ name, image, isAdmin }) {
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(() => () => {}, hasGateSessionMarker, () => false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: cn("flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden"),
			children: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: "",
				className: "size-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-8 place-items-center rounded-full bg-bg-muted text-xs font-semibold",
				children: name.charAt(0).toUpperCase()
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-bg-elevated py-1 shadow-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate px-3 py-2 text-xs text-muted",
					children: name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/konto",
					className: "block px-3 py-2 text-sm hover:bg-bg-muted",
					children: "Konto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lista",
					className: "block px-3 py-2 text-sm hover:bg-bg-muted",
					children: "Moja lista"
				}),
				isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "block px-3 py-2 text-sm hover:bg-bg-muted",
					children: "Panel admina"
				}) : null,
				!gateSession ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: signingOut,
					onClick: () => {
						setSigningOut(true);
						signOut("/").catch(() => setSigningOut(false));
					},
					className: "block w-full px-3 py-2 text-left text-sm hover:bg-bg-muted disabled:opacity-50",
					children: signingOut ? "Wychodzenie…" : "Wyloguj"
				}) : null
			]
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-sm text-muted",
				children: "Legalny katalog filmów, seriali i programów — domena publiczna i Creative Commons. Filmoza nie hostuje nielegalnych kopii."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "Filmoza · katalog kina otwartego"
			})]
		})
	});
}
function SiteShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
