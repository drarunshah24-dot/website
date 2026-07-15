import { NextResponse } from "next/server";
import { getCloudEnv } from "@/lib/env";
import { cookies } from "next/headers";

export async function checkAuth(req: Request): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;

  const expectedPassword = (await getCloudEnv("ADMIN_PASSWORD")) || "admin123";

  // Check BOTH cookie and Authorization header (for backward compatibility if needed)
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (sessionCookie !== expectedPassword && bearerToken !== expectedPassword) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Unauthorized. Invalid or missing password.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return null; // Auth succeeded
}
