import { MetadataRoute } from "next";
import { getAllMdx } from "@/lib/mdx";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://drarunshah.com.np";

  // Fetch all MDX content
  const blogs = await getAllMdx<{ date?: string }>("blog");
  const books = await getAllMdx<{ date?: string }>("books");
  const conditions = await getAllMdx<{ date?: string }>("conditions");
  const treatments = await getAllMdx<{ date?: string }>("treatments");

  const blogRoutes = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const bookRoutes = books.map((post) => ({
    url: `${baseUrl}/books/${post.slug}`,
    lastModified: new Date(post.frontmatter.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const conditionRoutes = conditions.map((post) => ({
    url: `${baseUrl}/conditions/${post.slug}`,
    lastModified: new Date(post.frontmatter.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const treatmentRoutes = treatments.map((post) => ({
    url: `${baseUrl}/treatments/${post.slug}`,
    lastModified: new Date(post.frontmatter.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/books",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.9,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...bookRoutes,
    ...conditionRoutes,
    ...treatmentRoutes,
  ];
}
