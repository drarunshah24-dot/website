import fs from "fs";
import path from "path";
import { getCloudEnv } from "@/lib/env";

export async function getPageContent<T>(
  pageName: string,
  defaultValue: T,
): Promise<T> {
  const cleanPage = pageName.replace(/\.json$/, "");

  // Try reading local fs first
  try {
    if (typeof process !== "undefined" && typeof process.cwd === "function") {
      const filePath = path.join(process.cwd(), "content", `${cleanPage}.json`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(fileContent);
        return { ...defaultValue, ...parsed };
      }
    }
  } catch (err) {
    console.warn(`Local fs read failed for content/${cleanPage}.json:`, err);
  }

  // Fallback to GitHub API / Raw URL
  try {
    const token = await getCloudEnv("GITHUB_TOKEN");
    const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
    const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
    const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

    const headers: Record<string, string> = {
      "User-Agent": "National-Urology-Center",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const rawRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/${cleanPage}.json`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
        headers,
      },
    ).catch(() => null);

    if (rawRes && rawRes.ok) {
      const text = await rawRes.text();
      if (text && text.trim().length > 0) {
        const parsed = JSON.parse(text);
        return { ...defaultValue, ...parsed };
      }
    }
  } catch (err) {
    console.warn(`GitHub fetch failed for content/${cleanPage}.json:`, err);
  }

  return defaultValue;
}
