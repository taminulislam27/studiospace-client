"use client";

import { useState } from "react";

// Profile photo with an initials fallback (blocked or broken image URLs).
export default function Avatar({ user, size = "h-10 w-10" }) {
  const [broken, setBroken] = useState(false);
  const label = user?.name || user?.email || "?";
  const initials = label
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (user?.image && !broken) {
    return (
      <img
        src={user.image}
        alt={user.name || "Profile photo"}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${size} rounded-full object-cover ring-2 ring-primary/60`}
      />
    );
  }
  return (
    <span
      className={`${size} grid place-items-center rounded-full bg-primary text-sm font-bold text-primary-content ring-2 ring-primary/60`}
      aria-label={label}
    >
      {initials}
    </span>
  );
}
