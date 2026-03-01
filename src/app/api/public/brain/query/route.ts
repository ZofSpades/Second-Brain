import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, PUBLIC_API_RATE_LIMIT } from "@/lib/rate-limit";

// GET /api/public/brain/query?q={question} - Public query endpoint
// This instance uses authentication — the public API is disabled to protect user data.
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  rateLimit(`public:${clientIp}`, PUBLIC_API_RATE_LIMIT);

  const { searchParams } = new URL(request.url);
  const question = searchParams.get("q");

  if (!question) {
    return NextResponse.json(
      {
        error: "Missing 'q' query parameter",
        usage: "GET /api/public/brain/query?q=your+question+here",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error: "This is a private instance. Sign in at /login to access your personal knowledge base.",
      info: "The public query API is disabled when authentication is enabled to protect user data.",
      query: question,
    },
    { status: 403 }
  );
}
