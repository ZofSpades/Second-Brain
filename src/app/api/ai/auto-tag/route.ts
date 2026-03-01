import { NextRequest, NextResponse } from "next/server";
import { generateTags, isQuotaError } from "@/lib/ai";
import { MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH } from "@/lib/validation";
import { rateLimit, getClientIp, AI_RATE_LIMIT } from "@/lib/rate-limit";
import { getCurrentUserId } from "@/lib/auth-helpers";

// POST /api/ai/auto-tag - Generate AI-suggested tags
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit
    const clientIp = getClientIp(request);
    const rl = rateLimit(`ai-tag:${clientIp}`, AI_RATE_LIMIT);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!content && !title) {
      return NextResponse.json(
        { error: "Title or content is required" },
        { status: 400 }
      );
    }

    // Validate lengths
    if (title && (typeof title !== "string" || title.length > MAX_TITLE_LENGTH)) {
      return NextResponse.json(
        { error: `Title must be a string under ${MAX_TITLE_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (content && (typeof content !== "string" || content.length > MAX_CONTENT_LENGTH)) {
      return NextResponse.json(
        { error: `Content must be a string under ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    const tags = await generateTags(title || "", content || "");

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("POST /api/ai/auto-tag error:", error);
    if (isQuotaError(error)) {
      return NextResponse.json(
        { error: "AI quota exceeded. Please wait a minute and try again, or upgrade your Gemini API plan." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate tags. AI service may be unavailable." },
      { status: 500 }
    );
  }
}
