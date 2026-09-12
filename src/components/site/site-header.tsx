import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SignedIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/server/account";
import { listGenres } from "@/lib/server/catalog";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/filmy" as const, label: "Filmy" },
  { to: "/seriale" as const, label: "Seriale" },
  { to: "/programy" as const, label: "Programy" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
  });
  const genres = useQuery({ queryKey: ["genres"], queryFn: () => listGenres() });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    void navigate({ to: "/szukaj", search: { q: query } });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
        <Logo compact />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
              activeProps={{ className: "text-fg" }}
            >
              {item.label}
            </Link>
          ))}
          <details className="relative">
            <summary className="list-none rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
              Gatunki
            </summary>
            <div className="absolute top-full left-0 z-50 mt-1 grid w-64 grid-cols-2 gap-x-2 rounded-lg border border-border bg-bg-elevated p-3 shadow-xl">
              {(genres.data ?? []).map((g) => (
                <Link
                  key={g.id}
                  to="/gatunek/$slug"
                  params={{ slug: g.slug }}
                  className="rounded-sm px-2 py-1.5 text-sm text-muted hover:bg-bg-muted hover:text-fg"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden min-w-0 max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Szukaj filmów i seriali"
              className="h-9 pl-9"
              aria-label="Szukaj"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-3">
          <Link
            to="/szukaj"
            search={{ q: "" }}
            className="grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg md:hidden"
            aria-label="Szukaj"
          >
            <Search className="size-5" />
          </Link>
          <SignedIn>
            <Link
              to="/lista"
              className="grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg"
              aria-label="Moja lista"
            >
              <Heart className="size-5" />
            </Link>
          </SignedIn>
          {isPending ? (
            <Skeleton className="size-8 rounded-full" />
          ) : user ? (
            <AccountChip
              name={user.displayName ?? user.primaryEmail ?? "Konto"}
              image={user.profileImageUrl}
              isAdmin={profile.data?.role === "admin"}
            />
          ) : (
            <Button asChild size="sm" variant="cinema">
              <Link to="/login">Zaloguj się</Link>
            </Button>
          )}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg px-4 py-4 md:hidden">
          <form onSubmit={onSearch} className="mb-4">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Szukaj filmów i seriali"
              aria-label="Szukaj"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-medium tracking-wide text-subtle uppercase">Gatunki</p>
            <div className="grid grid-cols-2 gap-1">
              {(genres.data ?? []).map((g) => (
                <Link
                  key={g.id}
                  to="/gatunek/$slug"
                  params={{ slug: g.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-muted hover:bg-bg-muted hover:text-fg"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function AccountChip({
  name,
  image,
  isAdmin,
}: {
  name: string;
  image: string | null;
  isAdmin: boolean;
}) {
  const [signingOut, setSigningOut] = useState(false);
  const gateSession = useSyncExternalStore(
    () => () => {},
    hasGateSessionMarker,
    () => false,
  );
  return (
    <details className="relative">
      <summary className={cn("flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden")}>
        {image ? (
          <img src={image} alt="" className="size-8 rounded-full object-cover" />
        ) : (
          <span className="grid size-8 place-items-center rounded-full bg-bg-muted text-xs font-semibold">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </summary>
      <div className="absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-bg-elevated py-1 shadow-xl">
        <p className="truncate px-3 py-2 text-xs text-muted">{name}</p>
        <Link to="/konto" className="block px-3 py-2 text-sm hover:bg-bg-muted">
          Konto
        </Link>
        <Link to="/lista" className="block px-3 py-2 text-sm hover:bg-bg-muted">
          Moja lista
        </Link>
        {isAdmin ? (
          <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-bg-muted">
            Panel admina
          </Link>
        ) : null}
        {!gateSession ? (
          <button
            type="button"
            disabled={signingOut}
            onClick={() => {
              setSigningOut(true);
              void signOut("/").catch(() => setSigningOut(false));
            }}
            className="block w-full px-3 py-2 text-left text-sm hover:bg-bg-muted disabled:opacity-50"
          >
            {signingOut ? "Wychodzenie…" : "Wyloguj"}
          </button>
        ) : null}
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm text-muted">
            Legalny katalog filmów, seriali i programów — domena publiczna i Creative Commons.
            Filmoza nie hostuje nielegalnych kopii.
          </p>
        </div>
        <p className="text-xs text-subtle">Filmoza · katalog kina otwartego</p>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}