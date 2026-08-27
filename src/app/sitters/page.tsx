import { getAllSitters } from "@/lib/sitters";
import { SitterCard } from "@/components/sitter-card";

export default async function SittersPage() {
  const sitters = await getAllSitters();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Find a sitter
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        {sitters.length} sitters listed. Anyone can browse — sitters marked
        &quot;Approved by Ella&quot; can accept bookings; others are still
        waiting on approval.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sitters.map((sitter) => (
          <SitterCard key={sitter.id} sitter={sitter} />
        ))}
      </div>
      {sitters.length === 0 && (
        <p className="mt-10 text-center text-sm text-neutral-500">
          No sitters yet — the first application will show up here once
          Ella approves it in{" "}
          <a href="/admin" className="text-violet-700 underline">
            /admin
          </a>
          .
        </p>
      )}
    </div>
  );
}
