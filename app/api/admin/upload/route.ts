import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveToGitHub } from "@/lib/github";
import { checkAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const reqId = req.headers.get("x-request-id") || crypto.randomUUID();
  const reqLogger = logger.child({ requestId: reqId });

  const authError = checkAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetName = formData.get("targetName") as string | null;

    reqLogger.info({ event: "upload_started", targetName }, "Processing file upload");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileName = targetName;
    let targetDir = path.join(process.cwd(), "public", "uploads");
    let relativeGitHubPath = "public/uploads/";

    if (targetName === "dr-arun-shah-urologist-janakpur.jpg") {
      targetDir = path.join(process.cwd(), "public");
      fileName = "dr-arun-shah-urologist-janakpur.jpg";
      relativeGitHubPath = "public/dr-arun-shah-urologist-janakpur.jpg";
    } else if (!fileName) {
      const timestamp = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
      fileName = `${timestamp}-${cleanName}`;
      relativeGitHubPath = `public/uploads/${fileName}`;
    } else {
      relativeGitHubPath = `public/uploads/${fileName}`;
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

    // If running on Vercel or GITHUB_TOKEN is set, commit directly to GitHub repository!
    if (process.env.GITHUB_TOKEN) {
      const ghRes = await saveToGitHub(
        relativeGitHubPath,
        buffer,
        `Upload image: ${fileName} via Admin Portal`
      );
      if (!ghRes.success && !localSuccess) {
        return NextResponse.json({ success: false, error: ghRes.error }, { status: 500 });
      }
    } else if (!localSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Vercel Serverless is read-only. Please add GITHUB_TOKEN to your Vercel Environment Variables to upload images permanently.",
        },
        { status: 500 }
      );
    }

    const publicUrl = targetName === "dr-arun-shah-urologist-janakpur.jpg"
      ? `/dr-arun-shah-urologist-janakpur.jpg?v=${Date.now()}`
      : `/uploads/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (error: unknown) {
    logger.error(
      { event: "upload_failed", error: error instanceof Error ? error.message : String(error) },
      "Failed to upload image"
    );
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 });
  }
}
