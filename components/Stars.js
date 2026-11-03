"use client";

import { LuStar } from "react-icons/lu";

// Read-only star row (rounds to the nearest whole star).
export function Stars({ value = 0, className = "h-4 w-4" }) {
  const filled = Math.round(Number(value) || 0);
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`${Number(value) || 0} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <LuStar
          key={n}
          className={`${className} ${
            n <= filled ? "fill-primary text-primary" : "text-base-content/25"
          }`}
        />
      ))}
    </span>
  );
}

// Clickable 1-5 star picker for the review form.
export function StarInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="rounded p-0.5 transition hover:scale-110"
        >
          <LuStar
            className={`h-7 w-7 ${
              n <= value ? "fill-primary text-primary" : "text-base-content/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
