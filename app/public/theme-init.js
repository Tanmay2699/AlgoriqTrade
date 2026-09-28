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
      // Reveals: once per element.
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
      // Loops (animated tables and diagrams): play only while on screen, so
      // twenty looping visuals cost what the one in view costs.
      var loops = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          entries[i].target.classList.toggle("is-playing", entries[i].isIntersecting);
        }
      });
      var bind = function (root) {
        if (!root.querySelectorAll) return;
        var r = root.querySelectorAll("[data-reveal]:not(.is-in)");
        for (var j = 0; j < r.length; j++) io.observe(r[j]);
        var l = root.querySelectorAll("[data-loop]");
        for (var k = 0; k < l.length; k++) loops.observe(l[k]);
      };
      bind(document);
      // Client-side navigation swaps page content without a new
      // DOMContentLoaded; without this, a route entered via <Link> would
      // keep its sections hidden.
      new MutationObserver(function (records) {
        for (var m = 0; m < records.length; m++) {
          var added = records[m].addedNodes;
          for (var n = 0; n < added.length; n++) {
            if (added[n].nodeType === 1) {
              bind(added[n]);
              if (added[n].matches && added[n].matches("[data-reveal]")) io.observe(added[n]);
              if (added[n].matches && added[n].matches("[data-loop]")) loops.observe(added[n]);
            }
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    });
  }
} catch (e) {}
