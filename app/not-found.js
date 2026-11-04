import Link from "next/link";
function StudioIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="h-auto w-full max-w-sm"
      role="img"
      aria-label="A studio light shining on an empty clapperboard"
    >
      <defs>
        <linearGradient id="nf-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Light beam */}
      <polygon points="92,52 40,206 176,206" fill="url(#nf-beam)" />
      <ellipse cx="150" cy="208" rx="120" ry="8" className="fill-base-300" />

      {/* Stand light */}
      <g className="stroke-base-content" strokeWidth="4" strokeLinecap="round" fill="none">
        <line x1="62" y1="80" x2="62" y2="190" />
        <line x1="62" y1="190" x2="40" y2="208" />
        <line x1="62" y1="190" x2="84" y2="208" />
      </g>
      <g transform="rotate(-24 70 58)">
        <rect x="52" y="36" width="52" height="36" rx="8" className="fill-neutral" />
        <rect x="100" y="42" width="10" height="24" rx="3" className="fill-primary" />
      </g>

      {/* Clapperboard */}
      <g transform="translate(168 96)">
        <rect x="0" y="22" width="120" height="82" rx="8" className="fill-base-100 stroke-base-content" strokeWidth="4" />
        <g transform="rotate(-10 0 22)">
          <rect x="0" y="0" width="120" height="22" rx="5" className="fill-neutral" />
          {[14, 42, 70, 98].map((x) => (
            <polygon key={x} points={`${x},0 ${x + 14},0 ${x + 4},22 ${x - 10},22`} className="fill-primary" />
          ))}
        </g>
        <text
          x="60"
          y="76"
          textAnchor="middle"
          fontSize="30"
          fontWeight="800"
          className="fill-base-content"
        >
          404
        </text>
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="page-container flex min-h-[70vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <StudioIllustration />
      <p className="section-eyebrow">Error 404</p>
      <h1 className="section-title">This set is empty</h1>
      <p className="section-lead max-w-md">
        The page you are looking for has wrapped and left the studio. Head back
        to the lobby and find a space that is still booked solid.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </section>
  );
}
