import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/catalog/browse";
import { listCatalog } from "@/lib/server/catalog";

export const Route = createFileRoute("/_site/programy")({
  loader: () => listCatalog(),
  component: Page,
});

function Page() {
  const data = Route.useLoaderData();
  return <BrowsePage kind="show" titles={data.titles} />;
}
