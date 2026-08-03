# website/app — public marketing site container image.
#
# BUILD CONTEXT IS THE REPO ROOT (this is a pnpm workspace):
#   docker build -f website/app/Dockerfile -t alphaedge-website .
#
# This image is ENVIRONMENT-AGNOSTIC and promotable by digest — and unlike
# apps/web it takes no build arguments at all: the site has no NEXT_PUBLIC_*
# values, prices render per-request from svc-billing, the track record from
# svc-recs, and robots.txt reads AE_SITE_INDEXABLE at runtime. The bytes that
# passed stage are the bytes prod runs, with nothing baked in to break that.
#
# Note on the /how-its-built page: it parses website/docs/claims-ledger.md at
# BUILD time (the page is fully static), which is why the build stage copies
# the whole repo — the docs are inputs to the build, not runtime files.

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH"
RUN corepack enable

# --- build -----------------------------------------------------------------
FROM base AS build
WORKDIR /app

# Source first, then install — same reasoning as apps/web/Dockerfile: pnpm's
# per-package workspace symlinks make a deps-only cache stage incorrect, and
# the pnpm store cache mount recovers the download cost anyway.
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @alphaedge/website build

# --- runtime ---------------------------------------------------------------
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN useradd -m -u 10001 app

# Requires `output: "standalone"` in website/app/next.config.ts. The
# outputFileTracingRoot is the repo root, so server.js lands under
# website/app/ inside the standalone bundle.
COPY --from=build --chown=app:app /app/website/app/.next/standalone ./
COPY --from=build --chown=app:app /app/website/app/.next/static ./website/app/.next/static
COPY --from=build --chown=app:app /app/website/app/public ./website/app/public

USER app
EXPOSE 3000

# The Helm chart wires liveness/readiness to this path; keep them in step.
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "website/app/server.js"]
