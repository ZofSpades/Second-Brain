import { NextRequest, NextResponse } from "next/server";

async function getHandlers() {
  try {
    const { handlers } = await import("@/auth");
    return handlers;
  } catch (error) {
    console.error("[auth] Failed to initialize NextAuth:", error);
    return null;
  }
}

function errorResponse() {
  return NextResponse.json(
    {
      error: "Authentication service configuration error",
      hint: "Ensure AUTH_SECRET and DATABASE_URL are set in your environment variables.",
    },
    { status: 500 }
  );
}

export async function GET(req: NextRequest) {
  const handlers = await getHandlers();
  if (!handlers) return errorResponse();
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  const handlers = await getHandlers();
  if (!handlers) return errorResponse();
  return handlers.POST(req);
}
