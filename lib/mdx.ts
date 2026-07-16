import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getCloudEnv } from "@/lib/env";

const contentDirectory = path.join(process.cwd(), "content");

export interface MdxFile<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

function resolveFolderPath(folder: string): string | null {
  if (folder === "blogs" || folder === "blog") {
    const blogPath = path.join(contentDirectory, "blog");
    const blogsPath = path.join(contentDirectory, "blogs");
    if (fs.existsSync(blogPath)) return blogPath;
    if (fs.existsSync(blogsPath)) return blogsPath;
  }
  const dirPath = path.join(contentDirectory, folder);
  if (fs.existsSync(dirPath)) return dirPath;
  return null;
}

export function getMdxFiles(folder: string): string[] {
  const dirPath = resolveFolderPath(folder);
  if (!dirPath) {
    return [];
  }
  return fs
    .readdirSync(dirPath)
    .filter(
      (file) => path.extname(file) === ".mdx" || path.extname(file) === ".md",
    );
}

export async function getMdxBySlug<T>(
  folder: string,
  slug: string,
): Promise<MdxFile<T> | null> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  // Try local fs first (works during build time)
  try {
    if (typeof process !== "undefined" && typeof process.cwd === "function") {
      const dirPath =
        resolveFolderPath(folder) || path.join(contentDirectory, folder);
      let fullPath = path.join(dirPath, `${slug}.mdx`);
      if (!fs.existsSync(fullPath)) {
        fullPath = path.join(dirPath, `${slug}.md`);
      }
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        return {
          slug,
          frontmatter: data as T,
          content,
        };
      }
    }
  } catch {
    // Ignore fs errors, fall back to GitHub API
  }

  // Fallback to GitHub API (works at runtime in Edge Workers)
  if (token) {
    try {
      const foldersToCheck =
        folder === "blog" || folder === "blogs" ? ["blog", "blogs"] : [folder];
      for (const f of foldersToCheck) {
        for (const ext of ["md", "mdx"]) {
          const ghRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/content/${f}/${slug}.${ext}?ref=${branch}`,
            {
              cache: "no-store",
              next: { revalidate: 0 },
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3.raw",
                "User-Agent": "National-Urology-Center",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            },
          );
          if (ghRes.ok) {
            const fileContents = await ghRes.text();
            if (fileContents && fileContents.trim().length > 0) {
              const { data, content } = matter(fileContents);
              return {
                slug,
                frontmatter: data as T,
                content,
              };
            }
          }
        }
      }
    } catch {
      console.warn(`Could not fetch ${folder}/${slug} from GitHub API`);
    }
  }

  return null;
}

export async function getAllMdx<T>(folder: string): Promise<MdxFile<T>[]> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  // Try local fs first (works during build time)
  try {
    if (typeof process !== "undefined" && typeof process.cwd === "function") {
      const files = getMdxFiles(folder);
      if (files.length > 0) {
        const results = await Promise.all(
          files.map((file) => {
            const slug = file.replace(/\.mdx?$/, "");
            return getMdxBySlug<T>(folder, slug);
          }),
        );
        const validResults = results.filter(
          (file): file is MdxFile<T> => file !== null,
        );
        if (validResults.length > 0) {
          validResults.sort((a, b) => {
            const dateA =
              (a.frontmatter as unknown as { date?: string }).date ||
              "2026-07-08";
            const dateB =
              (b.frontmatter as unknown as { date?: string }).date ||
              "2026-07-08";
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          return validResults;
        }
      }
    }
  } catch {
    // Ignore fs errors, fall back to GitHub API
  }

  // Fallback to GitHub API (works at runtime in Edge Workers)
  if (token) {
    try {
      const foldersToCheck =
        folder === "blog" || folder === "blogs" ? ["blog", "blogs"] : [folder];
      for (const f of foldersToCheck) {
        const ghRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/content/${f}?ref=${branch}`,
          {
            cache: "no-store",
            next: { revalidate: 0 },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "National-Urology-Center",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        );
        if (ghRes.ok) {
          const ghFiles = (await ghRes.json().catch(() => [])) as Array<{
            name?: string;
            download_url?: string;
            path?: string;
          }>;
          if (Array.isArray(ghFiles)) {
            const mdFiles = ghFiles.filter(
              (file) =>
                file &&
                file.name &&
                (file.name.endsWith(".md") || file.name.endsWith(".mdx")) &&
                file.path,
            );
            const items = await Promise.all(
              mdFiles.map(async (fileObj) => {
                const rawRes = await fetch(
                  `https://api.github.com/repos/${owner}/${repo}/contents/${fileObj.path}?ref=${branch}`,
                  {
                    cache: "no-store",
                    next: { revalidate: 0 },
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/vnd.github.v3.raw",
                      "User-Agent": "National-Urology-Center",
                      "Cache-Control": "no-cache, no-store, must-revalidate",
                    },
                  },
                ).catch(() => null);
                if (!rawRes || !rawRes.ok) return null;
                const raw = await rawRes.text().catch(() => "");
                if (!raw) return null;
                const { data, content } = matter(raw);
                const slug = (fileObj.name || "").replace(/\.mdx?$/, "");
                return {
                  slug,
                  frontmatter: data as T,
                  content,
                };
              }),
            );
            const validItems = items.filter(
              (item): item is MdxFile<T> => item !== null,
            );
            validItems.sort((a, b) => {
              const dateA =
                (a.frontmatter as unknown as { date?: string }).date ||
                "2026-07-08";
              const dateB =
                (b.frontmatter as unknown as { date?: string }).date ||
                "2026-07-08";
              return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
            return validItems;
          }
        }
      }
    } catch {
      console.warn(`Could not fetch all ${folder} from GitHub API`);
    }
  }

  return [];
}
