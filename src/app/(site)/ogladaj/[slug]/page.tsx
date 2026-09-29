import { notFound } from "next/navigation";
import { WatchClient } from "./watch-client";
import { getMediaBySlug, inferKind } from "@/lib/catalog";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { slug } = await params;
  const { e } = await searchParams;
  const data = await getMediaBySlug(slug);
  if (!data) notFound();
  const episode = e ? data.episodes.find((ep) => String(ep.id) === e) : data.episodes[0];
  const src = episode?.video_url || data.media.video_url;
  if (!src) {
    return (
      <div className="rounded-xl border border-border bg-bg-elevated p-8 text-center">
        <h1 className="font-display text-4xl">{data.card.title}</h1>
        <p className="mt-2 text-sm text-muted">Brak źródła wideo dla tego tytułu.</p>
      </div>
    );
  }
  return (
    <WatchClient
      title={episode ? `${data.card.title} · ${episode.title}` : data.card.title}
      src={src}
      kind={inferKind(src)}
      poster={episode?.thumbnail_url ?? data.card.backdropUrl ?? data.card.posterUrl}
      mediaId={data.media.id}
      episodeId={episode?.id ?? null}
    />
  );
}
