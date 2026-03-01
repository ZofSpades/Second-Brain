"use client";

import { Brain, Lock } from "lucide-react";
import Link from "next/link";

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Widget Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/50">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 p-1.5">
              <Brain size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-200">Second Brain</span>
            <span className="text-xs text-zinc-500 ml-auto">Knowledge Widget</span>
          </div>

          {/* Private notice */}
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center">
              <Lock size={20} className="text-zinc-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">Private Instance</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                This Second Brain is private. Sign in to access and query your personal knowledge base.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 px-4 py-2 text-xs font-medium text-white transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-zinc-800/50 text-center">
            <span className="text-[10px] text-zinc-600">
              Powered by Second Brain &bull; AI Knowledge System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
