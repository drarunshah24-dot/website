import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveToGitHub } from "@/lib/github";
import { checkAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { getCloudEnv } from "@/lib/env";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

      const buffer = Buffer.from(cleanBase64, "base64");
      const isHero = filename === "dr-arun-shah-urologist-janakpur.jpg";
      const targetDir = isHero
        ? path.join(process.cwd(), "public")
        : path.join(process.cwd(), "public", "images");
      const targetPath = isHero
        ? "public/dr-arun-shah-urologist-janakpur.jpg"
        : `public/images/${filename}`;
      const publicUrl = isHero
        ? `/dr-arun-shah-urologist-janakpur.jpg?v=${Date.now()}`
        : `/images/${filename}`;

      // Always save locally first so the running server immediately serves the uploaded image
      let localSuccess = false;
      try {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(path.join(targetDir, filename), buffer);
        localSuccess = true;
      } catch (_localErr) {
        console.warn("Could not save file locally:", _localErr);
      }

      const token = await getCloudEnv("GITHUB_TOKEN");
      const owner = (await getCloudEnv("GITHUB_OWNER")) || "drarunshah24-dot";
      const repo = (await getCloudEnv("GITHUB_REPO")) || "website";
      const branch = (await getCloudEnv("GITHUB_BRANCH")) || "main";

      const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`;

      // If GITHUB_TOKEN is available, upload directly to GitHub REST API
      if (token) {
        const getSha = async () => {
          try {
            const checkRes = await fetch(`${githubApiUrl}?ref=${branch}&_ts=${Date.now()}`, {
              cache: "no-store",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "National-Urology-Center-Admin",
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
            if (checkRes.ok) {
              const checkData = await checkRes.json().catch(() => ({}));
              return checkData.sha as string | undefined;
            }
          } catch (_e) {
            console.warn("Could not check existing file SHA:", _e);
          }
          return undefined;
        };

        const sha = await getSha();

        let putRes = await fetch(githubApiUrl, {
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

        if (putRes.status === 409 || putRes.status === 422) {
          const latestSha = await getSha();
          putRes = await fetch(githubApiUrl, {
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
              ...(latestSha ? { sha: latestSha } : {}),
            }),
          });
        }

        if (!putRes.ok) {
          const errText = await putRes.text().catch(() => "Unknown error");
          let errMsg = errText;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.message) errMsg = errJson.message;
          } catch {
            // use plain text
          }
          if (!localSuccess) {
            return NextResponse.json(
              { success: false, error: errMsg || "GitHub API PUT request failed and local save failed." },
              { status: putRes.status }
            );
          }
        }

        const putData = await putRes.json().catch(() => ({}));
        revalidatePath("/", "layout");
        revalidatePath("/admin", "layout");
        revalidatePath("/blog", "layout");
        revalidatePath("/books", "layout");
        revalidatePath("/treatments", "layout");
        revalidatePath("/conditions", "layout");
        return NextResponse.json({
          success: true,
          url: publicUrl,
          rawUrl: putData.content?.download_url
            ? `${putData.content.download_url}?_ts=${Date.now()}`
            : publicUrl,
          fileName: filename,
          github: putData.content?.html_url,
        });
      }

      if (!localSuccess) {
        return NextResponse.json(
          { success: false, error: "GITHUB_TOKEN not set and local save failed." },
          { status: 500 }
        );
      }

      revalidatePath("/", "layout");
      revalidatePath("/admin", "layout");
      revalidatePath("/blog", "layout");
      revalidatePath("/books", "layout");
      revalidatePath("/treatments", "layout");
      revalidatePath("/conditions", "layout");
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: filename,
      });
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

    if (targetName === "dr-arun-shah-urologist-janakpur.jpg" || file.name === "dr-arun-shah-urologist-janakpur.jpg") {
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
      if (!ghRes.success && !localSuccess) {
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
      fileName === "dr-arun-shah-urologist-janakpur.jpg"
        ? `/dr-arun-shah-urologist-janakpur.jpg?v=${Date.now()}`
        : `/images/${fileName}`;

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/blog", "layout");
    revalidatePath("/books", "layout");
    revalidatePath("/treatments", "layout");
    revalidatePath("/conditions", "layout");
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
