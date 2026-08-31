// Renders a real photo (User.image, set via the self-service profile editor
// at /dashboard/profile) when one exists; otherwise falls back to initials
// on a deterministic warm color.

import Image from "next/image";

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

export function Avatar({
  name,
  imageUrl,
  className,
}: {
  name: string;
  imageUrl?: string | null;
  className?: string;
}) {
  const sizeCls = className ?? "h-10 w-10 text-sm";

  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-full ${sizeCls}`}>
        <Image src={imageUrl} alt={name} fill className="object-cover" sizes="96px" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${colorFor(name)} ${sizeCls}`}
    >
      {initials(name)}
    </div>
  );
}
