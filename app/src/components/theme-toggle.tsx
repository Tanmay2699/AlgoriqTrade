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
  // Two controls share this state (header button, footer selects).
  window.dispatchEvent(new Event("ae-theme"));
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [cvd, setCvdState] = useState<CvdMode>("none");

  useEffect(() => {
    // The bootstrap already applied the stored values; read them back rather
    // than re-deriving, so the selects reflect reality even if a future
    // bootstrap changes the defaults.
    const sync = () => {
      const root = document.documentElement;
      setThemeState(root.dataset.theme === "light" ? "light" : "dark");
      setCvdState(root.dataset.cvd === "deutan" ? "deutan" : "none");
    };
    sync();
    window.addEventListener("ae-theme", sync);
    return () => window.removeEventListener("ae-theme", sync);
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
          className="h-9 rounded-lg border border-line bg-panel px-3 text-xs text-ink transition hover:border-ring"
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
          className="h-9 rounded-lg border border-line bg-panel px-3 text-xs text-ink transition hover:border-ring"
        >
          <option value="none">Red / green</option>
          <option value="deutan">Blue / orange (deutan)</option>
        </select>
      </div>
    </div>
  );
}

/**
 * Header theme switch — one icon button that flips dark/light and leaves the
 * colour-vision choice alone. Same keys and `apply()` as the footer selects;
 * it reads the DOM at click time so the two controls can never disagree.
 */
export function ThemeButton() {
  const [theme, setThemeState] = useState<ThemeName>("dark");

  useEffect(() => {
    const sync = () =>
      setThemeState(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    sync();
    window.addEventListener("ae-theme", sync);
    return () => window.removeEventListener("ae-theme", sync);
  }, []);

  const flip = () => {
    const root = document.documentElement;
    const next: ThemeName = root.dataset.theme === "light" ? "dark" : "light";
    const cvd: CvdMode = root.dataset.cvd === "deutan" ? "deutan" : "none";
    localStorage.setItem(THEME_KEY, next);
    apply(next, cvd);
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-line bg-panel/60 text-ink-muted transition hover:border-ring hover:text-ink"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {theme === "dark" ? (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
