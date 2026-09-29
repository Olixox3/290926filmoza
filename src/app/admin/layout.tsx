import Link from "next/link";
import { redirect } from "next/navigation";
import { Clapperboard, LayoutDashboard, Users } from "lucide-react";
import { auth } from "@/auth";
import { Logo } from "@/components/brand/logo";

const LINKS = [
  { href: "/admin", label: "Pulpit", icon: LayoutDashboard, exact: true },
  { href: "/admin/tytuly", label: "Tytuły", icon: Clapperboard, exact: false },
  { href: "/admin/uzytkownicy", label: "Użytkownicy", icon: Users, exact: false },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") {
    return (
      <div className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl">Brak dostępu</h1>
          <p className="mt-2 text-sm text-muted">To konto nie ma uprawnień administratora.</p>
          <Link href="/" className="mt-4 inline-block text-sm hover:underline">
            Wróć na Filmozę
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg md:flex-row">
      <aside className="border-b border-border md:w-56 md:border-r md:border-b-0">
        <div className="flex h-14 items-center px-4">
          <Logo compact />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted hover:bg-bg-muted hover:text-fg"
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
          <Link href="/" className="mt-2 px-3 py-2 text-xs text-subtle hover:text-fg">
            ← Katalog
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
