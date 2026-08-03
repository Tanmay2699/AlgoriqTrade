// Tailwind v4 is CSS-first: no tailwind.config.js. The `.mjs` extension is
// load-bearing — apps/web's docblock records that a `.ts` PostCSS config was
// silently ignored and emitted zero utilities. Same toolchain, same rule.
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
