import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

const GOOGLE = GROK_PROVIDERS.find((p) => p.idp === "google");

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.7h5.2c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M5.3 14.3 4.4 15l-2.6 2C3.4 20.5 7.4 23 12 23c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.8-6-4.3z"
      />
      <path
        fill="#4A90E2"
        d="M2 7c-.6 1.2-1 2.6-1 4s.4 2.8 1 4c0 0 3.3-2.6 3.3-2.6C4.9 11.8 4.8 11.4 4.8 11S4.9 10.2 5.3 9.7z"
      />
      <path
        fill="#FBBC05"
        d="M12 4.8c1.5 0 2.8.5 3.9 1.5l2.9-2.9C16.9 1.8 14.6 1 12 1 7.4 1 3.4 3.5 1.8 7l3.5 2.7C6.9 6.6 9.2 4.8 12 4.8z"
      />
    </svg>
  );
}

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const navigate = useNavigate();

  if (isPending) {
    return <main className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">Ładowanie…</main>;
  }
  if (user) return <Navigate to="/" />;

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });
        if (res.error) throw new Error(res.error.message ?? "Nie udało się założyć konta");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message ?? "Nie udało się zalogować");
      }
      await authClient.getSession();
      void navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    if (!GOOGLE) return;
    setError(null);
    setGoogleBusy(true);
    try {
      await signIn(GOOGLE.providerId, { callbackURL: "/", errorCallbackURL: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logowanie Google nie powiodło się");
      setGoogleBusy(false);
    }
  }

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-bg px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent)/18%,transparent_55%)]" />
      <div className="relative w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="max-w-xs text-sm text-muted">Katalog filmów i seriali. Zaloguj się przez Google albo e-mail.</p>
        </div>

        <div className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          {authEnabled ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-3 text-sm font-medium"
                disabled={googleBusy || busy}
                onClick={() => void onGoogle()}
              >
                <GoogleMark />
                {googleBusy ? "Otwieranie Google…" : "Kontynuuj z Google"}
              </Button>

              <div className="my-5 flex items-center gap-3 text-[11px] tracking-wide text-subtle uppercase">
                <span className="h-px flex-1 bg-border" />
                albo e-mail
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="mb-4 grid grid-cols-2 rounded-md bg-bg-muted p-1">
                <button
                  type="button"
                  className={`rounded-sm py-2 text-sm font-medium ${mode === "in" ? "bg-bg-elevated text-fg" : "text-muted"}`}
                  onClick={() => setMode("in")}
                >
                  Logowanie
                </button>
                <button
                  type="button"
                  className={`rounded-sm py-2 text-sm font-medium ${mode === "up" ? "bg-bg-elevated text-fg" : "text-muted"}`}
                  onClick={() => setMode("up")}
                >
                  Rejestracja
                </button>
              </div>

              <form onSubmit={(ev) => void onEmail(ev)} className="space-y-3">
                {mode === "up" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Imię</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      placeholder="Jak mamy Cię wyświetlać"
                    />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="ty@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Hasło</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                    placeholder="Minimum 8 znaków"
                  />
                </div>
                {error ? <p className="text-sm text-accent">{error}</p> : null}
                <Button type="submit" className="h-11 w-full" variant="cinema" disabled={busy || googleBusy}>
                  {busy ? "Chwila…" : mode === "up" ? "Załóż konto" : "Zaloguj się"}
                </Button>
              </form>
              <p className="mt-4 text-center text-xs leading-relaxed text-subtle">
                Pierwsze konto w serwisie zostaje administratorem. Google potwierdza e-mail automatycznie; przy
                rejestracji e-mailem konto zapisywane jest od razu.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Logowanie jest wyłączone.</p>
          )}
        </div>

        <p className="text-center text-xs text-subtle">
          <Link to="/" className="hover:text-fg">
            Wróć na stronę główną
          </Link>
        </p>
      </div>
    </main>
  );
}
