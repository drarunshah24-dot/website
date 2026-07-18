# ADR-004: Launch Readiness Audit and Dependency Purge

## Status
Accepted

## Context
Prior to the final launch, we underwent a rigorous launch-readiness audit encompassing several domains (Security, Code Simplification, Performance, CI/CD). During this audit, several aspects of the application were evaluated against modern Next.js 15 principles and `ponytail-audit` guidelines.

We identified a number of legacy dependencies that were silently bloated into `package.json` due to earlier architectural iterations (e.g. migrating from `@next/mdx` to `next-mdx-remote` and replacing `@mdxeditor/editor` with `@uiw/react-md-editor`).

Additionally, automated security scanners often incorrectly flag Next.js static generation patterns. We needed to formally document the architectural boundaries of our custom-built solutions (e.g., Upstash Redis Rate-Limiting, GitHub API fallback for race conditions, and `params` await compliance).

## Decision
1. **Dependency Purge**: We removed 8 unused dependencies to minimize the application footprint and eliminate potential attack vectors.
   - `@mdx-js/loader`, `@mdx-js/react`, `@next/mdx`, `@mdxeditor/editor`, `marked`, `@types/marked`, `next-remove-imports`, `uuid`.
2. **Security & Hydration Assertions**: 
   - Confirmed compliance with Next.js 15 `await params` requirements.
   - Confirmed that UI components like `AnimatedCounter` and `ClinicMarquee` are structurally immune to hydration mismatches.
   - Confirmed the `app/api/admin/upload/route.ts` effectively validates the admin session cookie via `lib/auth.ts`.
3. **CI/CD Consolidation**: Consolidated the full suite of security, SEO, and structural fixes into PR #32 to serve as the final release candidate.

## Consequences
- **Positive**: Smaller bundle size, faster `npm install`, zero-warning build output, and a more secure repository footprint.
- **Negative**: None. Removed packages were confirmed completely unused.
