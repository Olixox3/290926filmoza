"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export function GoogleSignInButton() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full gap-3 text-sm font-medium"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signIn("google", { callbackUrl: "/" });
      }}
    >
      <GoogleMark />
      {busy ? "Otwieranie Google…" : "Kontynuuj z Google"}
    </Button>
  );
}
