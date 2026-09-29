"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleFavorite } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function FavoriteButton({ mediaId, initial }: { mediaId: number; initial: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  return (
    <Button
      type="button"
      variant={saved ? "cinema" : "secondary"}
      size="lg"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void toggleFavorite(mediaId)
          .then((res) => setSaved(res.saved))
          .finally(() => setBusy(false));
      }}
    >
      <Heart className={`size-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Na liście" : "Moja lista"}
    </Button>
  );
}
