import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSummary, isQuotaError } from "@/lib/ai";
import { MAX_CONTENT_LENGTH } from "@/lib/validation";
import { rateLimit, getClientIp, AI_RATE_LIMIT } from "@/lib/rate-limit";
import { getCurrentUserId } from "@/lib/auth-helpers";

// POST /api/ai/summarize - Generate AI summary for content
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit
    const clientIp = getClientIp(request);
    const rl = rateLimit(`ai-summarize:${clientIp}`, AI_RATE_LIMIT);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { id, content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content must be under ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    const summary = await generateSummary(content);

    // If an ID is provided, update the item in the database (only if owned by user)
    if (id && typeof id === "string") {
      const existing = await prisma.knowledgeItem.findUnique({ where: { id } });
      if (existing && existing.userId === userId) {
        await prisma.knowledgeItem.update({
          where: { id },
          data: { summary },
        });
      }
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("POST /api/ai/summarize error:", error);
    if (isQuotaError(error)) {
      return NextResponse.json(
        { error: "AI quota exceeded. Please wait a minute and try again, or upgrade your Gemini API plan." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate summary. AI service may be unavailable." },
      { status: 500 }
    );
  }
}
