"use client";

import { Brain, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Brain size={16} className="text-blue-400" />
            <span className="text-sm">
              Second Brain &mdash; Your AI Knowledge System
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Documentation
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            Built with <Heart size={12} className="text-red-400" /> by Z of Spades
          </div>
        </div>
      </div>
    </footer>
  );
}
