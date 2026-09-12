import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { deleteTitle, listAdminTitles } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KIND_LABEL } from "@/lib/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/tytuly")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const list = useQuery({ queryKey: ["admin-titles"], queryFn: () => listAdminTitles() });
  const del = useMutation({
    mutationFn: (id: number) => deleteTitle({ data: id }),
    onSuccess: () => {
      toast.success("Usunięto tytuł");
      void qc.invalidateQueries({ queryKey: ["admin-titles"] });
      void qc.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
  const filtered = useMemo(() => {
    const all = list.data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((t) => t.title.toLowerCase().includes(s) || t.slug.includes(s));
  }, [list.data, q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl tracking-wide">Tytuły</h1>
        <Button asChild variant="cinema">
          <Link to="/admin/tytuly/$id" params={{ id: "new" }}>
            Dodaj
          </Link>
        </Button>
      </div>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtruj po tytule" />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg-muted text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Tytuł</th>
              <th className="px-3 py-2 font-medium">Typ</th>
              <th className="px-3 py-2 font-medium">Rok</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-3 py-2">
                  <Link to="/admin/tytuly/$id" params={{ id: String(t.id) }} className="font-medium hover:underline">
                    {t.title}
                  </Link>
                  <p className="text-xs text-subtle">{t.slug}</p>
                </td>
                <td className="px-3 py-2 text-muted">{KIND_LABEL[t.kind]}</td>
                <td className="px-3 py-2 tabular-nums text-muted">{t.year ?? "—"}</td>
                <td className="px-3 py-2 text-muted">
                  {t.isPublished ? "Opublikowany" : "Szkic"}
                  {t.isFeatured ? " · wyróżniony" : ""}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="text-xs text-accent hover:underline"
                    onClick={() => {
                      if (confirm(`Usunąć „${t.title}”?`)) del.mutate(t.id);
                    }}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
