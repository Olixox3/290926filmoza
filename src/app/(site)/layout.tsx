import { SiteShell } from "@/components/site/site-header";
import { listGenres } from "@/lib/catalog";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const genres = await listGenres();
  return <SiteShell genres={genres}>{children}</SiteShell>;
}
