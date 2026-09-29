import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { auth } from "@/auth";
import { FavoriteButton } from "@/components/catalog/favorite-button";
import { PosterRow } from "@/components/catalog/poster-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaBySlug, listMedia } from "@/lib/catalog";
import { isFavorite } from "@/lib/actions";
import { KIND_LABEL } from "@/lib/types";

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMediaBySlug(slug);
  if (!data) notFound();
  const { media, card, episodes } = data;
  const session = await auth();
  const saved = session?.user ? await isFavorite(media.id) : false;
  const similar = (await listMedia({ type: media.type })).filter((t) => t.id !== media.id).slice(0, 12);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-lg bg-card">
          {card.posterUrl ? (
            <img src={card.posterUrl} alt="" className="aspect-[2/3] w-full object-cover" />
          ) : (
            <div className="grid aspect-[2/3] place-items-center text-muted">Brak plakatu</div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{KIND_LABEL[card.kind] ?? card.kind}</Badge>
            {card.year ? <Badge>{card.year}</Badge> : null}
            {card.genres.map((g) => (
              <Badge key={g.slug}>{g.name}</Badge>
            ))}
          </div>
          <h1 className="font-display text-5xl leading-none tracking-wide md:text-7xl">{card.title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted md:text-base">{card.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild size="lg" variant="cinema">
              <Link href={`/ogladaj/${card.slug}`}>
                <Play className="size-4 fill-current" />
                Oglądaj
              </Link>
            </Button>
            {session?.user ? <FavoriteButton mediaId={media.id} initial={saved} /> : null}
          </div>
          {episodes.length ? (
            <div className="pt-4">
              <h2 className="mb-2 font-display text-2xl tracking-wide">Odcinki</h2>
              <ul className="space-y-1">
                {episodes.map((ep) => (
                  <li key={ep.id}>
                    <Link
                      href={`/ogladaj/${card.slug}?e=${ep.id}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-bg-muted"
                    >
                      <span>
                        S{ep.season_number}E{ep.episode_number} · {ep.title}
                      </span>
                      <span className="text-xs text-subtle">Odtwórz</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
      <PosterRow heading="Podobne" titles={similar} />
    </div>
  );
}
