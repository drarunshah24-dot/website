import { NextResponse } from "next/server";
import { getCloudEnv } from "@/lib/env";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const expectedPassword =
      (await getCloudEnv("ADMIN_PASSWORD")) || "admin123";

    if (password === expectedPassword) {
      const cookieStore = await cookies();
      cookieStore.set("admin_session", password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
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
