import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { queryKnowledge } from "@/lib/ai";
import { MAX_QUERY_LENGTH } from "@/lib/validation";
import { rateLimit, getClientIp, PUBLIC_API_RATE_LIMIT } from "@/lib/rate-limit";

// GET /api/public/brain/query?q={question} - Public query endpoint
export async function GET(request: NextRequest) {
  try {
    // Rate limit public API more aggressively
    const clientIp = getClientIp(request);
    const rl = rateLimit(`public:${clientIp}`, PUBLIC_API_RATE_LIMIT);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const question = searchParams.get("q");

    if (!question) {
      return NextResponse.json(
        {
          error: "Missing 'q' query parameter",
          usage: "GET /api/public/brain/query?q=your+question+here",
          example: "/api/public/brain/query?q=What+are+my+latest+insights",
        },
        { status: 400 }
      );
    }

    if (question.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: `Query must be under ${MAX_QUERY_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Fetch knowledge items
    const items = await prisma.knowledgeItem.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        type: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (items.length === 0) {
      return NextResponse.json({
        answer: "The knowledge base is currently empty.",
        sources: [],
        meta: { totalItems: 0, query: question },
      });
    }

    const answer = await queryKnowledge(question, items);

    // Extract sources
    const sources = items
      .filter(
        (item) =>
          answer.toLowerCase().includes(item.title.toLowerCase()) ||
          answer.includes(`[${items.indexOf(item) + 1}]`)
      )
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        createdAt: item.createdAt,
      }));

    return NextResponse.json({
      answer,
      sources,
      meta: {
        totalItems: items.length,
        query: question,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Public brain query error:", error);
    return NextResponse.json(
      {
        error: "Failed to process query. AI service may be unavailable.",
      },
      { status: 500 }
    );
  }
}
