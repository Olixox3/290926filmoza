"use client";

import { VideoPlayer } from "@/components/player/video-player";
import { saveProgress } from "@/lib/actions";

export function WatchClient({
  title,
  src,
  kind,
  poster,
  mediaId,
  episodeId,
}: {
  title: string;
  src: string;
  kind: "mp4" | "hls" | "embed";
  poster: string | null;
  mediaId: number;
  episodeId: number | null;
}) {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl tracking-wide md:text-4xl">{title}</h1>
      {kind === "embed" ? (
        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe src={src} className="size-full" allow="autoplay; fullscreen" allowFullScreen title={title} />
        </div>
      ) : (
        <VideoPlayer
          src={src}
          kind={kind}
          poster={poster}
          title={title}
          onProgress={(position, duration) => {
            void saveProgress({
              mediaId,
              episodeId,
              positionSeconds: position,
              durationSeconds: duration,
            });
          }}
        />
      )}
    </div>
  );
}
