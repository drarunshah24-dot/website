# Pre-Launch Checklist

This document tracks all requirements that must be met before deploying the site to a production environment.

## 1. Code Quality
- [x] All CI checks passing (Lint, TS, Build).
- [x] No \orce-dynamic\ rendering unless strictly required. (Homepage is ISR).
- [x] Code reviewed for unused dependencies and dead CMS routes.

## 2. Security
- [x] Ensure \ADMIN_PASSWORD\ is configured in Vercel Environment Variables.
- [x] Ensure \GITHUB_TOKEN\ is configured in Vercel Environment Variables.
- [x] Verify API routes correctly validate tokens (\/api/admin/*\).
- [x] No plaintext passwords or secrets in \package.json\ or code.

## 3. Performance & Observability
- [x] Replaced native \<img>\ tags with \<Image>\ (next/image) for WebP/AVIF format optimization and layout shift prevention.
- [x] Vercel Analytics installed to monitor real-world traffic.
- [x] Vercel Speed Insights installed to monitor Core Web Vitals (LCP, CLS, INP).
- [x] Structured JSON logger outputs \event\ and \equestId\ on every API operation.

## Rollback Plan
If deployment on Vercel fails or introduces regressions:
1. Open Vercel Dashboard.
2. Select the \website\ project.
3. In **Deployments**, locate the last known good deployment.
4. Click the three dots (...) and select **Promote to Production** or **Rollback**.
5. The rollback happens instantly as Vercel routes traffic to the older deployment bundle.
