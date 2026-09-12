import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  kind: "mp4" | "hls" | "embed";
  poster?: string | null;
  title?: string;
  startAt?: number;
  onProgress?: (position: number, duration: number) => void;
};

function formatTime(s: number) {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  const ss = String(sec).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function VideoPlayer({ src, kind, poster, title, startAt = 0, onProgress }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fs, setFs] = useState(false);
  const [show, setShow] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    let hls: { destroy: () => void } | null = null;
    const isHls = kind === "hls" || src.includes(".m3u8");
    void (async () => {
      if (isHls && !el.canPlayType("application/vnd.apple.mpegurl")) {
        const mod = await import("hls.js");
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

  useEffect(() => {
    setMediaError(false);
  }, [src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !startAt) return;
    const onLoaded = () => {
      if (startAt > 0 && startAt < (el.duration || Infinity)) el.currentTime = startAt;
    };
    el.addEventListener("loadedmetadata", onLoaded);
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [src, startAt]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !onProgress) return;
    const id = window.setInterval(() => {
      if (!el.paused && el.duration) onProgress(el.currentTime, el.duration);
    }, 5000);
    return () => window.clearInterval(id);
  }, [onProgress, src]);

  useEffect(() => {
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
    if (el.paused) void el.play();
    else el.pause();
  }

  function seek(delta: number) {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
  }

  if (kind === "embed") {
    return (
      <div className="aspect-video overflow-hidden rounded-lg bg-black">
        <iframe
          src={src}
          title={title ?? "Odtwarzacz"}
          className="size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-video overflow-hidden rounded-lg bg-black"
      onMouseMove={poke}
      onMouseLeave={() => playing && setShow(false)}
    >
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        className="size-full object-contain"
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          setShow(true);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setMediaError(true)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
      />
      {mediaError ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-6 text-center">
          <p className="max-w-sm text-sm text-fg/80">
            Nie udało się odtworzyć tego pliku. W panelu admina wklej inny URL (MP4 albo HLS).
          </p>
        </div>
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-200",
          show ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="px-3 pb-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              const el = videoRef.current;
              if (el) el.currentTime = Number(e.target.value);
            }}
            className="h-1 w-full cursor-pointer accent-accent"
            aria-label="Postęp"
          />
          <div className="mt-2 flex items-center gap-1">
            <IconBtn label={playing ? "Pauza" : "Odtwórz"} onClick={togglePlay}>
              {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
            </IconBtn>
            <IconBtn label="Cofnij 10 s" onClick={() => seek(-10)}>
              <SkipBack className="size-4" />
            </IconBtn>
            <IconBtn label="Do przodu 10 s" onClick={() => seek(10)}>
              <SkipForward className="size-4" />
            </IconBtn>
            <IconBtn
              label={muted ? "Włącz dźwięk" : "Wycisz"}
              onClick={() => {
                const el = videoRef.current;
                if (el) el.muted = !el.muted;
              }}
            >
              {muted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </IconBtn>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const el = videoRef.current;
                if (!el) return;
                el.volume = Number(e.target.value);
                el.muted = el.volume === 0;
              }}
              className="hidden h-1 w-20 cursor-pointer accent-fg sm:block"
              aria-label="Głośność"
            />
            <span className="ml-2 text-xs tabular-nums text-fg/80">
              {formatTime(time)} / {formatTime(duration)}
            </span>
            <span className="ml-auto" />
            <IconBtn
              label={fs ? "Zamknij pełny ekran" : "Pełny ekran"}
              onClick={() => {
                const box = wrapRef.current;
                if (!box) return;
                if (document.fullscreenElement) void document.exitFullscreen();
                else void box.requestFullscreen();
              }}
            >
              {fs ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-md text-fg hover:bg-fg/10"
    >
      {children}
    </button>
  );
}
