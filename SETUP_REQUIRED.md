# ============================================================
# SETUP REQUIRED — Things You Need to Provide
# ============================================================
# This file lists everything the developer needs to configure
# before the Second Brain app is fully functional & deployment-ready.
# ============================================================

## 1. DATABASE (PostgreSQL)

You need a PostgreSQL database. Choose ONE of these options:

### Option A: Neon (Recommended — Free tier, serverless)
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### Option B: Supabase
1. Go to https://supabase.com and create a project
2. Go to Settings → Database → Connection string → URI
3. Copy the connection string

### Option C: Railway
1. Go to https://railway.app
2. Create a new PostgreSQL service
3. Copy the DATABASE_URL from the Variables tab

### Option D: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb secondbrain`
3. Connection string: `postgresql://postgres:yourpassword@localhost:5432/secondbrain`

**Action:** Set `DATABASE_URL` in your `.env` file:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

Then run:
```bash
npx prisma db push
```

---

## 2. AI API KEY (OpenAI)

You need an OpenAI API key for AI features (summarization, auto-tagging, querying).

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. You need a paid account with at least $5 credit (free trial may work)

**Action:** Set `OPENAI_API_KEY` in your `.env` file:
```
OPENAI_API_KEY="sk-your-actual-api-key-here"
```

### Alternative: Use a different AI provider
If you prefer Claude or Gemini, you'll need to modify `src/lib/ai.ts` to use that provider's SDK instead. The function signatures stay the same — just swap the implementation.

---

## 3. DEPLOYMENT

### Frontend (Vercel — Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Set the following environment variables in Vercel dashboard:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `OPENAI_API_KEY` — your OpenAI API key
   - `NEXT_PUBLIC_APP_URL` — your Vercel deployment URL (e.g., https://your-app.vercel.app)
4. Deploy!

### Database (must be accessible from Vercel)
- If using Neon/Supabase/Railway, it's already cloud-hosted — just use the connection string
- Local PostgreSQL will NOT work with Vercel — you must use a cloud database

---

## 4. COMPLETE .env FILE

Copy `.env.example` to `.env` and fill in all values:

```env
# REQUIRED: PostgreSQL Database URL
DATABASE_URL="postgresql://user:password@host:5432/secondbrain?schema=public"

# REQUIRED for AI features: OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key"

# REQUIRED for deployment: Your app's public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OPTIONAL: Restrict CORS for public API (default: "*" allows all origins)
# Set to your domain in production for security
CORS_ORIGIN="https://yourdomain.com"
```

---

## 5. FIRST-TIME SETUP COMMANDS

After setting up your `.env` file, run these commands in order:

```bash
# 1. Install dependencies (already done if you cloned)
npm install

# 2. Push database schema to your PostgreSQL database
npx prisma db push

# 3. Generate Prisma client
npx prisma generate

# 4. Start development server
npm run dev
```

Then open http://localhost:3000 in your browser.

---

## 6. OPTIONAL ENHANCEMENTS (Not Required)

These are optional improvements you may want to add later:

- [ ] **Authentication** — Add NextAuth.js for user login (npm install next-auth)
- [ ] **Vector Search** — Add pgvector extension to PostgreSQL for semantic search
- [ ] **File Uploads** — Add file upload support with Vercel Blob or AWS S3
- [ ] **Custom Domain** — Configure a custom domain in Vercel settings
- [ ] **Redis Rate Limiting** — Replace in-memory rate limiter with @upstash/ratelimit for production scale
- [ ] **Analytics** — Add Vercel Analytics or PostHog for usage tracking

---

## QUICK CHECKLIST

- [ ] PostgreSQL database is running and accessible
- [ ] `DATABASE_URL` is set in `.env`
- [ ] `OPENAI_API_KEY` is set in `.env`
- [ ] `npx prisma db push` ran successfully
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can create a knowledge item from /capture
- [ ] AI features work (summarize, auto-tag, query)
- [ ] Ready to deploy to Vercel
