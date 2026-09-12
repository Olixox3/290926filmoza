import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { getAdminStats } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({ component: Page });

function Page() {
  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: () => getAdminStats() });
  const s = stats.data;
  const cards = [
    { label: "Tytuły", value: s?.titles ?? "—" },
    { label: "Filmy", value: s?.movies ?? "—" },
    { label: "Seriale", value: s?.series ?? "—" },
    { label: "Programy", value: s?.shows ?? "—" },
    { label: "Gatunki", value: s?.genres ?? "—" },
    { label: "Konta", value: s?.users ?? "—" },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">Admin</p>
          <h1 className="font-display text-4xl tracking-wide">Pulpit</h1>
        </div>
        <Button asChild variant="cinema">
          <Link to="/admin/tytuly/$id" params={{ id: "new" }}>
            Dodaj tytuł
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-bg-elevated p-4">
            <p className="text-xs text-muted">{c.label}</p>
            <p className="mt-1 font-display text-4xl tracking-wide tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-bg-elevated p-5 text-sm leading-relaxed text-muted">
        <p className="font-medium text-fg">Gdzie trzymać pliki filmów</p>
        <p className="mt-2">
          Filmoza zapisuje w bazie (Neon Postgres) tylko metadane — tytuł, opis, gatunki i{" "}
          <strong className="text-fg">URL do pliku</strong>. Same filmy wrzucasz na darmowy hosting i wklejasz link w
          panelu:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Internet Archive — darmowe, publiczne MP4</li>
          <li>Cloudflare R2 — 10 GB za darmo, własne pliki</li>
          <li>Bunny.net / własne HTTPS — MP4 albo HLS (.m3u8)</li>
        </ul>
        <p className="mt-3">Dodawaj wyłącznie materiały, do których masz prawa (domena publiczna, CC, własna produkcja).</p>
      </div>
    </div>
  );
}
