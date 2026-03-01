# 🧠 Second Brain — AI-Powered Knowledge System

A personal knowledge management platform that captures, organises, and intelligently surfaces everything you know — powered by AI. Built with Next.js, Tailwind CSS, Prisma, and Google Gemini.

> 🔗 **Live Demo:** [second-brain-zofspades.vercel.app](https://second-brain-zofspades.vercel.app)

---

## Features

- **Knowledge Capture** — Save notes, links, and insights with custom tags
- **Smart Dashboard** — Search, filter, and sort your entire knowledge base
- **AI Summarisation** — One-click AI summaries of any captured content
- **AI Auto-Tagging** — Gemini suggests relevant tags based on your content
- **Ask Your Brain** — Conversational chat interface that queries your knowledge base
- **User Authentication** — Register, log in, and keep your knowledge fully private
- **Architecture Docs** — Built-in `/docs` page documenting design decisions

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 (App Router) | Full-stack React framework |
| React 19 | UI components |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Prisma 6 | Type-safe PostgreSQL ORM |
| Neon PostgreSQL | Serverless cloud database |
| Google Gemini 1.5 Flash | AI summarisation, tagging, querying |
| NextAuth v5 | Authentication (JWT sessions) |
| bcryptjs | Password hashing |
| Lucide React | Icon system |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/ZofSpades/Second-Brain.git
cd Second-Brain
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then fill in `.env` — see the table below for what each variable does.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (e.g. Neon) |
| `GOOGLE_AI_API_KEY` | ✅ | Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `AUTH_SECRET` | ✅ | Random secret for NextAuth — run `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | App URL (`http://localhost:3000` for local) |
| `AUTH_TRUST_HOST` | ✅ | Set to `true` |
| `CORS_ORIGIN` | optional | Restrict public API origin (default `*`) |

### 3. Push the database schema

```bash
npx prisma db push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated pages (with Navbar/Footer)
│   │   ├── dashboard/      # Knowledge base dashboard
│   │   ├── capture/        # Create knowledge items
│   │   ├── knowledge/[id]/ # Item detail & summarise
│   │   ├── query/          # Ask your brain (chat)
│   │   └── docs/           # Architecture documentation
│   ├── (auth)/             # Login & register pages
│   ├── api/
│   │   ├── knowledge/      # CRUD endpoints
│   │   ├── ai/             # Summarise, auto-tag, query
│   │   └── auth/           # NextAuth + register
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Button, Card, Select, Toast, ConfirmDialog …
│   ├── landing/            # Landing page
│   └── layout/             # Navbar, Footer
├── lib/
│   ├── ai.ts               # Gemini functions
│   ├── auth-helpers.ts     # getCurrentUserId()
│   ├── db.ts               # Prisma client singleton
│   ├── rate-limit.ts       # In-memory rate limiting
│   ├── utils.ts            # Shared utilities
│   └── validation.ts       # Input validation
├── types/
│   └── next-auth.d.ts      # Session type augmentation
└── proxy.ts                # Route protection middleware
```

---

## API Endpoints

All endpoints require authentication except where noted.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/knowledge` | List items (`?search` `?type` `?tag` `?sort` `?page`) |
| `POST` | `/api/knowledge` | Create item (optional `autoSummarize`, `autoTag`) |
| `GET` | `/api/knowledge/[id]` | Get single item |
| `PATCH` | `/api/knowledge/[id]` | Update item |
| `DELETE` | `/api/knowledge/[id]` | Delete item |
| `POST` | `/api/ai/summarize` | Generate AI summary for an item |
| `POST` | `/api/ai/auto-tag` | Generate AI tags for content |
| `POST` | `/api/ai/query` | Conversational query against knowledge base |
| `POST` | `/api/auth/register` | Create a new user account |
