import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSummary, generateTags } from "@/lib/ai";
import { getRandomTagColor } from "@/lib/utils";
import { validateKnowledgeInput, isValidItemType } from "@/lib/validation";
import { rateLimit, getClientIp, AI_RATE_LIMIT } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";
import { getCurrentUserId } from "@/lib/auth-helpers";

// GET /api/knowledge - List all items with search, filter, sort, pagination
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const tag = searchParams.get("tag") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    // Validate type filter if provided
    if (type && !isValidItemType(type)) {
      return NextResponse.json(
        { error: "Invalid type filter" },
        { status: 400 }
      );
    }

    // Build where clause — scoped to current user
    const where: Prisma.KnowledgeItemWhereInput = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.type = type as Prisma.EnumItemTypeFilter;
    }

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    // Build orderBy
    const validSorts = ["newest", "oldest", "title"];
    const safeSort = validSorts.includes(sort) ? sort : "newest";
    let orderBy: Prisma.KnowledgeItemOrderByWithRelationInput = { createdAt: "desc" };
    if (safeSort === "oldest") orderBy = { createdAt: "asc" };
    if (safeSort === "title") orderBy = { title: "asc" };

    const [items, totalCount] = await Promise.all([
      prisma.knowledgeItem.findMany({
        where,
        orderBy,
        include: { tags: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.knowledgeItem.count({ where }),
    ]);

    // Only return tags used by this user's items
    const tags = await prisma.tag.findMany({
      where: { items: { some: { userId } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      items,
      tags,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge items" },
      { status: 500 }
    );
  }
}

// POST /api/knowledge - Create a new item
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit AI-heavy creation
    const clientIp = getClientIp(request);
    const body = await request.json();
    const { title, content, type, sourceUrl, tags, autoSummarize, autoTag } =
      body;

    // Validate input
    const validationErrors = validateKnowledgeInput({ title, content, type, sourceUrl, tags });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Rate limit AI operations more aggressively
    if (autoSummarize || autoTag) {
      const rl = rateLimit(`ai:${clientIp}`, AI_RATE_LIMIT);
      if (!rl.success) {
        return NextResponse.json(
          { error: "AI rate limit exceeded. Please try again later." },
          { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
        );
      }
    }

    // Process tags
    let allTags: string[] = tags || [];

    // Auto-tag with AI if requested
    if (autoTag) {
      try {
        const aiTags = await generateTags(title, content);
        allTags = [...new Set([...allTags, ...aiTags])];
      } catch (e) {
        console.error("Auto-tag failed:", e);
      }
    }

    // Generate summary if requested
    let summary = null;
    if (autoSummarize) {
      try {
        summary = await generateSummary(content);
      } catch (e) {
        console.error("Summary failed:", e);
      }
    }

    // Create or connect tags using upsert to prevent race conditions
    const tagConnections = await Promise.all(
      allTags.map(async (tagName: string) => {
        const name = tagName.trim().toLowerCase();
        if (!name) return null;
        const tag = await prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name, color: getRandomTagColor() },
        });
        return { id: tag.id };
      })
    );

    const validTagConnections = tagConnections.filter(
      (t): t is { id: string } => t !== null
    );

    const item = await prisma.knowledgeItem.create({
      data: {
        title: title.trim(),
        content,
        type: type || "NOTE",
        sourceUrl: sourceUrl || null,
        summary,
        userId,
        tags: { connect: validTagConnections },
      },
      include: { tags: true },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/knowledge error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge item" },
      { status: 500 }
    );
  }
}
