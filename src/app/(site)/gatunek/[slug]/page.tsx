import { PosterGrid } from "@/components/catalog/poster-card";
import { listGenres, listMedia } from "@/lib/catalog";
import { notFound } from "next/navigation";

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genres = await listGenres();
  const genre = genres.find((g) => g.slug === slug);
  const titles = await listMedia({ genre: slug });
  if (!genre && !titles.length) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl tracking-wide">{genre?.name ?? slug}</h1>
      <PosterGrid titles={titles} />
    </div>
  );
}
