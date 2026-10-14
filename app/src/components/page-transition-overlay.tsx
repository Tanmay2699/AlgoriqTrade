"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingMark } from "@/components/loading-mark";

// Static pages prefetch and swap instantly, so Next's Suspense-based
// loading.tsx (still there for the few genuinely dynamic routes) never gets
// a chance to paint on a normal navigation — it was gone in under a frame.
// This holds the loading mark up for a guaranteed minimum stretch on every
// pathname change, including the first load, so it's actually seen rather
// than a deliberate "real" loading state.
const MIN_VISIBLE_MS = 900;

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#070b14] transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <LoadingMark />
    </div>
  );
}
