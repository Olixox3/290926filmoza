import { listUsersAdmin } from "@/lib/actions";
import { RoleToggle } from "./role-toggle";

export default async function UsersPage() {
  const users = await listUsersAdmin();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-5xl tracking-wide">Użytkownicy</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-bg-muted text-xs tracking-wide text-subtle uppercase">
            <tr>
              <th className="px-4 py-3">Nazwa</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Rola</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3">{u.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <RoleToggle userId={u.id} role={u.role === "admin" ? "admin" : "user"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
