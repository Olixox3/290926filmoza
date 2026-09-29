"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { installPreviewHostBridge } from "@/lib/preview-host-bridge";

const ROUTES = [
  "/",
  "/filmy",
  "/seriale",
  "/login",
  "/szukaj",
  "/lista",
  "/konto",
  "/admin",
  "/admin/tytuly",
  "/admin/tytuly/new",
  "/admin/uzytkownicy",
];

export function PreviewHostBridge() {
  const router = useRouter();
  useEffect(() => {
    return installPreviewHostBridge({
      navigate: (path) => router.push(path),
      getRoutePaths: () => ROUTES,
    });
  }, [router]);
  return null;
}
