"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * ThemeToggle — a single button that toggles light/dark mode.
 *
 * The page boots in dark mode (the `dark` class is set on <html> in the root
 * layout). This button flips that class and swaps its icon (Sun ↔ Moon) to
 * reflect the current theme.
 */
export function ThemeToggle() {
  // Track the active theme so we know which icon to render.
  const [isDark, setIsDark] = useState(true);

  // On mount, sync state with the class actually present on <html>.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
    >
      {/* Swap icon based on the current theme */}
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
