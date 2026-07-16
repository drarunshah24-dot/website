# National Urology Center - Dr. Arun Shah

World-Class Urology Care in Janakpur by Dr. Arun Shah. Advanced laser surgery and compassionate treatment.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Content Management**: Custom React Admin Portal (Syncs to GitHub API)
- **Analytics**: Vercel Analytics & Speed Insights
- **SEO**: Dynamic Sitemap & Robots.txt generated automatically

## Local Development

1. Install dependencies:
   \\\ash
   npm install
   \\\

2. Create a \.env.local\ file with the following variables:
   \\\env
   ADMIN_PASSWORD=your_secure_password
   GITHUB_TOKEN=your_personal_access_token # Requires 'repo' scope
   GITHUB_OWNER=drarunshah24-dot
   GITHUB_REPO=website
   GITHUB_BRANCH=main
   \\\

3. Run the development server:
   \\\ash
   npm run dev
   \\\

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

This project is optimized for **Vercel**. 

To deploy:
1. Connect your GitHub repository to Vercel.
2. Under **Environment Variables** in Vercel, add:
   - \ADMIN_PASSWORD\ (Mandatory for Admin Portal access)
   - \GITHUB_TOKEN\ (Mandatory for Admin Portal to save content permanently)
3. Deploy! Vercel will automatically build and host the site.

## Contributing

Please see \CONTRIBUTING.md\ for guidelines on branch naming and commit messages.

## SEO & Observability

- **Sitemap**: Automatically available at \/sitemap.xml\
- **Robots**: Automatically available at \/robots.txt\
- **Metrics**: Check the Vercel Dashboard for Web Analytics and Speed Insights.
