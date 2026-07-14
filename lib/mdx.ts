import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getCloudEnv } from "@/lib/env";

const contentDirectory = path.join(process.cwd(), 'content');

export interface MdxFile<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

function resolveFolderPath(folder: string): string | null {
  if (folder === 'blogs' || folder === 'blog') {
    const blogPath = path.join(contentDirectory, 'blog');
    const blogsPath = path.join(contentDirectory, 'blogs');
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
  return fs.readdirSync(dirPath).filter((file) => path.extname(file) === '.mdx' || path.extname(file) === '.md');
}

export async function getMdxBySlug<T>(folder: string, slug: string): Promise<MdxFile<T> | null> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  if (token) {
    try {
      for (const ext of ["md", "mdx"]) {
        const ghRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/${folder}/${slug}.${ext}?_ts=${Date.now()}`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        if (ghRes.ok) {
          const fileContents = await ghRes.text();
          const { data, content } = matter(fileContents);
          return {
            slug,
            frontmatter: data as T,
            content,
          };
        }
      }
    } catch {
      console.warn(`Could not fetch ${folder}/${slug} from GitHub API, falling back to local fs`);
    }
  }

  try {
    const dirPath = resolveFolderPath(folder) || path.join(contentDirectory, folder);
    let fullPath = path.join(dirPath, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(dirPath, `${slug}.md`);
    }
    
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontmatter: data as T,
      content,
    };
  } catch (error) {
    console.error(`Error reading MDX file: ${folder}/${slug}`, error);
    return null;
  }
}

export async function getAllMdx<T>(folder: string): Promise<MdxFile<T>[]> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  if (token) {
    try {
      const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content/${folder}?ref=${branch}&_ts=${Date.now()}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "National-Urology-Center",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      if (ghRes.ok) {
        const ghFiles = (await ghRes.json().catch(() => ([]))) as Array<{ name?: string; download_url?: string }>;
        if (Array.isArray(ghFiles)) {
          const mdFiles = ghFiles.filter((f) => f && f.name && (f.name.endsWith(".md") || f.name.endsWith(".mdx")) && f.download_url);
          const items = await Promise.all(
            mdFiles.map(async (fileObj) => {
              const raw = await fetch(`${fileObj.download_url}?_ts=${Date.now()}`, {
                cache: "no-store",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                },
              }).then((r) => r.text()).catch(() => "");
              if (!raw) return null;
              const { data, content } = matter(raw);
              const slug = (fileObj.name || "").replace(/\.mdx?$/, "");
              return {
                slug,
                frontmatter: data as T,
                content,
              };
            })
          );
          const validItems = items.filter((item): item is MdxFile<T> => item !== null);
          validItems.sort((a, b) => {
            const dateA = (a.frontmatter as unknown as { date?: string }).date || "2026-07-08";
            const dateB = (b.frontmatter as unknown as { date?: string }).date || "2026-07-08";
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          return validItems;
        }
      }
    } catch {
      console.warn(`Could not fetch all ${folder} from GitHub API, falling back to local fs`);
    }
  }

  const files = getMdxFiles(folder);
  const results = await Promise.all(
    files.map((file) => {
      const slug = file.replace(/\.mdx?$/, '');
      return getMdxBySlug<T>(folder, slug);
    })
  );
  const validResults = results.filter((file): file is MdxFile<T> => file !== null);
  validResults.sort((a, b) => {
    const dateA = (a.frontmatter as unknown as { date?: string }).date || "2026-07-08";
    const dateB = (b.frontmatter as unknown as { date?: string }).date || "2026-07-08";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
  return validResults;
}
