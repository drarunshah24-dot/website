import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { saveToGitHub, deleteFromGitHub } from "@/lib/github";
import { checkAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { getCloudEnv } from "@/lib/env";

const contentDir = path.join(process.cwd(), "content");
const settingsFile = path.join(contentDir, "settings.json");

export async function GET(req: Request) {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  const reqLogger = logger.child({ requestId: reqId });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "blog"; // 'blog' | 'books' | 'gallery' | 'settings'

    reqLogger.info(
      { event: "content_fetch_started", type },
      `Fetching content of type: ${type}`,
    );

    if (type === "settings") {
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
        return NextResponse.json({ success: true, settings: defaultSettings });
      }
      const settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
      return NextResponse.json({ success: true, settings });
    }

    const folderPath = path.join(contentDir, type);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      return NextResponse.json({ success: true, items: [] });
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
          data.category || (type === "books" ? "Publication" : "Facility"),
        draft: Boolean(data.draft),
        image: data.image || data.cover || "",
        description: data.description || "",
        body: content,
      };
    });

    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json({ success: true, items });
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
      { status: 500 },
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
            { success: false, error: ghRes.error },
            { status: 500 },
          );
        }
      } else if (!localSuccess) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Filesystem is read-only. Please add GITHUB_TOKEN to your Environment Variables to save permanently.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true });
    }

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: "Slug and title are required" },
        { status: 400 },
      );
    }

    const folderPath = path.join(contentDir, type || "blog");
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const ext = type === "books" || type === "gallery" ? "mdx" : "md";
    const filePath = path.join(folderPath, `${cleanSlug}.${ext}`);
    const relativeGitHubPath = `content/${type || "blog"}/${cleanSlug}.${ext}`;

    const frontmatter: Record<string, unknown> = {
      title,
      date: date || new Date().toISOString().split("T")[0],
    };

    if (type === "books") {
      if (image) frontmatter.cover = image;
      if (description) frontmatter.description = description;
    } else if (type === "gallery") {
      if (image) frontmatter.image = image;
    } else {
      frontmatter.author = author || "Dr. Arun Shah";
      frontmatter.category = category || "General Urology";
      frontmatter.draft = Boolean(draft);
      if (image) frontmatter.image = image;
    }

    const fileContent = matter.stringify(content || "", frontmatter);

    let localSuccess = false;
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      fs.writeFileSync(filePath, fileContent, "utf8");
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
      if (!ghRes.success && !localSuccess) {
        return NextResponse.json(
          { success: false, error: ghRes.error },
          { status: 500 },
        );
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Filesystem is read-only. Please add GITHUB_TOKEN to your Environment Variables to commit directly to GitHub.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, slug: cleanSlug });
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
      { status: 500 },
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
        { status: 400 },
      );
    }

    const folderPath = path.join(contentDir, type);
    const filePathMd = path.join(folderPath, `${slug}.md`);
    const filePathMdx = path.join(folderPath, `${slug}.mdx`);

    const ext = type === "books" || type === "gallery" ? "mdx" : "md";

    let localSuccess = false;
    try {
      if (fs.existsSync(filePathMd)) {
        fs.unlinkSync(filePathMd);
        localSuccess = true;
      } else if (fs.existsSync(filePathMdx)) {
        fs.unlinkSync(filePathMdx);
        localSuccess = true;
      }
    } catch {
      // Filesystem is read-only on Cloudflare Pages / Serverless
      localSuccess = false;
    }

    const token = await getCloudEnv("GITHUB_TOKEN");
    if (token) {
      // First try deleting with expected extension, then fallback to alternate extension
      const relPath = `content/${type}/${slug}.${ext}`;
      const altPath = `content/${type}/${slug}.${ext === "md" ? "mdx" : "md"}`;
      const ghRes = await deleteFromGitHub(
        relPath,
        `Delete ${type}: ${slug} via Admin Portal`,
      );
      if (!ghRes.success) {
        const ghAltRes = await deleteFromGitHub(
          altPath,
          `Delete ${type}: ${slug} via Admin Portal`,
        );
        if (!ghAltRes.success && !localSuccess) {
          return NextResponse.json(
            {
              success: false,
              error: ghRes.error || "Failed to delete item from GitHub",
            },
            { status: 500 },
          );
        }
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Filesystem read-only. Please add GITHUB_TOKEN in Cloudflare Pages Environment Variables to delete items.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
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
      { status: 500 },
    );
  }
}
