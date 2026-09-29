import Link from "next/link";
import { ensureDbReady, query } from "@/lib/db";

export default async function AdminHome() {
  await ensureDbReady();
  const media = await query<{ n: number }>("select count(*)::int as n from media");
  const movies = await query<{ n: number }>("select count(*)::int as n from media where type = 'movie'");
  const series = await query<{ n: number }>("select count(*)::int as n from media where type = 'series'");
  const users = await query<{ n: number }>("select count(*)::int as n from users");

  const stats = [
    { label: "Tytuły", value: media[0]?.n ?? 0, href: "/admin/tytuly" },
    { label: "Filmy", value: movies[0]?.n ?? 0, href: "/admin/tytuly" },
    { label: "Seriale", value: series[0]?.n ?? 0, href: "/admin/tytuly" },
    { label: "Użytkownicy", value: users[0]?.n ?? 0, href: "/admin/uzytkownicy" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-5xl tracking-wide">Pulpit</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-bg-elevated p-5 hover:border-fg/30"
          >
            <p className="text-xs tracking-wide text-subtle uppercase">{s.label}</p>
            <p className="mt-2 font-display text-4xl">{s.value}</p>
          </Link>
        ))}
      </div>
      <Link
        href="/admin/tytuly/new"
        className="inline-flex h-11 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
      >
        Dodaj tytuł
      </Link>
    </div>
  );
}
