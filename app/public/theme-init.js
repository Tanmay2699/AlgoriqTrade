/*
 * Applies the stored theme before first paint (website/docs/04 §Key-1).
 *
 * apps/web inlines this exact logic with a CSP nonce; this site keeps a strict
 * *static* CSP instead, so the bootstrap is an external, same-origin file
 * loaded synchronously from <head> — render-blocking on purpose, because the
 * entire job is to run before the first paint. It is a few hundred bytes and
 * cached forever after the first load.
 *
 * Reads the same two localStorage keys the terminal writes (ae.theme, ae.cvd)
 * so a user's choice carries across the two apps on a shared origin. Dark is
 * the default regardless of prefers-color-scheme — the terminal's documented
 * rule ("a white flash at 09:15 is its own bug") applies to its front door too.
 */
try {
  var d = document.documentElement;
  var t = localStorage.getItem("ae.theme");
  var c = localStorage.getItem("ae.cvd");
  t = t === "light" ? "light" : "dark";
  d.dataset.theme = t;
  d.dataset.cvd = c === "deutan" ? "deutan" : "none";
  d.classList.toggle("dark", t === "dark");
} catch (e) {}

/*
 * Section reveals (docs/04 §5): 300ms rise-and-fade, once per element, no
 * re-trigger on scroll-up. They live in THIS file rather than a React island
 * so the script that hides content is the script that reveals it: CSS hides
 * [data-reveal] only under the `.js` marker stamped here, so a React bundle
 * that fails to load can never strand sections hidden — and reveals don't
 * wait for hydration. The marker is stamped only when the reveal can
 * actually run: no IntersectionObserver, or prefers-reduced-motion, means
 * no hiding at all (reduced motion renders final state as a first-class
 * mode, not a degradation).
 */
try {
  if (
    "IntersectionObserver" in window &&
    !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    document.documentElement.classList.add("js");
    document.addEventListener("DOMContentLoaded", function () {
      var io = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              entries[i].target.classList.add("is-in");
              io.unobserve(entries[i].target);
            }
          }
        },
        { threshold: 0.1 },
      );
      var els = document.querySelectorAll("[data-reveal]");
      for (var j = 0; j < els.length; j++) io.observe(els[j]);
    });
  }
} catch (e) {}
