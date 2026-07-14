import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { saveToGitHub, deleteFromGitHub } from "@/lib/github";
import { checkAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { getCloudEnv } from "@/lib/env";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const contentDir = path.join(process.cwd(), "content");
const settingsFile = path.join(contentDir, "settings.json");

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function GET(req: Request) {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  const reqLogger = logger.child({ requestId: reqId });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "blog"; // 'blog' | 'books' | 'gallery' | 'treatments' | 'conditions' | 'faq' | 'settings'

    reqLogger.info(
      { event: "content_fetch_started", type },
      `Fetching content of type: ${type}`,
    );

    const token = await getCloudEnv("GITHUB_TOKEN");
    const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
    const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
    const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

    if (type === "settings") {
      if (token) {
        try {
          const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content/settings.json?ref=${branch}&_ts=${Date.now()}`, {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "National-Urology-Center-Admin",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });
          if (ghRes.ok) {
            const ghJson = (await ghRes.json().catch(() => ({}))) as { content?: string };
            if (ghJson.content) {
              const decoded = Buffer.from(ghJson.content, "base64").toString("utf8");
              const settings = JSON.parse(decoded);
              return NextResponse.json({ success: true, settings }, { headers: NO_CACHE_HEADERS });
            }
          }
        } catch (e) {
          reqLogger.warn({ error: e instanceof Error ? e.message : String(e) }, "Could not fetch settings.json from GitHub API, falling back to local fs");
        }
      }
      if (!fs.existsSync(settingsFile)) {
        const defaultSettings = {
          heroDoctorPhoto: "/dr-arun-shah-urologist-janakpur.jpg",
          doctorName: "Dr. Arun Shah",
          subtitle: "Senior Urologist & Gold Medalist",
        };
        if (!fs.existsSync(contentDir))
          fs.mkdirSync(contentDir, { recursive: true });
        fs.writeFileSync(
          settingsFile,
          JSON.stringify(defaultSettings, null, 2),
        );
        return NextResponse.json(
          { success: true, settings: defaultSettings },
          { headers: NO_CACHE_HEADERS }
        );
      }
      const settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
      return NextResponse.json({ success: true, settings }, { headers: NO_CACHE_HEADERS });
    }

    if (token) {
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/content/${type}?ref=${branch}&_ts=${Date.now()}`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "National-Urology-Center-Admin",
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
                const { data, content } = matter(raw);
                return {
                  slug: (fileObj.name || "").replace(/\.mdx?$/, ""),
                  title: data.title || "Untitled",
                  date: data.date || "2026-07-08",
                  author: data.author || "Dr. Arun Shah",
                  category:
                    data.category ||
                    (type === "books"
                      ? "Publication"
                      : type === "gallery"
                      ? "Facility"
                      : type === "treatments"
                      ? "Treatment"
                      : type === "conditions"
                      ? "Condition"
                      : type === "faq"
                      ? "Patient Care"
                      : "General Urology"),
                  draft: Boolean(data.draft),
                  image: data.image || data.cover || "",
                  description: data.description || data.summary || "",
                  body: content,
                  content: content,
                };
              })
            );
            items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return NextResponse.json({ success: true, items }, { headers: NO_CACHE_HEADERS });
          }
        }
      } catch (e) {
        reqLogger.warn({ error: e instanceof Error ? e.message : String(e) }, `Could not fetch ${type} from GitHub API, falling back to local fs`);
      }
    }

    const folderPath = path.join(contentDir, type);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      return NextResponse.json({ success: true, items: [] }, { headers: NO_CACHE_HEADERS });
    }

    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    const items = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled",
        date: data.date || "2026-07-08",
        author: data.author || "Dr. Arun Shah",
        category:
          data.category ||
          (type === "books"
            ? "Publication"
            : type === "gallery"
            ? "Facility"
            : type === "treatments"
            ? "Treatment"
            : type === "conditions"
            ? "Condition"
            : type === "faq"
            ? "Patient Care"
            : "General Urology"),
        draft: Boolean(data.draft),
        image: data.image || data.cover || "",
        description: data.description || data.summary || "",
        body: content,
        content: content,
      };
    });

    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json({ success: true, items }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    logger.error(
      {
        event: "content_fetch_failed",
        url: req.url,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to fetch content",
    );
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}

export async function POST(req: Request) {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  const reqLogger = logger.child({ requestId: reqId });

  const authError = await checkAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const {
      type,
      slug,
      title,
      date,
      author,
      category,
      draft,
      image,
      description,
      content,
    } = body;
    reqLogger.info(
      { event: "content_save_started", type, slug },
      `Saving content: ${slug}`,
    );

    if (type === "settings") {
      const settingsContent = JSON.stringify(body.settings, null, 2);
      let localSuccess = false;
      try {
        if (!fs.existsSync(contentDir))
          fs.mkdirSync(contentDir, { recursive: true });
        fs.writeFileSync(settingsFile, settingsContent, "utf8");
        localSuccess = true;
      } catch {
        localSuccess = false;
      }

      const token = await getCloudEnv("GITHUB_TOKEN");
      if (token) {
        const ghRes = await saveToGitHub(
          "content/settings.json",
          settingsContent,
          "Update settings.json via Admin Portal",
        );
        if (!ghRes.success && !localSuccess) {
          return NextResponse.json(
            { success: false, error: "GitHub commit failed: " + ghRes.error },
            { status: 500, headers: NO_CACHE_HEADERS },
          );
        }
      } else if (!localSuccess) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Filesystem is read-only. Please add GITHUB_TOKEN to your Environment Variables to save permanently.",
          },
          { status: 500, headers: NO_CACHE_HEADERS },
        );
      }

      revalidatePath("/", "layout");
      revalidatePath("/admin", "layout");
      return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
    }

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: "Slug and title are required" },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }

    const folderPath = path.join(contentDir, type || "blog");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Determine extension: if file already exists with .mdx or .md, keep it or use standard ext
    const existingMdxPath = path.join(folderPath, `${cleanSlug}.mdx`);
    const existingMdPath = path.join(folderPath, `${cleanSlug}.md`);
    let ext = "md";
    if (fs.existsSync(existingMdxPath)) {
      ext = "mdx";
    } else if (fs.existsSync(existingMdPath)) {
      ext = "md";
    } else {
      ext =
        type === "books" ||
        type === "gallery" ||
        type === "treatments" ||
        type === "conditions"
          ? "mdx"
          : "md";
    }

    const filePath = path.join(folderPath, `${cleanSlug}.${ext}`);
    const altExt = ext === "md" ? "mdx" : "md";
    const altFilePath = path.join(folderPath, `${cleanSlug}.${altExt}`);
    const relativeGitHubPath = `content/${type || "blog"}/${cleanSlug}.${ext}`;
    const altRelativeGitHubPath = `content/${type || "blog"}/${cleanSlug}.${altExt}`;

    const frontmatter: Record<string, unknown> = {
      title,
      date: date || new Date().toISOString().split("T")[0],
    };

    if (type === "books") {
      if (image) frontmatter.cover = image;
      if (description) frontmatter.description = description;
    } else if (type === "gallery") {
      if (image) frontmatter.image = image;
      if (description) frontmatter.description = description;
    } else if (type === "treatments" || type === "conditions") {
      if (description) {
        frontmatter.description = description;
        frontmatter.summary = description;
      }
      if (image) frontmatter.image = image;
      if (category) frontmatter.category = category;
    } else if (type === "faq") {
      if (category) frontmatter.category = category;
    } else {
      frontmatter.author = author || "Dr. Arun Shah";
      frontmatter.category = category || "General Urology";
      frontmatter.draft = Boolean(draft);
      if (image) frontmatter.image = image;
      if (description) frontmatter.description = description;
    }

    const fileContent = matter.stringify(content !== undefined ? content : (body.body || ""), frontmatter);

    let localSuccess = false;
    try {
      fs.writeFileSync(filePath, fileContent, "utf8");
      if (fs.existsSync(altFilePath)) {
        fs.unlinkSync(altFilePath);
      }
      localSuccess = true;
    } catch {
      localSuccess = false;
    }

    const token = await getCloudEnv("GITHUB_TOKEN");
    if (token) {
      const ghRes = await saveToGitHub(
        relativeGitHubPath,
        fileContent,
        `Update ${type || "blog"}: ${title} via Admin Portal`,
      );
      // Clean up alternate extension on GitHub if it exists to avoid collisions
      await deleteFromGitHub(altRelativeGitHubPath, `Cleanup old ext ${altExt}`).catch(() => {});
      if (!ghRes.success && !localSuccess) {
        return NextResponse.json(
          { success: false, error: "GitHub commit failed: " + ghRes.error },
          { status: 500, headers: NO_CACHE_HEADERS },
        );
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Filesystem is read-only. Please add GITHUB_TOKEN to your Environment Variables to commit directly to GitHub.",
        },
        { status: 500, headers: NO_CACHE_HEADERS },
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/books", "layout");
    revalidatePath("/treatments", "layout");
    revalidatePath("/conditions", "layout");

    return NextResponse.json({ success: true, slug: cleanSlug }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    logger.error(
      {
        event: "content_save_failed",
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to save item",
    );
    return NextResponse.json(
      { success: false, error: "Failed to save item" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}

export async function DELETE(req: Request) {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  const reqLogger = logger.child({ requestId: reqId });

  const authError = await checkAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "blog";
    const slug = searchParams.get("slug");
    reqLogger.info(
      { event: "content_delete_started", type, slug },
      `Deleting content: ${slug}`,
    );

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing slug parameter" },
        { status: 400, headers: NO_CACHE_HEADERS },
      );
    }

    const folderPath = path.join(contentDir, type);
    const filePathMd = path.join(folderPath, `${slug}.md`);
    const filePathMdx = path.join(folderPath, `${slug}.mdx`);

    let localSuccess = false;
    try {
      if (fs.existsSync(filePathMd)) {
        fs.unlinkSync(filePathMd);
        localSuccess = true;
      }
      if (fs.existsSync(filePathMdx)) {
        fs.unlinkSync(filePathMdx);
        localSuccess = true;
      }
    } catch {
      localSuccess = false;
    }

    const token = await getCloudEnv("GITHUB_TOKEN");
    if (token) {
      const relPathMd = `content/${type}/${slug}.md`;
      const relPathMdx = `content/${type}/${slug}.mdx`;
      const ghResMd = await deleteFromGitHub(
        relPathMd,
        `Delete ${type}: ${slug} via Admin Portal`,
      );
      const ghResMdx = await deleteFromGitHub(
        relPathMdx,
        `Delete ${type}: ${slug} via Admin Portal`,
      );
      if (!ghResMd.success && !ghResMdx.success && !localSuccess) {
        return NextResponse.json(
          {
            success: false,
            error: "GitHub delete failed: Item not found on GitHub or local filesystem",
          },
          { status: 500, headers: NO_CACHE_HEADERS },
        );
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Filesystem read-only. Please add GITHUB_TOKEN in Environment Variables to delete items.",
        },
        { status: 500, headers: NO_CACHE_HEADERS },
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/books", "layout");
    revalidatePath("/treatments", "layout");
    revalidatePath("/conditions", "layout");

    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    logger.error(
      {
        event: "content_delete_failed",
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete item",
    );
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
