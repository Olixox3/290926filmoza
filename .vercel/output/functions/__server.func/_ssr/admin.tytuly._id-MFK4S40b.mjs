import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { o as listGenres } from "./catalog-D8NM-GvQ.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { t as Button } from "./button-CFXrErnw.mjs";
import { t as Input } from "./input-UFm4xVQh.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route$1 } from "./router-CUEcgZPL.mjs";
import { t as slugify } from "./slug-C9BI4EYb.mjs";
import { h as upsertTitle, i as deleteEpisode, n as addSeason, o as deleteSeason, r as addSource, s as deleteSource, t as addEpisode, u as getAdminTitle } from "./admin-CT_14uZJ.mjs";
import { t as Label } from "./label-DcsU0wob.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tytuly._id-MFK4S40b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle", "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70", className),
		...props
	});
}
var emptySources = [{
	label: "Odtwarzacz",
	url: "",
	kind: "mp4",
	language: "pl",
	isPrimary: true
}];
function Page() {
	const { id } = Route$1.useParams();
	const isNew = id === "new";
	const numericId = isNew ? null : Number(id);
	const navigate = useNavigate();
	const qc = useQueryClient();
	const genres = useQuery({
		queryKey: ["genres"],
		queryFn: () => listGenres()
	});
	const existing = useQuery({
		queryKey: ["admin-title", numericId],
		queryFn: () => getAdminTitle({ data: numericId }),
		enabled: numericId != null && Number.isFinite(numericId)
	});
	const [kind, setKind] = (0, import_react.useState)("movie");
	const [title, setTitle] = (0, import_react.useState)("");
	const [originalTitle, setOriginalTitle] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [posterUrl, setPosterUrl] = (0, import_react.useState)("");
	const [backdropUrl, setBackdropUrl] = (0, import_react.useState)("");
	const [quality, setQuality] = (0, import_react.useState)("HD");
	const [ageRating, setAgeRating] = (0, import_react.useState)("");
	const [runtimeMinutes, setRuntimeMinutes] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [director, setDirector] = (0, import_react.useState)("");
	const [castText, setCastText] = (0, import_react.useState)("");
	const [isFeatured, setIsFeatured] = (0, import_react.useState)(false);
	const [isPublished, setIsPublished] = (0, import_react.useState)(true);
	const [genreIds, setGenreIds] = (0, import_react.useState)([]);
	const [sources, setSources] = (0, import_react.useState)(emptySources);
	const [hydrated, setHydrated] = (0, import_react.useState)(isNew);
	(0, import_react.useEffect)(() => {
		const t = existing.data;
		if (!t || isNew) return;
		setKind(t.kind);
		setTitle(t.title);
		setOriginalTitle(t.originalTitle ?? "");
		setSlug(t.slug);
		setYear(t.year ? String(t.year) : "");
		setDescription(t.description ?? "");
		setPosterUrl(t.posterUrl ?? "");
		setBackdropUrl(t.backdropUrl ?? "");
		setQuality(t.quality ?? "HD");
		setAgeRating(t.ageRating ?? "");
		setRuntimeMinutes(t.runtimeMinutes ? String(t.runtimeMinutes) : "");
		setCountry(t.country ?? "");
		setDirector(t.director ?? "");
		setCastText(t.castText ?? "");
		setIsFeatured(t.isFeatured);
		setIsPublished(t.isPublished);
		setGenreIds(t.genres.map((g) => g.id));
		setSources(t.sources.length ? t.sources.map((s) => ({
			label: s.label,
			url: s.url,
			kind: s.kind,
			language: s.language,
			isPrimary: s.isPrimary
		})) : emptySources);
		setHydrated(true);
	}, [existing.data, isNew]);
	const save = useMutation({
		mutationFn: () => upsertTitle({ data: {
			id: numericId ?? void 0,
			kind,
			title,
			originalTitle: originalTitle || null,
			slug: slug || slugify(title),
			year: year ? Number(year) : null,
			description: description || null,
			posterUrl: posterUrl || null,
			backdropUrl: backdropUrl || null,
			quality: quality || null,
			ageRating: ageRating || null,
			runtimeMinutes: runtimeMinutes ? Number(runtimeMinutes) : null,
			country: country || null,
			director: director || null,
			castText: castText || null,
			isFeatured,
			isPublished,
			genreIds,
			sources: kind === "movie" ? sources : []
		} }),
		onSuccess: (res) => {
			toast.success("Zapisano");
			qc.invalidateQueries({ queryKey: ["admin-titles"] });
			qc.invalidateQueries({ queryKey: ["catalog"] });
			qc.invalidateQueries({ queryKey: ["admin-title", res.id] });
			qc.invalidateQueries({ queryKey: ["admin-stats"] });
			if (isNew) navigate({
				to: "/admin/tytuly/$id",
				params: { id: String(res.id) }
			});
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Nie udało się zapisać")
	});
	if (!isNew && (existing.isLoading || !hydrated)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Wczytuję…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mx-auto max-w-3xl space-y-6",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-wide",
					children: isNew ? "Nowy tytuł" : title || "Edycja"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/tytuly",
					className: "text-sm text-muted hover:text-fg",
					children: "← Lista"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "grid gap-4 rounded-xl border border-border bg-bg-elevated p-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Typ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border border-border bg-bg px-3 text-sm",
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "movie",
									children: "Film"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "series",
									children: "Serial"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "show",
									children: "Program"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tytuł",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: title,
							onChange: (e) => {
								setTitle(e.target.value);
								if (isNew) setSlug(slugify(e.target.value));
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tytuł oryginalny",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: originalTitle,
							onChange: (e) => setOriginalTitle(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Slug",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: slug,
							onChange: (e) => setSlug(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Rok",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: year,
							onChange: (e) => setYear(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Jakość",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: quality,
							onChange: (e) => setQuality(e.target.value),
							placeholder: "HD / FHD / 4K"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Od lat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: ageRating,
							onChange: (e) => setAgeRating(e.target.value),
							placeholder: "7 / 12 / 16 / 18"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Czas (min)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: runtimeMinutes,
							onChange: (e) => setRuntimeMinutes(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kraj",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: country,
							onChange: (e) => setCountry(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reżyseria",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: director,
							onChange: (e) => setDirector(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Obsada",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: castText,
								onChange: (e) => setCastText(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Opis",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 5
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "URL plakatu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: posterUrl,
							onChange: (e) => setPosterUrl(e.target.value),
							placeholder: "/posters/… lub https://"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "URL tła",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: backdropUrl,
							onChange: (e) => setBackdropUrl(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isFeatured,
							onChange: (e) => setIsFeatured(e.target.checked)
						}), "Wyróżniony (hero)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isPublished,
							onChange: (e) => setIsPublished(e.target.checked)
						}), "Opublikowany"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "rounded-xl border border-border bg-bg-elevated p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "px-1 text-sm font-medium",
					children: "Gatunki"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: (genres.data ?? []).map((g) => {
						const on = genreIds.includes(g.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setGenreIds((ids) => on ? ids.filter((x) => x !== g.id) : [...ids, g.id]),
							className: `rounded-full border px-3 py-1.5 text-sm ${on ? "border-fg bg-fg text-bg" : "border-border text-muted"}`,
							children: g.name
						}, g.id);
					})
				})]
			}),
			kind === "movie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "space-y-3 rounded-xl border border-border bg-bg-elevated p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "px-1 text-sm font-medium",
						children: "Źródła wideo (MP4 / HLS)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Wklej bezpośredni link do pliku. Internet Archive, Cloudflare R2, Bunny — cokolwiek pod HTTPS."
					}),
					sources.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 rounded-md border border-border p-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Etykieta (Odtwarzacz 1)",
								value: s.label,
								onChange: (e) => setSources((all) => all.map((x, idx) => idx === i ? {
									...x,
									label: e.target.value
								} : x))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "https://…/film.mp4",
								value: s.url,
								onChange: (e) => setSources((all) => all.map((x, idx) => idx === i ? {
									...x,
									url: e.target.value
								} : x))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-10 rounded-md border border-border bg-bg px-3 text-sm",
								value: s.kind,
								onChange: (e) => setSources((all) => all.map((x, idx) => idx === i ? {
									...x,
									kind: e.target.value
								} : x)),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mp4",
										children: "MP4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hls",
										children: "HLS (.m3u8)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "embed",
										children: "Osadzony player"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "język",
								value: s.language,
								onChange: (e) => setSources((all) => all.map((x, idx) => idx === i ? {
									...x,
									language: e.target.value
								} : x))
							})
						]
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => setSources((all) => [...all, {
							label: `Odtwarzacz ${all.length + 1}`,
							url: "",
							kind: "mp4",
							language: "pl",
							isPrimary: false
						}]),
						children: "Dodaj źródło"
					})
				]
			}) : numericId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpisodesEditor, {
				titleId: numericId,
				seasons: existing.data?.seasons ?? []
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Zapisz serial, a potem dodasz sezony i odcinki."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				variant: "cinema",
				disabled: save.isPending,
				children: save.isPending ? "Zapis…" : "Zapisz"
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function EpisodesEditor({ titleId, seasons }) {
	const qc = useQueryClient();
	const invalidate = () => void qc.invalidateQueries({ queryKey: ["admin-title", titleId] });
	const [seasonNo, setSeasonNo] = (0, import_react.useState)(String((seasons.at(-1)?.seasonNumber ?? 0) + 1));
	const [seasonName, setSeasonName] = (0, import_react.useState)("");
	const [epTitle, setEpTitle] = (0, import_react.useState)("");
	const [epNo, setEpNo] = (0, import_react.useState)("1");
	const [epSeason, setEpSeason] = (0, import_react.useState)(seasons[0]?.id ?? "");
	const [srcUrl, setSrcUrl] = (0, import_react.useState)("");
	const [srcEp, setSrcEp] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "space-y-4 rounded-xl border border-border bg-bg-elevated p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
				className: "px-1 text-sm font-medium",
				children: "Sezony i odcinki"
			}),
			seasons.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: s.name ?? `Sezon ${s.seasonNumber}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-accent",
						onClick: () => {
							if (confirm("Usunąć sezon?")) deleteSeason({ data: s.id }).then(invalidate);
						},
						children: "Usuń sezon"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: s.episodes.map((ep) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-sm bg-bg px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								ep.episodeNumber,
								". ",
								ep.title
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-accent",
								onClick: () => {
									if (confirm("Usunąć odcinek?")) deleteEpisode({ data: ep.id }).then(invalidate);
								},
								children: "Usuń"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-1 text-xs text-muted",
							children: ep.sources.map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate",
									children: [
										src.label,
										": ",
										src.url
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void deleteSource({ data: src.id }).then(invalidate),
									children: "×"
								})]
							}, src.id))
						})]
					}, ep.id))
				})]
			}, s.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: seasonNo,
						onChange: (e) => setSeasonNo(e.target.value),
						placeholder: "Nr sezonu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: seasonName,
						onChange: (e) => setSeasonName(e.target.value),
						placeholder: "Nazwa (Sezon 1)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => void addSeason({ data: {
							titleId,
							seasonNumber: Number(seasonNo),
							name: seasonName || void 0
						} }).then(() => {
							invalidate();
							toast.success("Dodano sezon");
						}),
						children: "Dodaj sezon"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md border border-border bg-bg px-3 text-sm",
						value: epSeason,
						onChange: (e) => setEpSeason(e.target.value ? Number(e.target.value) : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Sezon"
						}), seasons.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name ?? `Sezon ${s.seasonNumber}`
						}, s.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: epNo,
						onChange: (e) => setEpNo(e.target.value),
						placeholder: "Nr"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: epTitle,
						onChange: (e) => setEpTitle(e.target.value),
						placeholder: "Tytuł odcinka"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							if (!epSeason || !epTitle) return;
							addEpisode({ data: {
								seasonId: Number(epSeason),
								episodeNumber: Number(epNo),
								title: epTitle
							} }).then(() => {
								invalidate();
								setEpTitle("");
								toast.success("Dodano odcinek");
							});
						},
						children: "Dodaj odcinek"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 md:grid-cols-[1fr_2fr_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-10 rounded-md border border-border bg-bg px-3 text-sm",
						value: srcEp,
						onChange: (e) => setSrcEp(e.target.value ? Number(e.target.value) : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Odcinek"
						}), seasons.flatMap((s) => s.episodes.map((ep) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: ep.id,
							children: [
								"S",
								s.seasonNumber,
								"E",
								ep.episodeNumber,
								" ",
								ep.title
							]
						}, ep.id)))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: srcUrl,
						onChange: (e) => setSrcUrl(e.target.value),
						placeholder: "https://…/odcinek.mp4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							if (!srcEp || !srcUrl) return;
							addSource({ data: {
								episodeId: Number(srcEp),
								label: "Odtwarzacz",
								url: srcUrl,
								kind: srcUrl.includes(".m3u8") ? "hls" : "mp4",
								language: "pl",
								isPrimary: true
							} }).then(() => {
								invalidate();
								setSrcUrl("");
								toast.success("Dodano źródło");
							});
						},
						children: "Dodaj plik"
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
