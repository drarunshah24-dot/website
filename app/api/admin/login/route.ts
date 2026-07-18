import { NextResponse } from "next/server";
import { getCloudEnv } from "@/lib/env";
import { cookies } from "next/headers";
import { getRedisClient } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Initialize Redis & Rate Limiter (if configured)
    const redis = await getRedisClient();

    if (redis) {
      // Limit to 5 requests per 15 minutes per IP address
      const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
      });

      // Get IP address from headers (works on Vercel)
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `login_ratelimit_${ip}`,
      );

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: "Too many login attempts. Please try again in 15 minutes.",
            rateLimitState: { limit, reset, remaining },
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const { password } = await req.json();
    const expectedPassword = await getCloudEnv("ADMIN_PASSWORD");

    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, error: "Authentication not configured on server" },
        { status: 500 },
      );
    }

    // Security Hardening: Artificial delay to mitigate brute-force attacks (Fallback / additional layer)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === expectedPassword) {
      const cookieStore = await cookies();

      // Fallback stateless mode: Use SHA-256 hash of the password
      let sessionValue = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      if (redis) {
        // Stateful mode: Generate UUID and store in Redis
        const sessionId = crypto.randomUUID();

        // Single active session: this overwrites any existing session
        await redis.set("admin_active_session", sessionId);
        sessionValue = sessionId;
      }

      cookieStore.set("admin_session", sessionValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // REMOVED maxAge: 60 * 60 * 24 * 7
        // Without maxAge or expires, this becomes a Session-only cookie (wiped on browser close)
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 },
    );
  } catch (error) {
    console.error("[Login API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
