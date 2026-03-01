"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Database, Globe, ArrowRight, Zap, Search, Tag, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Button from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const features = [
  {
    icon: Database,
    title: "Knowledge Capture",
    description: "Store notes, links, and insights with rich metadata and flexible tagging system.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Search,
    title: "Smart Dashboard",
    description: "Search, filter, and sort your knowledge with a beautiful, responsive interface.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "AI Summarization",
    description: "Automatically generate concise summaries of your captured knowledge using AI.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Tag,
    title: "Auto-Tagging",
    description: "Let AI intelligently categorize and tag your content for effortless organization.",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: MessageSquare,
    title: "Ask Your Brain",
    description: "Query your knowledge base conversationally and get AI-powered answers with sources.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Globe,
    title: "Public API & Widget",
    description: "Expose your brain via REST API or embeddable widget for external integrations.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
      {/* Background effects - smaller on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full bg-blue-500/10 blur-[80px] sm:blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full bg-violet-500/10 blur-[80px] sm:blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] rounded-full bg-indigo-500/5 blur-[100px] sm:blur-[200px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8"
        >
          <Sparkles size={14} className="text-amber-400" />
          AI-Powered Knowledge Management
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight"
        >
          <span className="text-zinc-100">Your </span>
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Second Brain
          </span>
          <br />
          <span className="text-zinc-100">Powered by AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
        >
          Capture knowledge, let AI organize it, and query your personal knowledge base
          conversationally. Infrastructure for thought.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="group w-full sm:w-auto">
              Open Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/capture" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Zap size={18} />
              Capture Knowledge
            </Button>
          </Link>
        </motion.div>

        {/* Floating brain animation */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-10 sm:mt-16"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 blur-2xl opacity-30" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl">
              <Brain size={28} className="text-white sm:hidden" />
              <Brain size={36} className="text-white hidden sm:block" />
            </div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="relative py-16 sm:py-32 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[200px] sm:h-[300px] lg:h-[400px] rounded-full bg-blue-500/5 blur-[100px] sm:blur-[150px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 mb-3 sm:mb-4"
          >
            Everything Your Brain Needs
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto px-2"
          >
            A complete knowledge management system with AI intelligence baked in.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60"
              >
                <div className="mb-4">
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-r ${feature.gradient} p-2.5 shadow-lg`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { label: "AI Models Supported", value: "3+" },
    { label: "Knowledge Types", value: "3" },
    { label: "API Endpoints", value: "8+" },
    { label: "Open Source", value: "100%" },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 border-y border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-16 sm:py-32 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[450px] lg:w-[600px] h-[200px] sm:h-[250px] lg:h-[300px] rounded-full bg-violet-500/10 blur-[100px] sm:blur-[150px]" />
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center px-2"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-100 mb-3 sm:mb-4"
        >
          Ready to Build Your Knowledge?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="text-zinc-400 text-base sm:text-lg mb-6 sm:mb-8"
        >
          Start capturing, organizing, and querying your knowledge today.
        </motion.p>
        <motion.div variants={fadeUp} custom={2}>
          <Link href="/capture">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 blur-2xl opacity-40" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-2xl">
          <Brain size={36} className="text-white" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6 text-zinc-400 text-sm tracking-widest uppercase"
      >
        Loading Second Brain
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
        className="h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mt-4"
      />
    </motion.div>
  );
}

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </main>
  );
}
