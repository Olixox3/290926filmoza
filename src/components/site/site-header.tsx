"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Heart, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/filmy", label: "Filmy" },
  { href: "/seriale", label: "Seriale" },
];

export function SiteHeader({ genres }: { genres: { name: string; slug: string }[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const { data, status } = useSession();
  const user = data?.user;
  const isPending = status === "loading";

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
    router.push(`/szukaj?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
        <Logo compact />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
          <details className="relative">
            <summary className="list-none rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
              Gatunki
            </summary>
            <div className="absolute top-full left-0 z-50 mt-1 grid w-64 grid-cols-2 gap-x-2 rounded-lg border border-border bg-bg-elevated p-3 shadow-xl">
              {genres.map((g) => (
                <Link
                  key={g.slug}
                  href={`/gatunek/${g.slug}`}
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
            href="/szukaj"
            className="grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg md:hidden"
            aria-label="Szukaj"
          >
            <Search className="size-5" />
          </Link>
          {user ? (
            <Link
              href="/lista"
              className="grid size-10 place-items-center rounded-md text-muted hover:bg-bg-muted hover:text-fg"
              aria-label="Moja lista"
            >
              <Heart className="size-5" />
            </Link>
          ) : null}
          {isPending ? (
            <Skeleton className="size-8 rounded-full" />
          ) : user ? (
            <AccountChip
              name={user.name ?? user.email ?? "Konto"}
              image={user.image ?? null}
              isAdmin={user.role === "admin"}
            />
          ) : (
            <Button asChild size="sm" variant="cinema">
              <Link href="/login">Zaloguj się</Link>
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
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-xs font-medium tracking-wide text-subtle uppercase">Gatunki</p>
            <div className="grid grid-cols-2 gap-1">
              {genres.map((g) => (
                <Link
                  key={g.slug}
                  href={`/gatunek/${g.slug}`}
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
        <Link href="/konto" className="block px-3 py-2 text-sm hover:bg-bg-muted">
          Konto
        </Link>
        <Link href="/lista" className="block px-3 py-2 text-sm hover:bg-bg-muted">
          Moja lista
        </Link>
        {isAdmin ? (
          <Link href="/admin" className="block px-3 py-2 text-sm hover:bg-bg-muted">
            Panel admina
          </Link>
        ) : null}
        <button
          type="button"
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            void signOut({ callbackUrl: "/" }).catch(() => setSigningOut(false));
          }}
          className="block w-full px-3 py-2 text-left text-sm hover:bg-bg-muted disabled:opacity-50"
        >
          {signingOut ? "Wychodzenie…" : "Wyloguj"}
        </button>
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
            Legalny katalog filmów i seriali — domena publiczna i Creative Commons. Filmoza nie hostuje nielegalnych
            kopii.
          </p>
        </div>
        <p className="text-xs text-subtle">Filmoza · katalog kina otwartego</p>
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
  genres,
}: {
  children: React.ReactNode;
  genres: { name: string; slug: string }[];
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <SiteHeader genres={genres} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
