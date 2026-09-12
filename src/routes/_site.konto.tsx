import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listContinueWatching, listFavorites } from "@/lib/server/account";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";

export const Route = createFileRoute("/_site/konto")({ component: Page });

function Page() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user) && !isPending,
  });
  const fav = useQuery({
    queryKey: ["favorites"],
    queryFn: () => listFavorites(),
    enabled: Boolean(user) && !isPending,
  });
  const cont = useQuery({
    queryKey: ["continue"],
    queryFn: () => listContinueWatching(),
    enabled: Boolean(user) && !isPending,
  });
  const [signingOut, setSigningOut] = useState(false);
  const gateSession = useSyncExternalStore(
    () => () => {},
    hasGateSessionMarker,
    () => false,
  );

  if (isPending) return null;
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-4xl tracking-wide">Konto</h1>
      <div className="rounded-xl border border-border bg-bg-elevated p-5">
        <p className="text-lg font-medium">{user.displayName ?? "Użytkownik"}</p>
        <p className="text-sm text-muted">{user.primaryEmail}</p>
        <p className="mt-3 text-xs uppercase tracking-wide text-subtle">
          {profile.data?.role === "admin" ? "Administrator" : "Użytkownik"}
        </p>
      </div>
      <ul className="space-y-2 text-sm text-muted">
        <li>Na liście: {fav.data?.length ?? 0} tytułów</li>
        <li>W trakcie: {cont.data?.length ?? 0}</li>
      </ul>
      {profile.data?.role === "admin" ? (
        <Button asChild variant="cinema">
          <Link to="/admin">Panel administratora</Link>
        </Button>
      ) : null}
      {!gateSession ? (
        <Button
          variant="outline"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut("/").catch(() => setSigningOut(false));
          }}
        >
          {signingOut ? "Wychodzenie…" : "Wyloguj"}
        </Button>
      ) : null}
    </div>
  );
}
