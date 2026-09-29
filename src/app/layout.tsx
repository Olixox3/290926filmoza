import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Figtree } from "next/font/google";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Providers } from "./providers";
import "./globals.css";

export const dynamic = "force-dynamic";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-face",
});

const sans = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-face",
});

export const metadata: Metadata = {
  title: "Filmoza",
  description: "Filmoza — oglądaj filmy, seriale i programy. Katalog domeny publicznej i Creative Commons.",
  icons: { icon: "/favicon.svg", apple: "/__grok/icon-180.png" },
  manifest: "/__grok/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#08080a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${display.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-bg text-fg" style={{ fontFamily: "var(--font-sans-face), var(--font-sans)" }}>
        <PreviewHostBridge />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
