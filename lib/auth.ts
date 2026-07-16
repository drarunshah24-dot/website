import { NextResponse } from "next/server";
import { getCloudEnv } from "@/lib/env";
import { cookies } from "next/headers";
import { getRedisClient } from "./redis";

export async function checkAuth(req: Request): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;

  const expectedPassword = await getCloudEnv("ADMIN_PASSWORD");

  if (!expectedPassword) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Server configuration error: Authentication not configured.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Check BOTH cookie and Authorization header (for backward compatibility if needed)
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const providedToken = sessionCookie || bearerToken;

  // 1. Initialize Redis (if configured)
  const redis = await getRedisClient();

  if (redis) {
    // Stateful mode: Check if the provided token matches the SINGLE active session in Redis
    const activeSession = await redis.get("admin_active_session");

    if (!providedToken || providedToken !== activeSession) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error:
            "Unauthorized. Session expired or logged in from another device.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } else {
    // Stateless mode (Fallback): Check if the provided token matches the master password directly
    if (providedToken !== expectedPassword) {
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
  }

  return null; // Auth succeeded
}
