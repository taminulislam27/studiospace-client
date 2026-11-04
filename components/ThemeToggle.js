"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" aria-hidden="true" />;

  const isDark = resolvedTheme === "studiodark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "studiolight" : "studiodark")}
      className="btn btn-ghost btn-square btn-sm h-9 w-9"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <LuSun className="h-5 w-5" /> : <LuMoon className="h-5 w-5" />}
    </button>
  );
}
