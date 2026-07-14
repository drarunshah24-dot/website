/**
 * Helper to commit files directly to GitHub via GitHub REST API.
 * This enables permanent file uploads and content changes on serverless deployments.
 */

import { getCloudEnv } from "@/lib/env";

export async function saveToGitHub(
  relativePath: string, // e.g. "content/books/my-book.mdx" or "public/uploads/photo.jpg"
  content: string | Buffer,
  commitMessage: string,
): Promise<{ success: boolean; error?: string }> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN environment variable not set",
    };
  }

  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  // Clean relative path leading slash
  const cleanPath = relativePath.replace(/^\/+/, "");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;

  try {
    // 1. Check if file exists on GitHub to obtain its current SHA (required for overwrites)
    let sha: string | undefined;
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (getRes.ok) {
      const getJson = await getRes.json();
      sha = getJson.sha;
    }

    // 2. Convert content to base64
    const base64Content =
      typeof content === "string"
        ? Buffer.from(content, "utf8").toString("base64")
        : content.toString("base64");

    // 3. PUT file to GitHub
    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errJson = await putRes.json();
      console.error("GitHub API error:", errJson);
      return {
        success: false,
        error: errJson.message || "GitHub API PUT failed",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Error saving to GitHub API:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Unknown error committing to GitHub",
    };
  }
}

export async function deleteFromGitHub(
  relativePath: string,
  commitMessage: string,
): Promise<{ success: boolean; error?: string }> {
  const token = await getCloudEnv("GITHUB_TOKEN");
  if (!token) {
    return {
      success: false,
      error: "GITHUB_TOKEN environment variable not set",
    };
  }

  const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
  const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
  const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

  const cleanPath = relativePath.replace(/^\/+/, "");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`;

  try {
    const getRes = await fetch(`${url}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!getRes.ok) {
      return { success: false, error: "File not found on GitHub repository" };
    }

    const getJson = await getRes.json();
    const sha = getJson.sha;

    const delRes = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        sha,
        branch,
      }),
    });

    if (!delRes.ok) {
      const errJson = await delRes.json();
      return {
        success: false,
        error: errJson.message || "GitHub API DELETE failed",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Error deleting from GitHub API:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Unknown error deleting from GitHub",
    };
  }
}
