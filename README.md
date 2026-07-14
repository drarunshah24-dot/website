# Dr. Arun Shah Website

A modern medical portfolio and blog website for Dr. Arun Shah, built with Next.js, Tailwind CSS, and optimized for Cloudflare Pages using OpenNext.

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by creating a `.env` file:
   ```env
   # Required for local Admin Portal testing
   ADMIN_PASSWORD=your_secure_password
   # Required for GitHub commits through the Admin Portal
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=drarunshah24-dot
   GITHUB_REPO=website
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the site.
6. Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the Admin Portal.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Production build (uses OpenNext for Cloudflare) |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Run TypeScript type checking |

## Architecture

This project is fully statically generated (SSG) with Incremental Static Regeneration (ISR) to provide instantaneous page loads. It leverages the following technologies:
- **Next.js 14+ (App Router)**: Framework for React.
- **OpenNext**: Build adapter to seamlessly run Next.js on Cloudflare Pages.
- **MDX & Gray Matter**: Used for rendering markdown-based content for blogs, conditions, and treatments.
- **Tailwind CSS**: Utility-first CSS framework for styling.

### Admin Portal & GitHub Integration
The project features a custom-built Admin Portal at `/admin`. Instead of using a database, the Admin Portal interacts directly with the local file system (in development) and commits changes back to the GitHub repository using the GitHub API (in production).
This ensures that the repository remains the single source of truth for all content, triggering an automatic rebuild on Cloudflare Pages whenever content is updated.

See `docs/decisions/` for more details on architectural decisions.

## Deployment

The application is deployed on **Cloudflare Pages**.

- Pushes to the `main` branch automatically trigger a deployment.
- CI quality gates (Lint, TypeScript, Unit Tests) run via GitHub Actions on Pull Requests.
- Ensure that `ADMIN_PASSWORD` and `GITHUB_TOKEN` are set in the Cloudflare Pages environment variables.

### Rollback Strategy
If a deployment fails or introduces a regression:
1. Log into the Cloudflare Dashboard.
2. Navigate to Workers & Pages -> `website`.
3. Go to the **Deployments** tab.
4. Locate the previous stable deployment, click the three dots, and select **Rollback to this deployment**.
