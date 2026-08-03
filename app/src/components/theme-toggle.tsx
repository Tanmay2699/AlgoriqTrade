"use client";

/**
 * Theme + colour-vision toggles, sharing the terminal's storage keys
 * (`ae.theme`, `ae.cvd`) so a choice made on the site carries into the
 * terminal on a shared origin. `public/theme-init.js` applies the stored
 * values before first paint; this component only has to keep them in sync
 * after hydration. Ported from apps/web/src/lib/theme.tsx, minus the chart
 * palette resolution the site does not need yet.
 */

import { useEffect, useState } from "react";

type ThemeName = "dark" | "light";
type CvdMode = "none" | "deutan";

const THEME_KEY = "ae.theme";
const CVD_KEY = "ae.cvd";

function apply(theme: ThemeName, cvd: CvdMode) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.cvd = cvd;
  // Tailwind's `dark:` variants key off the class, the tokens off the
  // attribute; both must move together or half the page switches.
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [cvd, setCvdState] = useState<CvdMode>("none");

  useEffect(() => {
    // The bootstrap already applied the stored values; read them back rather
    // than re-deriving, so the selects reflect reality even if a future
    // bootstrap changes the defaults.
    const root = document.documentElement;
    setThemeState(root.dataset.theme === "light" ? "light" : "dark");
    setCvdState(root.dataset.cvd === "deutan" ? "deutan" : "none");
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    apply(t, cvd);
  };
  const setCvd = (c: CvdMode) => {
    setCvdState(c);
    localStorage.setItem(CVD_KEY, c);
    apply(theme, c);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div>
        <label htmlFor="site-theme-select" className="sr-only">
          Colour theme
        </label>
        <select
          id="site-theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeName)}
          className="rounded border border-line-strong bg-surface px-2 py-1 text-xs text-ink"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      <div>
        <label htmlFor="site-cvd-select" className="sr-only">
          Colour-vision palette
        </label>
        <select
          id="site-cvd-select"
          value={cvd}
          onChange={(e) => setCvd(e.target.value as CvdMode)}
          className="rounded border border-line-strong bg-surface px-2 py-1 text-xs text-ink"
        >
          <option value="none">Red / green</option>
          <option value="deutan">Blue / orange (deutan)</option>
        </select>
      </div>
    </div>
  );
}
