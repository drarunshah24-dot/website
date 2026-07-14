import { NextResponse } from "next/server";

export function checkAuth(req: Request): NextResponse | null {
  const authHeader = req.headers.get("Authorization");
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

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
