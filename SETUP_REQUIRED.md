# Setup Guide

Everything you need to configure before running Second Brain.

---

## 1. PostgreSQL Database

You need a cloud PostgreSQL database. [Neon](https://neon.tech) is recommended — it has a generous free tier and works seamlessly with Vercel.

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string — it looks like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Set it as `DATABASE_URL` in your `.env`

Then push the schema:
```bash
npx prisma db push
```

---

## 2. Google Gemini API Key

AI features (summarisation, auto-tagging, conversational query) use **Google Gemini 1.5 Flash** — which has a free tier.

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Set it as `GOOGLE_AI_API_KEY` in your `.env`

---

## 3. NextAuth Secret

Generate a secure random secret for signing session tokens:

```bash
openssl rand -base64 32
```

Set the output as `AUTH_SECRET` in your `.env`.

---

## 4. Complete `.env` File

Copy `.env.example` to `.env` and fill in all values:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
GOOGLE_AI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-generated-secret"
AUTH_TRUST_HOST=true
CORS_ORIGIN="*"
NODE_ENV="development"
```

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
