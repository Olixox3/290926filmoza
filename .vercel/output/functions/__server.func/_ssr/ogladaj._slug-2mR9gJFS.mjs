import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { i as getWatchPayload } from "./catalog-D8NM-GvQ.mjs";
import { i as getProgress, l as saveProgress } from "./account-C_BH8a4Y.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { t as Logo } from "./logo-DiMpy1Wu.mjs";
import { b as ChevronLeft, c as SkipForward, d as Play, f as Pause, h as Maximize, l as SkipBack, n as VolumeX, p as Minimize, r as Volume2 } from "../_libs/lucide-react.mjs";
import { a as Route$4 } from "./router-CUEcgZPL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ogladaj._slug-2mR9gJFS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatTime(s) {
	if (!Number.isFinite(s) || s < 0) return "0:00";
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = Math.floor(s % 60);
	const mm = h ? String(m).padStart(2, "0") : String(m);
	const ss = String(sec).padStart(2, "0");
	return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
function VideoPlayer({ src, kind, poster, title, startAt = 0, onProgress }) {
	const videoRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [volume, setVolume] = (0, import_react.useState)(1);
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [fs, setFs] = (0, import_react.useState)(false);
	const [show, setShow] = (0, import_react.useState)(true);
	const [mediaError, setMediaError] = (0, import_react.useState)(false);
	const hideTimer = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el) return;
		let hls = null;
		const isHls = kind === "hls" || src.includes(".m3u8");
		(async () => {
			if (isHls && !el.canPlayType("application/vnd.apple.mpegurl")) {
				const mod = await import("../_libs/hls.js.mjs").then((n) => n.t);
				if (mod.default.isSupported()) {
					const instance = new mod.default();
					instance.loadSource(src);
					instance.attachMedia(el);
					hls = instance;
					return;
				}
			}
			el.src = src;
		})();
		return () => {
			hls?.destroy();
		};
	}, [src, kind]);
	(0, import_react.useEffect)(() => {
		setMediaError(false);
	}, [src]);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el || !startAt) return;
		const onLoaded = () => {
			if (startAt > 0 && startAt < (el.duration || Infinity)) el.currentTime = startAt;
		};
		el.addEventListener("loadedmetadata", onLoaded);
		return () => el.removeEventListener("loadedmetadata", onLoaded);
	}, [src, startAt]);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el || !onProgress) return;
		const id = window.setInterval(() => {
			if (!el.paused && el.duration) onProgress(el.currentTime, el.duration);
		}, 5e3);
		return () => window.clearInterval(id);
	}, [onProgress, src]);
	(0, import_react.useEffect)(() => {
		const onFs = () => setFs(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onFs);
		return () => document.removeEventListener("fullscreenchange", onFs);
	}, []);
	function poke() {
		setShow(true);
		if (hideTimer.current) window.clearTimeout(hideTimer.current);
		hideTimer.current = window.setTimeout(() => {
			if (videoRef.current && !videoRef.current.paused) setShow(false);
		}, 2400);
	}
	function togglePlay() {
		const el = videoRef.current;
		if (!el) return;
		if (el.paused) el.play();
		else el.pause();
	}
	function seek(delta) {
		const el = videoRef.current;
		if (!el) return;
		el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
	}
	if (kind === "embed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "aspect-video overflow-hidden rounded-lg bg-black",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			src,
			title: title ?? "Odtwarzacz",
			className: "size-full border-0",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
			allowFullScreen: true,
			referrerPolicy: "no-referrer"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative aspect-video overflow-hidden rounded-lg bg-black",
		onMouseMove: poke,
		onMouseLeave: () => playing && setShow(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				poster: poster ?? void 0,
				className: "size-full object-contain",
				playsInline: true,
				onClick: togglePlay,
				onPlay: () => setPlaying(true),
				onPause: () => {
					setPlaying(false);
					setShow(true);
				},
				onTimeUpdate: (e) => setTime(e.currentTarget.currentTime),
				onDurationChange: (e) => setDuration(e.currentTarget.duration),
				onError: () => setMediaError(true),
				onVolumeChange: (e) => {
					setMuted(e.currentTarget.muted);
					setVolume(e.currentTarget.volume);
				}
			}),
			mediaError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-sm text-sm text-fg/80",
					children: "Nie udało się odtworzyć tego pliku. W panelu admina wklej inny URL (MP4 albo HLS)."
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-200", show ? "opacity-100" : "pointer-events-none opacity-0"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: duration || 0,
						step: .1,
						value: time,
						onChange: (e) => {
							const el = videoRef.current;
							if (el) el.currentTime = Number(e.target.value);
						},
						className: "h-1 w-full cursor-pointer accent-accent",
						"aria-label": "Postęp"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: playing ? "Pauza" : "Odtwórz",
								onClick: togglePlay,
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 fill-current" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Cofnij 10 s",
								onClick: () => seek(-10),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Do przodu 10 s",
								onClick: () => seek(10),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: muted ? "Włącz dźwięk" : "Wycisz",
								onClick: () => {
									const el = videoRef.current;
									if (el) el.muted = !el.muted;
								},
								children: muted || volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .05,
								value: muted ? 0 : volume,
								onChange: (e) => {
									const el = videoRef.current;
									if (!el) return;
									el.volume = Number(e.target.value);
									el.muted = el.volume === 0;
								},
								className: "hidden h-1 w-20 cursor-pointer accent-fg sm:block",
								"aria-label": "Głośność"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-xs tabular-nums text-fg/80",
								children: [
									formatTime(time),
									" / ",
									formatTime(duration)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: fs ? "Zamknij pełny ekran" : "Pełny ekran",
								onClick: () => {
									const box = wrapRef.current;
									if (!box) return;
									if (document.fullscreenElement) document.exitFullscreen();
									else box.requestFullscreen();
								},
								children: fs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-4" })
							})
						]
					})]
				})
			})
		]
	});
}
function IconBtn({ children, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "grid size-10 place-items-center rounded-md text-fg hover:bg-fg/10",
		children
	});
}
function WatchPage() {
	const { slug } = Route$4.useParams();
	const { e } = Route$4.useSearch();
	const { user, isPending } = useCurrentUserState();
	const payload = useQuery({
		queryKey: [
			"watch",
			slug,
			e ?? null
		],
		queryFn: () => getWatchPayload({ data: {
			slug,
			episodeId: e ?? null
		} })
	});
	const titleId = payload.data?.title.id;
	const progress = useQuery({
		queryKey: ["progress", titleId],
		queryFn: () => getProgress({ data: titleId }),
		enabled: Boolean(user) && Boolean(titleId) && !isPending
	});
	const saveMutate = useMutation({ mutationFn: (input) => saveProgress({ data: input }) }).mutate;
	const saveRef = (0, import_react.useRef)(saveMutate);
	saveRef.current = saveMutate;
	const [sourceId, setSourceId] = (0, import_react.useState)(null);
	const sources = payload.data?.sources ?? [];
	const source = (0, import_react.useMemo)(() => sources.find((s) => s.id === sourceId) ?? sources.find((s) => s.isPrimary) ?? sources[0], [sources, sourceId]);
	const onProgress = (0, import_react.useCallback)((position, duration) => {
		if (!user || !payload.data) return;
		saveRef.current({
			titleId: payload.data.title.id,
			episodeId: payload.data.episode?.id ?? null,
			positionSeconds: position,
			durationSeconds: duration
		});
	}, [payload.data, user]);
	const t = payload.data?.title;
	const ep = payload.data?.episode;
	const progressReady = !isPending && (!user || progress.isFetched || progress.isError);
	const startAt = progress.data && progress.data.episodeId === (ep?.id ?? null) ? progress.data.positionSeconds : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-14 items-center gap-3 border-b border-border px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: t ? "/tytul/$slug" : "/",
					params: t ? { slug: t.slug } : {},
					className: "grid size-10 place-items-center rounded-md hover:bg-bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { compact: true }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: t?.title ?? "Odtwarzacz"
					}), ep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-xs text-muted",
						children: [
							"Odc. ",
							ep.episodeNumber,
							" · ",
							ep.title
						]
					}) : null]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-8",
			children: [
				payload.isLoading || !progressReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-video animate-pulse rounded-lg bg-bg-muted" }) : !t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-20 text-center text-sm text-muted",
					children: "Nie znaleziono tytułu."
				}) : !source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-bg-elevated px-6 py-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Brak pliku wideo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Administrator nie dodał jeszcze źródła odtwarzania."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPlayer, {
					src: source.url,
					kind: source.kind,
					poster: t.backdropUrl ?? t.posterUrl,
					title: ep ? `${t.title} — ${ep.title}` : t.title,
					startAt,
					onProgress
				}, `${source.id}-${ep?.id ?? "movie"}`),
				sources.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSourceId(s.id),
						className: cn("rounded-md border px-3 py-2 text-sm", source?.id === s.id ? "border-fg bg-fg text-bg" : "border-border hover:bg-bg-muted"),
						children: s.label
					}, s.id))
				}) : null,
				t && t.kind !== "movie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-wide",
						children: "Odcinki"
					}), t.seasons.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted",
						children: s.name ?? `Sezon ${s.seasonNumber}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1",
						children: s.episodes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/ogladaj/$slug",
							params: { slug: t.slug },
							search: { e: item.id },
							className: cn("rounded-md px-3 py-2.5 text-sm hover:bg-bg-muted", item.id === ep?.id && "bg-bg-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [item.episodeNumber, ". "]
							}), item.title]
						}, item.id))
					})] }, s.id))]
				}) : null
			]
		})]
	});
}
//#endregion
export { WatchPage as component };
