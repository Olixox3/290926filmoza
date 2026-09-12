import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listGenres } from "@/lib/server/catalog";
import { deleteGenre, upsertGenre } from "@/lib/server/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gatunki")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["genres"], queryFn: () => listGenres() });
  const [name, setName] = useState("");
  const save = useMutation({
    mutationFn: (input: { id?: number; name: string; sortOrder: number }) => upsertGenre({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["genres"] });
      void qc.invalidateQueries({ queryKey: ["catalog"] });
      setName("");
      toast.success("Zapisano gatunek");
    },
  });
  const del = useMutation({
    mutationFn: (id: number) => deleteGenre({ data: id }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["genres"] });
      void qc.invalidateQueries({ queryKey: ["catalog"] });
    },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-4xl tracking-wide">Gatunki</h1>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          save.mutate({ name: name.trim(), sortOrder: (list.data?.length ?? 0) + 1 });
        }}
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nowy gatunek" />
        <Button type="submit" variant="cinema">
          Dodaj
        </Button>
      </form>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {(list.data ?? []).map((g) => (
          <GenreRow
            key={g.id}
            name={g.name}
            sortOrder={g.sortOrder}
            onSave={(next, order) => save.mutate({ id: g.id, name: next, sortOrder: order })}
            onDelete={() => del.mutate(g.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function GenreRow({
  name,
  sortOrder,
  onSave,
  onDelete,
}: {
  name: string;
  sortOrder: number;
  onSave: (name: string, order: number) => void;
  onDelete: () => void;
}) {
  const [value, setValue] = useState(name);
  const [order, setOrder] = useState(String(sortOrder));
  return (
    <li className="flex flex-wrap items-center gap-2 px-3 py-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} className="min-w-40 flex-1" />
      <Input value={order} onChange={(e) => setOrder(e.target.value)} className="w-20" aria-label="Kolejność" />
      <Button type="button" size="sm" variant="outline" onClick={() => onSave(value, Number(order) || 0)}>
        Zapisz
      </Button>
      <button type="button" className="text-xs text-accent" onClick={onDelete}>
        Usuń
      </button>
    </li>
  );
}
