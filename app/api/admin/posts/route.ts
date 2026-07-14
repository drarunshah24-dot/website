import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const blogDirectory = path.join(process.cwd(), "content", "blog");

export async function GET() {
  try {
    try {
      if (!fs.existsSync(blogDirectory)) {
        fs.mkdirSync(blogDirectory, { recursive: true });
      }
    } catch {}

    const files = fs.readdirSync(blogDirectory).filter(file => file.endsWith(".md") || file.endsWith(".mdx"));
    const posts = files.map(file => {
      const filePath = path.join(blogDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled Article",
        date: data.date || "2026-07-06",
        author: data.author || "Dr. Arun Shah",
        category: data.category || "General Urology",
        draft: Boolean(data.draft),
        image: data.image || "",
        body: content,
        content: content,
      };
    });

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, date, author, category, draft, image, content } = body;

    if (!slug || !title) {
      return NextResponse.json({ success: false, error: "Missing required fields slug or title" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    const filePath = path.join(blogDirectory, `${cleanSlug}.md`);

    const frontmatterObj: Record<string, unknown> = {
      title,
      date: date || new Date().toISOString().split("T")[0],
      author: author || "Dr. Arun Shah",
      category: category || "General Urology",
      draft: Boolean(draft),
    };

    if (image) {
      frontmatterObj.image = image;
    }

    const fileContent = matter.stringify(content !== undefined ? content : (body.body || ""), frontmatterObj);

    try {
      if (!fs.existsSync(blogDirectory)) {
        fs.mkdirSync(blogDirectory, { recursive: true });
      }
      fs.writeFileSync(filePath, fileContent, "utf8");
    } catch {}

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/blog", "layout");

    return NextResponse.json({ success: true, slug: cleanSlug });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ success: false, error: "Failed to save post" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing slug parameter" }, { status: 400 });
    }

    const filePathMd = path.join(blogDirectory, `${slug}.md`);
    const filePathMdx = path.join(blogDirectory, `${slug}.mdx`);

    if (fs.existsSync(filePathMd)) {
      fs.unlinkSync(filePathMd);
    } else if (fs.existsSync(filePathMdx)) {
      fs.unlinkSync(filePathMdx);
    } else {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/blog", "layout");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}
