# 🧠 Second Brain — AI-Powered Knowledge System

A sophisticated knowledge management platform that captures, organizes, and intelligently surfaces knowledge using AI. Built with Next.js, React, Tailwind CSS, Prisma, and OpenAI.

## Features

- **Knowledge Capture** — Rich form for notes, links, and insights with flexible tagging
- **Smart Dashboard** — Search, filter, sort, and browse knowledge items with a beautiful UI
- **AI Summarization** — Generate concise summaries of any captured content
- **AI Auto-Tagging** — Let AI intelligently categorize your content
- **Conversational Query** — Ask questions answered by your knowledge base
- **Public API** — REST endpoint for programmatic access to your brain
- **Embeddable Widget** — iframe-ready search widget for external websites
- **Architecture Docs** — Built-in `/docs` page documenting design decisions

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | Full-stack React framework (App Router) |
| React 19 | UI components |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & parallax effects |
| Prisma | Type-safe PostgreSQL ORM |
| OpenAI | AI features (GPT-3.5) |
| Lucide React | Icon system |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENAI_API_KEY

# 3. Set up database
npm run setup

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Pages with navbar layout
│   │   ├── dashboard/      # Knowledge dashboard
│   │   ├── capture/        # Create new items
│   │   ├── knowledge/[id]/ # Item detail view
│   │   ├── query/          # Ask your brain (chat)
│   │   └── docs/           # Architecture docs
│   ├── api/
│   │   ├── knowledge/      # CRUD endpoints
│   │   ├── ai/             # AI processing endpoints
│   │   └── public/brain/   # Public query API
│   ├── widget/             # Embeddable widget
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Reusable components (Button, Card, Modal, etc.)
│   ├── landing/            # Landing page sections
│   └── layout/             # Navbar, Footer
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── ai.ts               # AI utility functions
│   └── utils.ts            # Shared utilities
└── prisma/
    └── schema.prisma       # Database schema
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/knowledge` | List items (?search, ?type, ?tag, ?sort) |
| POST | `/api/knowledge` | Create item |
| GET | `/api/knowledge/[id]` | Get item |
| PATCH | `/api/knowledge/[id]` | Update item |
| DELETE | `/api/knowledge/[id]` | Delete item |
| POST | `/api/ai/summarize` | Generate AI summary |
| POST | `/api/ai/auto-tag` | Generate AI tags |
| POST | `/api/ai/query` | Conversational query |
| GET | `/api/public/brain/query?q=` | Public brain query |

## Deployment

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `OPENAI_API_KEY`)
4. Deploy

See [SETUP_REQUIRED.md](SETUP_REQUIRED.md) for detailed instructions.

## License

MIT
