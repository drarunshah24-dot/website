import { MetadataRoute } from "next";
import { getAllMdx } from "@/lib/mdx";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://drarunshah.com.np";
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/treatments`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/conditions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic MDX routes
  try {
    const [blogs, treatments, conditions, books] = await Promise.all([
      getAllMdx<{ title: string; date?: string }>("blog"),
      getAllMdx<{ title: string }>("treatments"),
      getAllMdx<{ title: string }>("conditions"),
      getAllMdx<{ title: string }>("books"),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.frontmatter.date
        ? new Date(item.frontmatter.date)
        : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const treatmentRoutes: MetadataRoute.Sitemap = treatments.map((item) => ({
      url: `${baseUrl}/treatments/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const conditionRoutes: MetadataRoute.Sitemap = conditions.map((item) => ({
      url: `${baseUrl}/conditions/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const bookRoutes: MetadataRoute.Sitemap = books.map((item) => ({
      url: `${baseUrl}/books/${item.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...treatmentRoutes,
      ...conditionRoutes,
      ...blogRoutes,
      ...bookRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
