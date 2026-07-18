import path from "path";
import matter from "gray-matter";
import { getCloudEnv } from "@/lib/env";
import fs from "fs";

const contentDirectory = path.join(process.cwd(), "content");

export interface MdxFile<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

function resolveFolderPath(folder: string): string | null {
  const checkDirs = [
    path.join(contentDirectory, folder),
    path.join(process.cwd(), "content", folder),
    path.resolve("./content", folder),
  ];
  if (folder === "blogs" || folder === "blog") {
    checkDirs.push(
      path.join(contentDirectory, "blog"),
      path.join(contentDirectory, "blogs"),
      path.join(process.cwd(), "content", "blog"),
      path.join(process.cwd(), "content", "blogs"),
      path.resolve("./content/blog"),
      path.resolve("./content/blogs"),
    );
  }
  for (const dir of checkDirs) {
    try {
      if (fs.existsSync(dir)) return dir;
    } catch {
      // ignore
    }
  }
  return null;
}

export function getMdxFiles(folder: string): string[] {
  const dirPath = resolveFolderPath(folder);
  if (!dirPath) {
    return [];
  }
  try {
    return fs
      .readdirSync(dirPath)
      .filter(
        (file) => path.extname(file) === ".mdx" || path.extname(file) === ".md",
      );
  } catch {
    return [];
  }
}

export async function getMdxBySlug<T>(
  folder: string,
  slug: string,
): Promise<MdxFile<T> | null> {
  if (!slug) return null;
  const cleanSlug = decodeURIComponent(slug)
    .trim()
    .replace(/\.mdx?$/, "");
  if (!cleanSlug) return null;

  const token = await getCloudEnv("GITHUB_TOKEN");
  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  // Try local fs first (works during build time)
  try {
    if (typeof process !== "undefined" && typeof process.cwd === "function") {
      const dirPath =
        resolveFolderPath(folder) || path.join(contentDirectory, folder);
      let fullPath = path.join(dirPath, `${cleanSlug}.mdx`);
      if (!fs.existsSync(fullPath)) {
        fullPath = path.join(dirPath, `${cleanSlug}.md`);
      }
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        return {
          slug: cleanSlug,
          frontmatter: data as T,
          content,
        };
      }
    }
  } catch {
    // Ignore fs errors, fall back to GitHub API
  }

  // Fallback to GitHub (works at runtime in Edge Workers without needing GITHUB_TOKEN)
  const headers: Record<string, string> = {
    "User-Agent": "National-Urology-Center",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const foldersToCheck =
      folder === "blog" || folder === "blogs" ? ["blog", "blogs"] : [folder];
    for (const f of foldersToCheck) {
      for (const ext of ["md", "mdx"]) {
        // Try direct raw URL first (fastest, requires no token for public repo)
        const rawRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/${f}/${encodeURIComponent(cleanSlug)}.${ext}`,
          {
            cache: "no-store",
            next: { revalidate: 0 },
            headers,
          },
        ).catch(() => null);

        if (rawRes && rawRes.ok) {
          const fileContents = await rawRes.text();
          if (fileContents && fileContents.trim().length > 0) {
            const { data, content } = matter(fileContents);
            return {
              slug: cleanSlug,
              frontmatter: data as T,
              content,
            };
          }
        }

        // Try GitHub API if raw URL didn't return content
        const ghRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/content/${f}/${encodeURIComponent(cleanSlug)}.${ext}?ref=${branch}`,
          {
            cache: "no-store",
            next: { revalidate: 0 },
            headers: {
              ...headers,
              Accept: "application/vnd.github.v3.raw",
            },
          },
        ).catch(() => null);
        if (ghRes && ghRes.ok) {
          const fileContents = await ghRes.text();
          if (fileContents && fileContents.trim().length > 0) {
            const { data, content } = matter(fileContents);
            return {
              slug: cleanSlug,
              frontmatter: data as T,
              content,
            };
          }
        }
      }
    }
  } catch {
    console.warn(
      `Could not fetch ${folder}/${cleanSlug} from GitHub, falling back to local fs`,
    );
  }

  try {
    const dirPath =
      resolveFolderPath(folder) || path.join(contentDirectory, folder);
    let fullPath = path.join(dirPath, `${cleanSlug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(dirPath, `${cleanSlug}.md`);
    }

    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: cleanSlug,
      frontmatter: data as T,
      content,
    };
  } catch (error) {
    console.error(`Error reading MDX file: ${folder}/${cleanSlug}`, error);
    return null;
  }
}

export async function getAllMdx<T>(folder: string): Promise<MdxFile<T>[]> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  const ghItemsMap = new Map<string, MdxFile<T>>();

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
        for (const item of validResults) {
          if (item) ghItemsMap.set(item.slug, item);
        }
      }
    }
  } catch {
    // Ignore fs errors, fall back to GitHub API
  }

  // Fallback to GitHub API (works at runtime in Edge Workers even without GITHUB_TOKEN)
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "National-Urology-Center",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const foldersToCheck =
      folder === "blog" || folder === "blogs" ? ["blog", "blogs"] : [folder];
    for (const f of foldersToCheck) {
      const ghRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/content/${f}?ref=${branch}`,
        {
          cache: "no-store",
          next: { revalidate: 0 },
          headers,
        },
      ).catch(() => null);
      if (ghRes && ghRes.ok) {
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
                `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${fileObj.path}`,
                {
                  cache: "no-store",
                  next: { revalidate: 0 },
                  headers: token
                    ? {
                        Authorization: `Bearer ${token}`,
                        "User-Agent": "National-Urology-Center",
                      }
                    : { "User-Agent": "National-Urology-Center" },
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
          for (const item of items) {
            if (item) ghItemsMap.set(item.slug, item);
          }
        }
      }
    }
  } catch {
    console.warn(`Could not fetch all ${folder} from GitHub API`);
  }

  const files = getMdxFiles(folder);
  const localResults = await Promise.all(
    files.map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      if (ghItemsMap.has(slug)) return Promise.resolve(null);
      return getMdxBySlug<T>(folder, slug);
    }),
  );

  for (const item of localResults) {
    if (item && !ghItemsMap.has(item.slug)) {
      ghItemsMap.set(item.slug, item);
    }
  }

  const validResults = Array.from(ghItemsMap.values());
  validResults.sort((a, b) => {
    const dateA =
      (a.frontmatter as unknown as { date?: string }).date || "2026-07-08";
    const dateB =
      (b.frontmatter as unknown as { date?: string }).date || "2026-07-08";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  return validResults;
}
