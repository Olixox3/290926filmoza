import { PosterGrid } from "@/components/catalog/poster-card";
import { listMedia } from "@/lib/catalog";

export default async function FilmyPage() {
  const titles = await listMedia({ type: "movie" });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl tracking-wide">Filmy</h1>
      <PosterGrid titles={titles} />
    </div>
  );
}
