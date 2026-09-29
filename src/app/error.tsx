"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
      <div>
        <h1 className="font-display text-5xl tracking-wide">Coś poszło nie tak</h1>
        <p className="mt-2 max-w-md text-sm text-muted">{error.message}</p>
        <button type="button" onClick={reset} className="mt-6 text-sm hover:underline">
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}
