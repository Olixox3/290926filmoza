import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PosterGrid } from "@/components/catalog/poster-card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listFavorites } from "@/lib/server/account";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_site/lista")({ component: Page });

function Page() {
  const { user, isPending } = useCurrentUserState();
  const list = useQuery({
    queryKey: ["favorites"],
    queryFn: () => listFavorites(),
    enabled: Boolean(user) && !isPending,
  });
  if (isPending) return <Skeleton className="h-64 w-full" />;
  if (!user) return <RedirectToSignIn />;
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl tracking-wide">Moja lista</h1>
      {list.isLoading ? <Skeleton className="h-64 w-full" /> : <PosterGrid titles={list.data ?? []} />}
    </div>
  );
}
