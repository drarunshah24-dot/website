import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { saveToGitHub, deleteFromGitHub } from "@/lib/github";

const contentDir = path.join(process.cwd(), "content");
const settingsFile = path.join(contentDir, "settings.json");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "blog"; // 'blog' | 'books' | 'gallery' | 'settings'

    if (type === "settings") {
      if (!fs.existsSync(settingsFile)) {
        const defaultSettings = {
          heroDoctorPhoto: "/dr-arun-shah-urologist-janakpur.jpg",
          doctorName: "Dr. Arun Shah",
          subtitle: "Senior Urologist & Gold Medalist",
        };
        if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
        fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
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

    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    const items = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled",
        date: data.date || "2026-07-08",
        author: data.author || "Dr. Arun Shah",
        category: data.category || (type === "books" ? "Publication" : "Facility"),
        draft: Boolean(data.draft),
        image: data.image || data.cover || "",
        description: data.description || "",
        body: content,
      };
    });

    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error(`Error fetching ${req.url}:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, slug, title, date, author, category, draft, image, description, content } = body;

    if (type === "settings") {
      const settingsContent = JSON.stringify(body.settings, null, 2);
      let localSuccess = false;
      try {
        if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
        fs.writeFileSync(settingsFile, settingsContent, "utf8");
        localSuccess = true;
      } catch {
        localSuccess = false;
      }

      if (process.env.GITHUB_TOKEN) {
        const ghRes = await saveToGitHub("content/settings.json", settingsContent, "Update settings.json via Admin Portal");
        if (!ghRes.success && !localSuccess) {
          return NextResponse.json({ success: false, error: ghRes.error }, { status: 500 });
        }
      } else if (!localSuccess) {
        return NextResponse.json(
          {
            success: false,
            error: "Vercel Serverless is read-only. Please add GITHUB_TOKEN to your Vercel Environment Variables to save permanently.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    if (!slug || !title) {
      return NextResponse.json({ success: false, error: "Slug and title are required" }, { status: 400 });
    }

    const folderPath = path.join(contentDir, type || "blog");
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
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

    if (process.env.GITHUB_TOKEN) {
      const ghRes = await saveToGitHub(
        relativeGitHubPath,
        fileContent,
        `Update ${type || "blog"}: ${title} via Admin Portal`
      );
      if (!ghRes.success && !localSuccess) {
        return NextResponse.json({ success: false, error: ghRes.error }, { status: 500 });
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Vercel Serverless is read-only. Please add GITHUB_TOKEN to your Vercel Environment Variables to commit directly to GitHub.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug: cleanSlug });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json({ success: false, error: "Failed to save item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "blog";
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing slug parameter" }, { status: 400 });
    }

    const folderPath = path.join(contentDir, type);
    const filePathMd = path.join(folderPath, `${slug}.md`);
    const filePathMdx = path.join(folderPath, `${slug}.mdx`);

    let ext = "md";
    let localSuccess = false;
    if (fs.existsSync(filePathMd)) {
      fs.unlinkSync(filePathMd);
      ext = "md";
      localSuccess = true;
    } else if (fs.existsSync(filePathMdx)) {
      fs.unlinkSync(filePathMdx);
      ext = "mdx";
      localSuccess = true;
    }

    if (process.env.GITHUB_TOKEN) {
      const relativePath = `content/${type}/${slug}.${ext}`;
      await deleteFromGitHub(relativePath, `Delete ${type}: ${slug} via Admin Portal`);
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found or read-only on Vercel. Add GITHUB_TOKEN in Vercel to delete from GitHub.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
