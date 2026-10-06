"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "./GoogleSignInButton";

const AUTH_ERRORS: Record<string, string> = {
  Configuration: "Logowanie Google nie jest skonfigurowane. Sprawdź GOOGLE_CLIENT_ID / SECRET i NEXTAUTH_URL.",
  AccessDenied: "Odmowa dostępu.",
  Callback: "Google odrzucił przekierowanie. W Google Cloud dodaj: https://filmoza.vercel.app/api/auth/callback/google",
  OAuthCallback: "Google odrzucił przekierowanie. W Google Cloud dodaj: https://filmoza.vercel.app/api/auth/callback/google",
  OAuthSignin: "Nie udało się rozpocząć logowania Google.",
  OAuthAccountNotLinked: "To konto Google używa e-maila, który już istnieje. Zaloguj się e-mailem, a konta się połączą.",
  CredentialsSignin: "Nieprawidłowy e-mail lub hasło.",
  Default: "Logowanie nie powiodło się. Spróbuj ponownie.",
};

export function LoginForm({ initialError }: { initialError?: string | null }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(
    initialError ? (AUTH_ERRORS[initialError] ?? AUTH_ERRORS.Default) : null,
  );
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Nie udało się założyć konta");
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.error) {
        throw new Error(
          mode === "up" ? "Konto utworzone, ale logowanie nie powiodło się" : "Nieprawidłowy e-mail lub hasło",
        );
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Coś poszło nie tak");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <GoogleSignInButton />
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
      <form onSubmit={(ev) => void onSubmit(ev)} className="space-y-3">
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
        <Button type="submit" className="h-11 w-full" variant="cinema" disabled={busy}>
          {busy ? "Chwila…" : mode === "up" ? "Załóż konto" : "Zaloguj się"}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs leading-relaxed text-subtle">
        Pierwsze konto w serwisie zostaje administratorem. Google łączy się z kontem o tym samym e-mailu.
      </p>
    </>
  );
}
