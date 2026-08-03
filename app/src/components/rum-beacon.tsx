"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

/**
 * Web-vitals beacon (website/docs/07 §6) — client island, budget note:
 * web-vitals is ~2 kB gz and this component adds no render output. Sends
 * cookieless, identifier-free aggregates to the first-party /api/rum sink
 * via sendBeacon (fires reliably on tab close, which is exactly when CLS
 * and INP finalise).
 */

function send(metric: Metric) {
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    route: window.location.pathname,
    device: window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop",
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/rum", body);
  } else {
    fetch("/api/rum", { method: "POST", body, keepalive: true }).catch(() => {});
  }
}

export function RumBeacon() {
  useEffect(() => {
    onLCP(send);
    onCLS(send);
    onINP(send);
    onTTFB(send);
  }, []);
  return null;
}
