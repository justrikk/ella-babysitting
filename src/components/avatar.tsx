// No real sitter photos exist yet (User.image is unset for everyone), so
// this renders initials on a deterministic warm color instead of a broken
// <img>. Swap for a real <Image src={sitter.image}> once photo upload
// exists — the color/initials fallback below is then just the empty state.

const PALETTE = [
  "bg-primary-600",
  "bg-accent-500",
  "bg-primary-400",
  "bg-accent-600",
  "bg-primary-700",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${colorFor(name)} ${className ?? "h-10 w-10 text-sm"}`}
    >
      {initials(name)}
    </div>
  );
}
