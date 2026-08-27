import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { NavBar } from "@/components/nav-bar";
import { IosInstallBanner } from "@/components/ios-install-banner";

// Not using next/font/google here: it fetches from fonts.googleapis.com at
// build time, which is blocked in this sandbox's network allowlist (and is
// a build-time dependency you don't want in production either). Falls back
// to the system font stack via Tailwind's default `font-sans`, which reads
// fine and has zero external dependency. Swap in next/font/local with a
// self-hosted font file if a specific brand typeface matters later.

export const metadata: Metadata = {
  title: "Ella's Babysitting",
  description: "Find and book trusted, verified babysitters.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ella's Babysitting",
  },
};

export const viewport: Viewport = {
  themeColor: "#63389b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-warm-50 text-warm-900">
        <ServiceWorkerRegister />
        <IosInstallBanner />
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
