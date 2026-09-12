import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/catalog/browse";
import { listCatalog } from "@/lib/server/catalog";

export const Route = createFileRoute("/_site/filmy")({
  loader: () => listCatalog(),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <BrowsePage kind="movie" titles={data.titles} />;
}
