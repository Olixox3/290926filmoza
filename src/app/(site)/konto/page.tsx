import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "./sign-out-button";

export default async function KontoPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user;
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-5xl tracking-wide">Konto</h1>
      <div className="rounded-xl border border-border bg-bg-elevated p-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img src={user.image} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-bg-muted font-display text-2xl">
              {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-lg font-medium">{user.name ?? "Użytkownik"}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-subtle">{user.role}</p>
          </div>
        </div>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
