"use client";

import { useState } from "react";
import CategoryIcon from "./CategoryIcon";

export default function StudioThumb({ src, category, alt = "", className = "h-14 w-14" }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <span
        className={`${className} grid shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary/30 to-secondary/25 text-primary`}
      >
        <CategoryIcon category={category} className="h-1/2 w-1/2" />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={`${className} shrink-0 rounded-lg object-cover`}
    />
  );
}
