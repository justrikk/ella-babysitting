// Decorative only — hand-built, not a stock photo. A childcare app has no
// business sourcing photos of real children/families off the web without
// rights or consent, so this stays abstract: a warm coastal-town scene
// (Bundeena & Maianbar sit on the water, edge of Royal National Park)
// rendered in the app's own palette.
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 380" fill="none" className={className} aria-hidden="true">
      <circle cx="210" cy="190" r="180" className="fill-primary-100" />

      {/* sun */}
      <circle cx="320" cy="90" r="34" className="fill-accent-300" />

      {/* waves */}
      <path
        d="M20 300c20-16 40-16 60 0s40 16 60 0 40-16 60 0 40 16 60 0 40-16 60 0 40 16 60 0"
        stroke="currentColor"
        className="text-primary-300"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M20 330c20-16 40-16 60 0s40 16 60 0 40-16 60 0 40 16 60 0 40-16 60 0 40 16 60 0"
        stroke="currentColor"
        className="text-primary-200"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* house */}
      <path d="M120 220v-70l60-46 60 46v70z" className="fill-white stroke-primary-600" strokeWidth="6" strokeLinejoin="round" />
      <rect x="168" y="170" width="24" height="50" className="fill-primary-600" />
      <rect x="132" y="188" width="26" height="26" rx="3" className="fill-accent-200 stroke-primary-600" strokeWidth="4" />

      {/* heart above the house */}
      <path
        d="M180 130c0-10 8-16 16-16 6 0 11 3 14 8 3-5 8-8 14-8 8 0 16 6 16 16 0 16-30 34-30 34s-30-18-30-34z"
        className="fill-accent-500"
      />

      {/* sparkles */}
      <path d="M70 110l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" className="fill-primary-400" />
      <path d="M350 220l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" className="fill-accent-400" />
    </svg>
  );
}
