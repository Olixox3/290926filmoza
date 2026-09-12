import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Clapperboard, LayoutDashboard, Tags, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/server/account";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin" as const, label: "Pulpit", icon: LayoutDashboard },
  { to: "/admin/tytuly" as const, label: "Tytuły", icon: Clapperboard },
  { to: "/admin/gatunki" as const, label: "Gatunki", icon: Tags },
  { to: "/admin/uzytkownicy" as const, label: "Użytkownicy", icon: Users },
];

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user) && !isPending,
  });

  if (isPending || (user && profile.isLoading)) {
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (profile.data?.role !== "admin") {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl">Brak dostępu</h1>
          <p className="mt-2 text-sm text-muted">To konto nie ma uprawnień administratora.</p>
          <Link to="/" className="mt-4 inline-block text-sm hover:underline">
            Wróć na Filmozę
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg md:flex-row">
      <aside className="border-b border-border md:w-56 md:border-r md:border-b-0">
        <div className="flex h-14 items-center px-4">
          <Logo compact />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/admin" }}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted hover:bg-bg-muted hover:text-fg"
              activeProps={{ className: "bg-bg-muted text-fg" }}
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
          <Link to="/" className="mt-2 px-3 py-2 text-xs text-subtle hover:text-fg">
            ← Katalog
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
