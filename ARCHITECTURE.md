# Architecture: Git-Based CMS

## Overview
This website uses a Git-based headless CMS architecture. Instead of relying on an external database (like PostgreSQL or MongoDB) or a traditional headless CMS (like Sanity or Contentful), all content is stored as Markdown (MDX) and JSON files directly in the Git repository under the `/content/` directory.

## Core Principles
1. **Content as Code**: Content is versioned alongside the code.
2. **Static Generation**: Next.js App Router (SSG) compiles the Markdown into static HTML at build time.
3. **No Database Operations at Runtime**: The live site does not query any database, leading to maximum performance and security.
4. **Admin Portal**: We have a custom-built admin dashboard located at `/admin`. This dashboard interfaces directly with the GitHub API to read, create, update, and delete files in the repository.

## The Content Structure
All dynamic content is stored in `/content/`:
- `/content/books/`: MDX files for publications/books.
- `/content/conditions/`: MDX files for urological conditions.
- `/content/treatments/`: MDX files for treatments and surgeries.
- `/content/faq/`: MDX files for FAQs.
- `/content/settings.json`: Global site settings (e.g., Doctor Name, Hero Image, Contact details).

## Admin Portal Workflow (GitHub API Integration)
When an administrator logs into the `/admin` portal and makes a change:

1. **Authentication**: The admin logs in using a predefined password, verified via `app/api/admin/login`.
2. **Fetching Content**: The admin dashboard fetches content directly from the GitHub repository using the GitHub REST API (`GET /repos/{owner}/{repo}/contents/{path}`).
3. **Saving Content**: 
   - The React frontend collects the MDX frontmatter and body.
   - It sends a `POST` request to `app/api/admin/save`.
   - The Next.js API route formats the data and uses the GitHub REST API (`PUT /repos/{owner}/{repo}/contents/{path}`) to commit the new/updated file directly to the `main` branch.
4. **Revalidation / Deployment**: 
   - Because a new commit is pushed to the `main` branch, Vercel (or the CI/CD pipeline) automatically triggers a new production build.
   - The new build pulls the latest MDX files and statically generates the updated pages.

## Benefits
- **Zero Hosting Costs for DB**: No need to pay for a database or third-party CMS.
- **Version Control**: Every content change is a Git commit. You can easily rollback if a mistake is made.
- **Performance**: 100% static site generation.

## Dependencies
- `gray-matter`: For parsing YAML frontmatter from Markdown.
- `next-mdx-remote`: For rendering MDX content securely.
- `@upstash/redis` & `@upstash/ratelimit`: For rate-limiting admin login attempts to prevent brute-force attacks.
