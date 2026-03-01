# Second Brain — Architecture Documentation

## Overview

Second Brain is an AI-powered knowledge management system built with Next.js 16, React 19, Tailwind CSS v4, Prisma, and Google Gemini. Users register an account, capture notes/links/insights, and use AI to summarise, tag, and query their personal knowledge base.

---

## 1. Portable Architecture

**Clear separation of concerns with swappable components at each layer.**

### Layer Structure
```
Presentation (React Components)
    ↕
API Layer (Next.js App Router API Routes)
    ↕
Business Logic (lib/ai.ts, lib/validation.ts, lib/rate-limit.ts)
    ↕
Data Layer (Prisma ORM → PostgreSQL)
```

### Swappable Components
- **Database**: Change `provider` in `prisma/schema.prisma` to switch from PostgreSQL to MySQL, SQLite, or CockroachDB with no business logic changes.
- **AI Provider**: Modify `src/lib/ai.ts` to switch from Gemini to OpenAI or Claude. The exported function signatures (`generateSummary`, `generateTags`, `queryKnowledge`) remain stable — only the implementation changes.
- **Frontend**: All pages consume REST JSON APIs. Any frontend framework could call the same endpoints.

---

## 2. Authentication & Data Isolation

Authentication is handled by **NextAuth v5** with a credentials provider (email + bcrypt password hashing). Sessions use JWT strategy.

- `src/proxy.ts` (middleware) protects all `/dashboard`, `/capture`, `/query`, and `/knowledge/*` routes — unauthenticated users are redirected to `/login`.
- Every API route calls `getCurrentUserId()` from `src/lib/auth-helpers.ts` and returns 401 if no session.
- All `KnowledgeItem` Prisma queries are scoped by `userId` — users can only see and modify their own data.
- The tag filter list on the dashboard only returns tags used by the current user's items.

---

## 3. Principles-Based UX

**5 design principles guiding AI interaction patterns:**

### Principle 1: Transparency Over Magic
Users always know when AI is processing. Loading states, progress indicators, and clear labelling ("AI Summary", "AI-suggested tags") ensure nothing is silently automated.

### Principle 2: User Control & Override
AI suggestions are never auto-applied without a user action. Tags can be removed, summaries regenerated, and all AI content is editable.

### Principle 3: Progressive Enhancement
The app works fully without AI. Core CRUD operations function with no API key. AI enhances but never gates the experience.

### Principle 4: Contextual Intelligence
AI features appear where they are useful — auto-tag and summarise on capture, re-summarise on the detail view, conversational query as a dedicated page.

### Principle 5: Responsive Feedback
Every action has immediate visual feedback via toast notifications, skeleton loaders, optimistic UI updates with rollback, and Framer Motion micro-animations.

---

## 4. AI Pipeline

All AI calls go through `src/lib/ai.ts` which wraps `@google/generative-ai` using **Gemini 1.5 Flash**.

### Summarisation
`generateSummary(content)` — produces a 2–3 sentence summary. Called from:
- `POST /api/ai/summarize` (manual re-summarise on detail page)
- `POST /api/knowledge` with `autoSummarize: true` (Save & AI Process)

### Auto-Tagging
`generateTags(title, content)` — returns up to 5 lowercase tag strings. Called from:
- `POST /api/ai/auto-tag` (manual tag generation on capture page)
- `POST /api/knowledge` with `autoTag: true` (Save & AI Process)

### Conversational Query
`queryKnowledge(question, items)` — receives the user's question and all their knowledge items, returns an answer with cited source IDs. Called from `POST /api/ai/query`.

### Quota Error Handling
`isQuotaError(error)` detects Gemini 429 / quota-exhausted errors. All AI routes return HTTP 429 with a user-readable message when the API quota is hit — displayed as a toast rather than a generic failure.

---

## 5. Rate Limiting

In-memory rate limiting is applied per client IP using `src/lib/rate-limit.ts`.

| Context | Limit |
|---------|-------|
| AI endpoints | 20 requests / minute |
| General API | 100 requests / minute |

---

## 6. Data Model

```prisma
model User {
  id             String          @id @default(cuid())
  email          String          @unique
  name           String?
  hashedPassword String?
  items          KnowledgeItem[]
  createdAt      DateTime        @default(now())
}

model KnowledgeItem {
  id         String   @id @default(cuid())
  title      String
  content    String
  type       ItemType @default(NOTE)  // NOTE | LINK | INSIGHT
  summary    String?
  sourceUrl  String?
  isFavorite Boolean  @default(false)
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  tags       Tag[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Tag {
  id    String          @id @default(cuid())
  name  String          @unique
  color String?
  items KnowledgeItem[]
}
```

---

## 7. Input Validation

`src/lib/validation.ts` validates all user input server-side before any database or AI call:

- `title`: required, 1–500 chars
- `content`: required, 1–50,000 chars
- `type`: must be `NOTE`, `LINK`, or `INSIGHT`
- `sourceUrl`: optional, must be a valid URL if provided
- `tags`: max 20 tags, each max 50 chars
- `summary`: optional, max 2,000 chars
- `isFavorite`: must be boolean if provided
- `POST /api/knowledge` — Create item (with validation & optional AI processing)
- `GET /api/knowledge/[id]` — Get single item
- `PATCH /api/knowledge/[id]` — Update item (with field validation)
- `DELETE /api/knowledge/[id]` — Delete item

### AI Processing API
- `POST /api/ai/summarize` — Generate summary
- `POST /api/ai/auto-tag` — Generate tags
- `POST /api/ai/query` — Conversational query

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router + Turbopack) | Full-stack React framework |
| UI | React 19 + Tailwind CSS | Component library + styling |
| Animation | Framer Motion | Smooth transitions & parallax |
| ORM | Prisma | Type-safe database access |
| Database | PostgreSQL (Neon) | Serverless relational storage |
| AI | Google Gemini 2.0 Flash | Summarization, tagging, querying |
| Icons | Lucide React | Consistent icon system |
| Security | Rate Limiting + Validation | Input sanitization & abuse prevention |
| Deployment | Vercel | Edge-optimized hosting |
