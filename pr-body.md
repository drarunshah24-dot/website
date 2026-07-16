## Summary of Changes

This PR incorporates both the **Vercel Migration** and a comprehensive **Security, Performance, and Quality Hardening** audit.

### 1. Vercel Migration
- Removed Cloudflare Pages specific dependencies (@opennextjs/cloudflare) and config files (wrangler.json, open-next.config.ts).
- Updated 
ext.config.ts to remove the Cloudflare export and re-enabled native Next.js Image Optimization.
- Refactored lib/env.ts to rely on standard process.env (as Vercel natively supports this), removing Cloudflare Edge runtime context workarounds.

### 2. Security Hardening
- **Critical Authentication Fix:** Removed the hardcoded fallback password ("admin123") in lib/auth.ts and pp/api/admin/login/route.ts. If the ADMIN_PASSWORD environment variable is not set on Vercel, the system will securely fail rather than allowing unauthorized access.
- **Upload Validation:** Enforced a strict 5MB size limit and file type extension validation (images only) in pp/api/admin/upload/route.ts to prevent malicious executable uploads.

### 3. Code Simplification & Performance
- **Simplified API Logic:** Refactored the monolithic if/else block in the Content API into dynamic frontmatter assignment.
- **Optimized Images:** Replaced raw <img> tags in the Admin Panel with <Image> from 
ext/image to improve LCP and bandwidth usage, resolving ESLint warnings.
- **Dead Code Cleanup:** Removed several unused err variables caught by ESLint.

All 
pm run lint and 
pm run build checks pass successfully.

### Next Steps for Handover:
1. Ensure the ADMIN_PASSWORD and GITHUB_TOKEN environment variables are securely set in the Vercel project settings.
2. Ensure Vercel is connected to your .com.np domain via Cloudflare DNS.
