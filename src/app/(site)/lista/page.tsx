import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PosterGrid } from "@/components/catalog/poster-card";
import { listFavorites } from "@/lib/actions";

export default async function ListaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const titles = await listFavorites();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl tracking-wide">Moja lista</h1>
      <PosterGrid titles={titles} />
    </div>
  );
}
