import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const authError = await checkAuth(req);
  if (authError) return authError;

  return NextResponse.json({ success: true });
}
