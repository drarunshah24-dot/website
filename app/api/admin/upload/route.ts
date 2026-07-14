import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveToGitHub } from "@/lib/github";
import { checkAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { getCloudEnv } from "@/lib/env";

export async function POST(req: Request) {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  const reqLogger = logger.child({ requestId: reqId });

  const authError = await checkAuth(req);
  if (authError) return authError;

  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle Client-Side Base64 JSON Payload (Cloudflare Pages / Serverless Architecture)
    if (contentType.includes("application/json")) {
      const { filename, base64Content, commitMessage } = await req.json();

      if (!filename || !base64Content) {
        return NextResponse.json(
          { success: false, error: "Missing filename or base64Content in payload" },
          { status: 400 }
        );
      }

      // Clean base64 string if it includes data URI scheme prefix (e.g., "data:image/jpeg;base64,...")
      const cleanBase64 = base64Content.includes(",")
        ? base64Content.split(",")[1]
        : base64Content;

      const token = await getCloudEnv("GITHUB_TOKEN");
      const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
      const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
      const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

      const targetPath = `public/images/${filename}`;
      const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`;

      // If GITHUB_TOKEN is available, upload directly to GitHub REST API
      if (token) {
        // Step 1: Check if file already exists on GitHub to obtain current SHA (needed for updates)
        let sha: string | undefined;
        try {
          const checkRes = await fetch(`${githubApiUrl}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "National-Urology-Center-Admin",
            },
          });
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            sha = checkData.sha;
          }
        } catch (e) {
          console.warn("Could not check existing file SHA:", e);
        }

        // Step 2: Send PUT request to GitHub REST API
        const putRes = await fetch(githubApiUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "National-Urology-Center-Admin",
          },
          body: JSON.stringify({
            message: commitMessage || `Upload image ${filename} via admin`,
            content: cleanBase64,
            branch,
            ...(sha ? { sha } : {}),
          }),
        });

        if (!putRes.ok) {
          const errJson = await putRes.json();
          return NextResponse.json(
            { success: false, error: errJson.message || "GitHub API PUT request failed" },
            { status: putRes.status }
          );
        }

        const putData = await putRes.json();
        return NextResponse.json({
          success: true,
          url: `/images/${filename}`,
          fileName: filename,
          github: putData.content?.html_url,
        });
      }

      // Fallback for local development if GITHUB_TOKEN is not set
      try {
        const buffer = Buffer.from(cleanBase64, "base64");
        const targetDir = path.join(process.cwd(), "public", "images");
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(path.join(targetDir, filename), buffer);
        return NextResponse.json({
          success: true,
          url: `/images/${filename}`,
          fileName: filename,
        });
      } catch (err) {
        return NextResponse.json(
          { success: false, error: "GITHUB_TOKEN not set and local save failed." },
          { status: 500 }
        );
      }
    }

    // 2. Handle FormData (Multipart) Uploads
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetName = formData.get("targetName") as string | null;

    reqLogger.info(
      { event: "upload_started", targetName },
      "Processing file upload",
    );

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileName = targetName;
    let targetDir = path.join(process.cwd(), "public", "images");
    let relativeGitHubPath = "public/images/";

    if (targetName === "dr-arun-shah-urologist-janakpur.jpg") {
      targetDir = path.join(process.cwd(), "public");
      fileName = "dr-arun-shah-urologist-janakpur.jpg";
      relativeGitHubPath = "public/dr-arun-shah-urologist-janakpur.jpg";
    } else if (!fileName) {
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
      fileName = `${timestamp}-${cleanName}`;
      relativeGitHubPath = `public/images/${fileName}`;
    } else {
      relativeGitHubPath = `public/images/${fileName}`;
    }

    let localSuccess = false;
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, fileName);
      fs.writeFileSync(filePath, buffer);
      localSuccess = true;
    } catch {
      localSuccess = false;
    }

    const token = await getCloudEnv("GITHUB_TOKEN");
    if (token) {
      const ghRes = await saveToGitHub(
        relativeGitHubPath,
        buffer,
        `Upload image: ${fileName} via Admin Portal`,
      );
      if (!ghRes.success) {
        return NextResponse.json(
          { success: false, error: "GitHub image commit failed: " + ghRes.error },
          { status: 500 },
        );
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Serverless filesystem is read-only. Add GITHUB_TOKEN to upload images permanently.",
        },
        { status: 500 },
      );
    }

    const publicUrl =
      targetName === "dr-arun-shah-urologist-janakpur.jpg"
        ? `/dr-arun-shah-urologist-janakpur.jpg?v=${Date.now()}`
        : `/images/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (error: unknown) {
    logger.error(
      {
        event: "upload_failed",
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to upload image",
    );
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
