"use client";

import { useEffect, useRef, useState } from "react";
import { GLOSSARY, type GlossKey } from "@/copy/glossary";

/**
 * GlossTerm (website/docs/05 §11) — an accessible jargon gloss: a real
 * <button> (keyboard + touch for free) toggling a definition card. Escape
 * and outside-pointer close it; role="status" announces the definition when
 * it appears. Content comes only from the lintable glossary module.
 *
 * The card is edge-aware: near a viewport edge it anchors left or right
 * instead of centering, so a term at the start of a 320px line never clips.
 */

const CARD_HALF_PX = 128; // w-64 / 2

export function GlossTerm({ k }: { k: GlossKey }) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"center" | "left" | "right">("center");
  const wrapRef = useRef<HTMLSpanElement>(null);
  const entry = GLOSSARY[k];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    if (!open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      if (mid < CARD_HALF_PX + 8) setAlign("left");
      else if (window.innerWidth - mid < CARD_HALF_PX + 8) setAlign("right");
      else setAlign("center");
    }
    setOpen((v) => !v);
  };

  const alignClass =
    align === "left"
      ? "left-0"
      : align === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="rounded-sm text-ink-muted underline decoration-ink-subtle decoration-dotted underline-offset-4 transition hover:text-ink hover:decoration-ink"
      >
        {entry.term}
      </button>
      {open && (
        <span
          role="status"
          className={`absolute top-full z-20 mt-1.5 block w-64 rounded-2xl border border-line bg-surface p-3 text-left text-xs leading-relaxed text-ink-muted shadow-lg ${alignClass}`}
        >
          <span className="block font-semibold text-ink">{entry.term}</span>
          {entry.def}
        </span>
      )}
    </span>
  );
}

/** A quiet "jargon, decoded" strip for the foot of an act. */
export function GlossRow({ keys }: { keys: readonly GlossKey[] }) {
  return (
    <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 text-xs text-ink-subtle">
      <span className="font-medium uppercase tracking-wide">Jargon, decoded</span>
      {keys.map((k) => (
        <GlossTerm key={k} k={k} />
      ))}
    </p>
  );
}
