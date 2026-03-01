import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { queryKnowledge, isQuotaError } from "@/lib/ai";
import { MAX_QUERY_LENGTH } from "@/lib/validation";
import { rateLimit, getClientIp, AI_RATE_LIMIT } from "@/lib/rate-limit";
import { getCurrentUserId } from "@/lib/auth-helpers";

// POST /api/ai/query - Conversational query of the knowledge base
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit
    const clientIp = getClientIp(request);
    const rl = rateLimit(`ai-query:${clientIp}`, AI_RATE_LIMIT);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    if (question.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: `Question must be under ${MAX_QUERY_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Fetch user's knowledge items for context
    const items = await prisma.knowledgeItem.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit context window
    });

    if (items.length === 0) {
      return NextResponse.json({
        answer:
          "Your knowledge base is empty. Start by capturing some notes, links, or insights!",
        sources: [],
      });
    }

    const answer = await queryKnowledge(question, items);

    // Extract potential source references (items mentioned in the answer)
    const sources = items
      .filter(
        (item) =>
          answer.toLowerCase().includes(item.title.toLowerCase()) ||
          answer.includes(`[${items.indexOf(item) + 1}]`)
      )
      .slice(0, 5)
      .map((item) => ({ id: item.id, title: item.title }));

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error("POST /api/ai/query error:", error);
    if (isQuotaError(error)) {
      return NextResponse.json(
        { error: "AI quota exceeded. Please wait a minute and try again, or upgrade your Gemini API plan." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Failed to query knowledge base. AI service may be unavailable." },
      { status: 500 }
    );
  }
}
