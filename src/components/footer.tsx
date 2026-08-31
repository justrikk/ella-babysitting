import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export function Footer() {
  return (
    <footer className="bg-primary-700 text-primary-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-white">Sitter Sisters</p>
            <p className="mt-1 text-sm">
              Local babysitting you can trust — Bundeena &amp; Maianbar.
            </p>
            <nav className="mt-4 flex gap-4 text-sm">
              <Link href="/terms" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Join the Sitter Sisters Club
            </p>
            <p className="mt-1 text-sm">
              Exclusive news, reviews, and content — straight to your inbox.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-xs text-primary-200">
          © {new Date().getFullYear()} Sitter Sisters. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
