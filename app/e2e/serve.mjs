/**
 * Serve the built site exactly as the container will (the terminal's
 * apps/web/e2e/serve.mjs pattern, same reasons): `output: "standalone"` means
 * `next start` is not the production entry point — the runtime bundle is
 * `.next/standalone/**`/server.js, which does not include `.next/static` or
 * `public` until they are copied in, exactly as the Dockerfile does. Testing
 * anything else is testing an artefact we never ship.
 */

import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
// outputFileTracingRoot is the repo root, so the standalone tree mirrors the
// workspace layout: server.js sits under website/app inside it.
const appInStandalone = join(appRoot, ".next", "standalone", "website", "app");

if (!existsSync(join(appRoot, ".next", "BUILD_ID"))) {
  console.error("no build found — run `pnpm build` first");
  process.exit(1);
}

cpSync(join(appRoot, ".next", "static"), join(appInStandalone, ".next", "static"), {
  recursive: true,
});
mkdirSync(join(appRoot, "public"), { recursive: true });
cpSync(join(appRoot, "public"), join(appInStandalone, "public"), { recursive: true });

const server = join(appInStandalone, "server.js");
if (!existsSync(server)) {
  console.error(`standalone server not found at ${server}`);
  process.exit(1);
}

spawn(process.execPath, [server], {
  cwd: appInStandalone,
  stdio: "inherit",
  env: { ...process.env, PORT: process.env.PORT ?? "3105", HOSTNAME: "127.0.0.1" },
}).on("exit", (code) => process.exit(code ?? 0));
