import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
      <div>
        <p className="text-xs tracking-wide text-subtle uppercase">404</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide">Nie znaleziono</h1>
        <p className="mt-2 text-sm text-muted">Ten tytuł lub strona nie istnieje.</p>
        <Link href="/" className="mt-6 inline-block text-sm hover:underline">
          Wróć na Filmozę
        </Link>
      </div>
    </div>
  );
}
