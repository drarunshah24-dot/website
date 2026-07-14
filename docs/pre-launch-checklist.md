# Pre-Launch Checklist

This document tracks all requirements that must be met before deploying the site to a production environment.

## 1. Code Quality
- [x] All CI checks passing (Lint, TS, Build).
- [x] No `force-dynamic` rendering unless strictly required. (Homepage is ISR).
- [x] Code reviewed for unused dependencies and dead CMS routes.

## 2. Security
- [x] Ensure `ADMIN_PASSWORD` is configured in Cloudflare Pages.
- [x] Ensure `GITHUB_TOKEN` is configured in Cloudflare Pages.
- [x] Verify API routes correctly validate tokens (`/api/admin/*`).
- [x] No plaintext passwords or secrets in `package.json` or code.

## 3. Performance
- [x] Replaced native `<img>` tags with `<Image>` (next/image) for WebP/AVIF format optimization and layout shift prevention.
- [x] `opennextjs-cloudflare` is correctly building Edge-compatible assets.
- [x] Check TTFB under real load (Should be cached at Cloudflare Edge due to SSG/ISR).

## 4. Observability & Logging
- [x] `x-request-id` implemented on the `/api/admin/*` mutations.
- [x] Structured JSON logger outputs `event` and `requestId` on every API operation.
- [x] Any unexpected filesystem or GitHub API failures are logged as `error` with structured `{ error: error.message }` fields.

## Rollback Plan
If deployment on Cloudflare Pages fails or introduces regressions:
1. Open Cloudflare Dashboard.
2. Select the `website` Pages project.
3. In **Deployments**, locate the last known good deployment.
4. Click **Rollback to this deployment**.
5. The rollback happens instantly as traffic routes to the older deployment bundle.
