"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Layers,
  Palette,
  Bot,
  Globe,
  Database,
  Cpu,
  Code,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const sections = [
  {
    id: "portable",
    icon: Layers,
    gradient: "from-blue-500 to-cyan-500",
    title: "Portable Architecture",
    subtitle: "Clear separation of concerns with swappable components",
    content: [
      {
        heading: "Layer Architecture",
        description:
          "The system is built with clear separation: Presentation (React components) → API Layer (Next.js API routes) → Business Logic (lib/) → Data Layer (Prisma ORM). Each layer can be replaced independently.",
      },
      {
        heading: "Swappable Database",
        description:
          "Prisma ORM abstracts the database layer. Switch from PostgreSQL to MySQL, SQLite, or MongoDB by changing one line in schema.prisma. No business logic changes needed.",
      },
      {
        heading: "Swappable AI Provider",
        description:
          "The AI module (lib/ai.ts) encapsulates all AI calls behind clean functions (generateSummary, generateTags, queryKnowledge). Currently using Google Gemini 2.0 Flash — switch to OpenAI or Claude by updating the provider implementation. All consumers remain unchanged.",
      },
      {
        heading: "API-First Design",
        description:
          "All data flows through RESTful API routes. The frontend consumes the same API that external clients can use, ensuring consistency and enabling headless operation.",
      },
    ],
  },
  {
    id: "ux-principles",
    icon: Palette,
    gradient: "from-violet-500 to-purple-500",
    title: "Principles-Based UX",
    subtitle: "5 design principles guiding AI interaction patterns",
    content: [
      {
        heading: "1. Transparency Over Magic",
        description:
          "Users always know when AI is processing. Loading states, progress indicators, and clear labeling ('AI Summary', 'AI-suggested tags') ensure users understand what's automated vs. manual.",
      },
      {
        heading: "2. User Control & Override",
        description:
          "AI suggestions are never auto-applied without user action. Tags can be removed, summaries regenerated, and all AI content can be manually edited. The human stays in control.",
      },
      {
        heading: "3. Progressive Enhancement",
        description:
          "The app works fully without AI features. Users can capture, organize, and browse knowledge without any API key. AI features enhance but don't gate the core experience.",
      },
      {
        heading: "4. Contextual Intelligence",
        description:
          "AI features appear where they're useful—auto-tag on the capture form, summarize on the detail view, conversational query as a dedicated workspace. Intelligence is embedded in workflow.",
      },
      {
        heading: "5. Responsive Feedback",
        description:
          "Every action has immediate visual feedback. Toasts confirm operations, skeleton loaders indicate data fetching, and micro-animations guide attention to state changes.",
      },
    ],
  },
  {
    id: "agent-thinking",
    icon: Bot,
    gradient: "from-amber-500 to-orange-500",
    title: "Agent Thinking",
    subtitle: "Automation that maintains and improves the system over time",
    content: [
      {
        heading: "Auto-Summarization Pipeline",
        description:
          "When 'Save & AI Process' is used, the system automatically generates a summary and tags for new content. This builds a progressively richer knowledge graph without manual effort.",
      },
      {
        heading: "Intelligent Tagging",
        description:
          "AI analyzes content semantically to suggest relevant tags, creating consistent categorization across the entire knowledge base. The tag vocabulary grows organically and stays coherent.",
      },
      {
        heading: "Conversational Memory",
        description:
          "The query system searches across all knowledge items to synthesize answers. As the knowledge base grows, the AI's ability to provide relevant answers improves automatically.",
      },
      {
        heading: "Content Enrichment",
        description:
          "Each piece of knowledge can be enriched post-capture: summarized, re-tagged, or referenced by the query system. The system's value compounds as more content is added.",
      },
    ],
  },
  {
    id: "infrastructure",
    icon: Globe,
    gradient: "from-emerald-500 to-green-500",
    title: "Infrastructure Mindset",
    subtitle: "Functionality exposed via API and embeddable widget",
    content: [
      {
        heading: "Public REST API",
        description:
          "GET /api/public/brain/query?q={question} returns JSON with AI-generated answers and source references. Any external system can query your knowledge base programmatically.",
      },
      {
        heading: "Embeddable Widget",
        description:
          "The /widget page provides a self-contained search interface that can be embedded via iframe on any website. It's styled independently and communicates through the public API.",
      },
      {
        heading: "CRUD API",
        description:
          "Full RESTful API for knowledge items: GET/POST /api/knowledge, GET/PATCH/DELETE /api/knowledge/[id]. Supports filtering, sorting, and search via query parameters.",
      },
      {
        heading: "AI Processing API",
        description:
          "Dedicated endpoints for AI features: POST /api/ai/summarize, POST /api/ai/auto-tag, POST /api/ai/query. These can be called independently from any client.",
      },
    ],
  },
];

const techStack = [
  { name: "Next.js 16", icon: Code, description: "React framework with App Router & Turbopack" },
  { name: "React 19", icon: Cpu, description: "UI component library with Server Components" },
  { name: "Tailwind CSS", icon: Palette, description: "Utility-first CSS framework" },
  { name: "Prisma ORM", icon: Database, description: "Type-safe ORM for PostgreSQL (Neon)" },
  { name: "Google Gemini", icon: Sparkles, description: "AI summarization, tagging & querying" },
  { name: "Framer Motion", icon: Layers, description: "Animation & micro-interactions" },
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-2.5">
            <BookOpen size={20} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100">
            Architecture Documentation
          </h1>
        </div>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          This document outlines the four key architectural concepts implemented
          in the Second Brain knowledge management system.
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-xl font-semibold text-zinc-200 mb-4"
        >
          Technology Stack
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                variants={fadeUp}
                custom={i + 1}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 flex items-center gap-3"
              >
                <Icon size={18} className="text-zinc-400" />
                <div>
                  <div className="text-sm font-medium text-zinc-200">
                    {tech.name}
                  </div>
                  <div className="text-xs text-zinc-500">{tech.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Architecture Sections */}
      <div className="space-y-16">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.section
              key={section.id}
              id={section.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="scroll-mt-24"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`rounded-xl bg-gradient-to-r ${section.gradient} p-2`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-100">
                    {section.title}
                  </h2>
                </div>
                <p className="text-zinc-400">{section.subtitle}</p>
              </motion.div>

              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <motion.div
                    key={item.heading}
                    variants={fadeUp}
                    custom={i + 1}
                    className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5"
                  >
                    <h3 className="text-base font-semibold text-zinc-200 mb-2">
                      {item.heading}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* API Reference Quick Links */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 pt-16 border-t border-zinc-800/50"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-xl font-semibold text-zinc-200 mb-6"
        >
          API Endpoints
        </motion.h2>
        <div className="space-y-2">
          {[
            { method: "GET", path: "/api/knowledge", desc: "List all items (supports ?search, ?type, ?tag, ?sort, ?page, ?limit)" },
            { method: "POST", path: "/api/knowledge", desc: "Create a new knowledge item" },
            { method: "GET", path: "/api/knowledge/[id]", desc: "Get a single item by ID" },
            { method: "PATCH", path: "/api/knowledge/[id]", desc: "Update an item (partial)" },
            { method: "DELETE", path: "/api/knowledge/[id]", desc: "Delete an item" },
            { method: "POST", path: "/api/ai/summarize", desc: "Generate AI summary (Gemini)" },
            { method: "POST", path: "/api/ai/auto-tag", desc: "Generate AI tags (Gemini)" },
            { method: "POST", path: "/api/ai/query", desc: "Conversational knowledge query" },
            { method: "GET", path: "/api/public/brain/query", desc: "Public query endpoint (?q=)" },
          ].map((endpoint, i) => (
            <motion.div
              key={endpoint.path + endpoint.method}
              variants={fadeUp}
              custom={i}
              className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4 py-2.5"
            >
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  endpoint.method === "GET"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : endpoint.method === "POST"
                    ? "bg-blue-500/10 text-blue-400"
                    : endpoint.method === "PATCH"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {endpoint.method}
              </span>
              <code className="text-sm text-zinc-300 font-mono">
                {endpoint.path}
              </code>
              <span className="text-xs text-zinc-500 ml-auto hidden sm:block">
                {endpoint.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Security & Quality */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 pt-16 border-t border-zinc-800/50"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-xl font-semibold text-zinc-200 mb-2"
        >
          Security & Quality
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-zinc-400 text-sm mb-6"
        >
          Built-in protections and best practices
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "Input Validation", desc: "All endpoints validate types, lengths, URLs, and enums before processing" },
            { title: "Rate Limiting", desc: "In-memory rate limiter — 20 req/min AI, 10 req/min public API, 100 req/min general" },
            { title: "Security Headers", desc: "X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy" },
            { title: "Prompt Injection Guards", desc: "System prompts instruct AI to ignore embedded instructions in user content" },
            { title: "Content Truncation", desc: "AI inputs are truncated to prevent excessive token usage and cost escalation" },
            { title: "CORS Configuration", desc: "Configurable CORS_ORIGIN — wildcard for dev, restricted for production" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={i + 2}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4"
            >
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">{item.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Links */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 pt-16 border-t border-zinc-800/50 pb-8"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-xl font-semibold text-zinc-200 mb-6"
        >
          Quick Links
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Dashboard", href: "/dashboard", desc: "Browse your knowledge base" },
            { label: "Capture", href: "/capture", desc: "Add new notes, links, insights" },
            { label: "Ask Brain", href: "/query", desc: "Query your knowledge with AI" },
          ].map((link, i) => (
            <motion.div key={link.href} variants={fadeUp} custom={i + 1}>
              <Link
                href={link.href}
                className="group flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {link.label}
                  </div>
                  <div className="text-xs text-zinc-500">{link.desc}</div>
                </div>
                <ArrowRight size={16} className="text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
