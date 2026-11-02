"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-14" />;

  const isDark = resolvedTheme === "dark";
  return (
    <label className="toggle toggle-lg" title="Toggle theme">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle dark mode"
      />
      <span aria-hidden>☀</span>
      <span aria-hidden>☾</span>
    </label>
  );
}
