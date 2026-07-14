import { NextResponse } from "next/server";
import { getCloudEnv } from "@/lib/env";

export async function checkAuth(req: Request): Promise<NextResponse | null> {
  const authHeader = req.headers.get("Authorization");
  const expectedPassword = (await getCloudEnv("ADMIN_PASSWORD")) || "admin123";

  if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
    return new NextResponse(
      JSON.stringify({ success: false, error: "Unauthorized. Invalid or missing password." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return null; // Auth succeeded
}
