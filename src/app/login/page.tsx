import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");
  const params = await searchParams;
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-bg px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent)/18%,transparent_55%)]" />
      <div className="relative w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="max-w-xs text-sm text-muted">
            Katalog filmów i seriali. Zaloguj się przez Google albo e-mail.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <LoginForm initialError={params.error ?? null} />
        </div>
        <p className="text-center text-xs text-subtle">
          <Link href="/" className="hover:text-fg">
            Wróć na stronę główną
          </Link>
        </p>
      </div>
    </main>
  );
}
