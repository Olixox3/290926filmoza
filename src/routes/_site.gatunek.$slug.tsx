import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/catalog/browse";
import { listCatalog } from "@/lib/server/catalog";

export const Route = createFileRoute("/_site/gatunek/$slug")({
  loader: () => listCatalog(),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData();
  const titles = data.titles.filter((t) => t.genres.some((g) => g.slug === slug));
  const name = data.genres.find((g) => g.slug === slug)?.name ?? slug;
  return <BrowsePage titles={titles} heading={name} />;
}
