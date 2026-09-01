import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { IosInstallBanner } from "@/components/ios-install-banner";

// Not using next/font/google here: it fetches from fonts.googleapis.com at
// build time, which is blocked in this sandbox's network allowlist (and is
// a build-time dependency you don't want in production either). Falls back
// to the system font stack via Tailwind's default `font-sans`, which reads
// fine and has zero external dependency. Swap in next/font/local with a
// self-hosted font file if a specific brand typeface matters later.

export const metadata: Metadata = {
  title: "The Sitter List",
  description: "Local babysitting you can trust.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "The Sitter List",
  },
};

export const viewport: Viewport = {
  themeColor: "#d22f68",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-warm-50 text-warm-900">
        <ServiceWorkerRegister />
        <IosInstallBanner />
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
