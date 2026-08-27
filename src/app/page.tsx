import Link from "next/link";
import { sitters } from "@/lib/mock-data";
import { SitterCard } from "@/components/sitter-card";

export default function Home() {
  // Anyone can browse — approval only gates booking/messaging, not viewing.
  const approved = sitters.filter((s) => s.approvalStatus === "APPROVED");

  return (
    <div className="flex flex-col flex-1">
      <section className="border-b border-neutral-200 bg-gradient-to-b from-violet-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            Babysitting, kept local to Bundeena &amp; Maianbar
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Every parent and sitter is personally approved by Ella before
            they can book or message. Browse who&apos;s available, then
            request access to book.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/sitters"
              className="rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              Find a sitter
            </Link>
            <Link
              href="/sitters/apply"
              className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Become a sitter
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
          Approved sitters near you
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approved.map((sitter) => (
            <SitterCard key={sitter.id} sitter={sitter} />
          ))}
        </div>
      </section>
    </div>
  );
}
