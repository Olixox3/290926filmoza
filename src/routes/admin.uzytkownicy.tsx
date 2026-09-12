import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { listAdminUsers, setUserRole } from "@/lib/server/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/uzytkownicy")({ component: Page });

function Page() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-users"], queryFn: () => listAdminUsers() });
  const setRole = useMutation({
    mutationFn: (input: { userId: string; role: "user" | "admin" }) => setUserRole({ data: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Zmieniono rolę");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Błąd"),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl tracking-wide">Użytkownicy</h1>
      <p className="text-sm text-muted">
        Pierwsze konto, które się zaloguje, zostaje administratorem. Tu możesz nadać rolę kolejnym osobom.
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-bg-muted text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">E-mail</th>
              <th className="px-3 py-2 font-medium">Nazwa</th>
              <th className="px-3 py-2 font-medium">Rola</th>
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((u) => (
              <tr key={u.userId} className="border-t border-border">
                <td className="max-w-[220px] truncate px-3 py-2 text-sm">{u.email ?? "—"}</td>
                <td className="px-3 py-2">{u.displayName ?? "—"}</td>
                <td className="px-3 py-2">
                  <select
                    className="h-9 rounded-md border border-border bg-bg-elevated px-2 text-sm"
                    value={u.role}
                    onChange={(e) =>
                      setRole.mutate({ userId: u.userId, role: e.target.value as "user" | "admin" })
                    }
                  >
                    <option value="user">Użytkownik</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
