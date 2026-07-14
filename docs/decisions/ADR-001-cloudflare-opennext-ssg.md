# ADR-001: Migrate to OpenNext and Cloudflare Pages (SSG/ISR)

## Status
Accepted

## Date
2026-07-14

## Context
The project initially used Next.js with Decap CMS for content management and was planned to deploy on Vercel or Netlify. However, the site is deployed to Cloudflare Pages (via `wrangler.json`).
Cloudflare Pages has strict limitations on traditional Node.js runtime features and relies on Cloudflare Workers. We encountered build recursion issues and runtime `EPERM` issues when attempting to use default Next.js adapters in this environment. Additionally, we had security vulnerabilities in dependencies like `postcss` and missing authentication on the custom Admin Portal API routes.

## Decision
1. **Remove Decap CMS:** Decap CMS requires specific Netlify Identity endpoints or GitHub OAuth flows which are cumbersome to configure in Cloudflare Pages. We replaced it with a custom React Admin Portal (`AdminClient.tsx`) that uses API routes (`/api/admin/content`, `/api/admin/upload`).
2. **Use OpenNext for Cloudflare:** We adopted `@opennextjs/cloudflare` as the build adapter for Cloudflare Pages instead of `@cloudflare/next-on-pages` or standard Next.js build.
3. **SSG/ISR over Dynamic Rendering:** We removed `export const dynamic = 'force-dynamic'` in favor of `export const revalidate = 3600` (ISR) on the main landing page to ensure Cloudflare caches the HTML and significantly improves TTFB.
4. **Server-Side Authentication:** We introduced a Bearer token authentication flow checking the `ADMIN_PASSWORD` environment variable to secure the `/api/admin/*` endpoints.

## Consequences
- Content changes through the Admin Portal now commit directly to the GitHub repository using the GitHub API (`lib/github.ts`).
- Builds on Cloudflare Pages will run `opennextjs-cloudflare build` instead of standard `next build` to properly generate the worker bundles.
- We must provide `ADMIN_PASSWORD` and `GITHUB_TOKEN` in the Cloudflare Pages environment variables for the site to function correctly.
- Improved performance and security, but local Windows builds of OpenNext might encounter `EPERM` symlink errors unless Developer Mode is enabled (this does not affect the Linux-based Cloudflare CI).
