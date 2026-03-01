# Second Brain — Architecture Documentation

## Overview

Second Brain is an AI-powered knowledge management system built with Next.js 16, React 19, Tailwind CSS, Prisma, and Google Gemini. It enables users to capture, organize, and intelligently query their accumulated knowledge.

---

## 1. Portable Architecture

**Clear separation of concerns with swappable components at each layer.**

### Layer Structure
```
Presentation (React Components)
    ↕
API Layer (Next.js API Routes)
    ↕
Business Logic (lib/ai.ts, lib/utils.ts)
    ↕
Data Layer (Prisma ORM → PostgreSQL)
```

### Swappable Components
- **Database**: Change `provider` in `prisma/schema.prisma` to switch from PostgreSQL to MySQL, SQLite, or CockroachDB. No business logic changes needed.
- **AI Provider**: Modify `src/lib/ai.ts` to switch from Gemini to OpenAI/Claude. Function signatures (generateSummary, generateTags, queryKnowledge) remain stable.
- **Frontend**: Components consume REST APIs. Any frontend framework can replace React by calling the same endpoints.
- **Deployment**: The app runs on any Node.js platform — Vercel, Railway, AWS, or self-hosted.

---

## 2. Principles-Based UX

**5 design principles guiding AI interaction patterns:**

### Principle 1: Transparency Over Magic
Users always know when AI is processing. Loading states, progress indicators, and clear labeling ("AI Summary", "AI-suggested tags") ensure users understand what's automated.

### Principle 2: User Control & Override
AI suggestions are never auto-applied without user action. Tags can be removed, summaries regenerated, and all AI content edited manually.

### Principle 3: Progressive Enhancement
The app works fully without AI features. Core CRUD operations function without any API key. AI enhances but doesn't gate the experience.

### Principle 4: Contextual Intelligence
AI features appear where they're useful — auto-tag on capture, summarize on detail view, conversational query as dedicated page.

### Principle 5: Responsive Feedback
Every action has immediate visual feedback via toasts, skeleton loaders, and micro-animations.

---

## 3. Agent Thinking

**Automation that maintains and improves the system over time.**

### Auto-Summarization Pipeline
"Save & AI Process" automatically generates summaries and tags, building a richer knowledge graph without manual effort.

### Intelligent Tagging
AI analyzes content semantically to suggest relevant tags, creating consistent categorization across the knowledge base.

### Conversational Memory
The query system synthesizes answers from all knowledge items. Value compounds as more content is added.

### Content Enrichment
Each piece of knowledge can be enriched post-capture through summarization, re-tagging, or AI querying.

---

## 4. Infrastructure Mindset

**Functionality exposed via API and embeddable widget.**

### Public REST API
```
GET /api/public/brain/query?q={question}
```
Returns JSON:
```json
{
  "answer": "AI-generated answer based on knowledge base",
  "sources": [{ "id": "...", "title": "...", "type": "NOTE" }],
  "meta": { "totalItems": 42, "query": "...", "timestamp": "..." }
}
```

### Embeddable Widget
```html
<iframe 
  src="https://your-app.vercel.app/widget" 
  width="400" 
  height="500" 
  frameborder="0"
  style="border-radius: 16px; border: 1px solid #27272a;">
</iframe>
```

### Full CRUD API
- `GET /api/knowledge` — List items (supports ?search, ?type, ?tag, ?sort, ?page, ?limit)
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
