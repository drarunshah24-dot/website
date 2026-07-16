# ADR-002: Migrate from Cloudflare Pages to Vercel

## Status
Accepted

## Date
2026-07-16

## Context
The project was initially modified to run on Cloudflare Pages using the \@opennextjs/cloudflare\ adapter (see ADR-001). While this allowed Edge deployment, we encountered severe limitations:
1. **Next.js Features:** Native Next.js Image optimization (\<Image>\) and dynamic routing were restricted or required complex workarounds.
2. **Maintenance Overhead:** Keeping the OpenNext Cloudflare worker configurations in sync with Next.js updates proved burdensome.
3. **Observability:** We lacked out-of-the-box telemetry for Core Web Vitals and Web Analytics without injecting third-party heavy scripts.

## Decision
1. **Migrate to Vercel:** We have reverted the OpenNext configurations and migrated the deployment infrastructure to Vercel. Next.js is a first-class citizen on Vercel, guaranteeing zero-config deployment.
2. **Re-enable Native Features:** With Vercel, we re-enabled \
ext/image\ optimization.
3. **Add Vercel Telemetry:** Installed \@vercel/analytics\ and \@vercel/speed-insights\ to automatically gather performance metrics.

## Consequences
- We no longer need \wrangler.json\ or \open-next.config.ts\.
- \
pm run build\ behaves normally without relying on edge function wrappers.
- The repository is much cleaner and fully compatible with future Next.js major version upgrades.
- Vercel handles our Rollback strategy natively via their dashboard.
