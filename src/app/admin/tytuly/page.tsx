import Link from "next/link";
import { listMedia } from "@/lib/catalog";

export default async function AdminTitlesPage() {
  const titles = await listMedia();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-display text-5xl tracking-wide">Tytuły</h1>
        <Link href="/admin/tytuly/new" className="rounded-md bg-fg px-4 py-2 text-sm font-medium text-bg">
          Nowy tytuł
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg-muted text-xs tracking-wide text-subtle uppercase">
            <tr>
              <th className="px-4 py-3">Tytuł</th>
              <th className="px-4 py-3">Typ</th>
              <th className="px-4 py-3">Rok</th>
              <th className="px-4 py-3">Gatunek</th>
            </tr>
          </thead>
          <tbody>
            {titles.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/admin/tytuly/${t.id}`} className="font-medium hover:underline">
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{t.kind === "series" ? "Serial" : "Film"}</td>
                <td className="px-4 py-3 text-muted">{t.year ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{t.genres.map((g) => g.name).join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
