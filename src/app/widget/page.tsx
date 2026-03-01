"use client";

import { useState, useEffect } from "react";
import { Brain, Send, Loader2, ExternalLink } from "lucide-react";

export default function WidgetPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<
    { id: string; title: string; type: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(true);

  useEffect(() => {
    // Check if page is loaded directly (not in iframe)
    setIsEmbedded(window !== window.parent);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/public/brain/query?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setAnswer(data.answer || "No answer found.");
      setSources(data.sources || []);
    } catch {
      setAnswer("Failed to query the knowledge base.");
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-sm font-semibold text-zinc-200">
              Second Brain
            </span>
            <span className="text-xs text-zinc-500 ml-auto">
              Knowledge Widget
            </span>
          </div>

          {/* Search */}
          <div className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the brain anything..."
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-white disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {searched && (
            <div className="px-4 pb-4">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-zinc-400 py-4 justify-center">
                  <Loader2 size={14} className="animate-spin" />
                  Searching knowledge base...
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-zinc-800/30 border border-zinc-700/50 p-3">
                    <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </p>
                  </div>

                  {sources.length > 0 && (
                    <div>
                      <span className="text-xs text-zinc-500 mb-1.5 block">
                        Sources
                      </span>
                      <div className="space-y-1">
                        {sources.map((src) => (
                          <div
                            key={src.id}
                            className="flex items-center gap-2 text-xs text-zinc-400 rounded-md bg-zinc-800/20 px-2 py-1.5"
                          >
                            <ExternalLink size={10} />
                            <span>{src.title}</span>
                            <span className="ml-auto text-zinc-600 uppercase text-[10px]">
                              {src.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-zinc-800/50 text-center">
            <span className="text-[10px] text-zinc-600">
              Powered by Second Brain &bull; AI Knowledge System
            </span>
          </div>
        </div>

        {/* Embed Instructions - only shown when NOT inside an iframe */}
        {!isEmbedded && (
          <div className="mt-6 rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4">
            <p className="text-xs text-zinc-500 mb-2">
              Embed this widget on your website:
            </p>
            <code className="block text-xs text-zinc-400 bg-zinc-800/30 rounded-lg p-2 break-all select-all">
              {`<iframe src="${window.location.origin}/widget" width="400" height="500" frameborder="0" style="border-radius: 16px; border: 1px solid #27272a;"></iframe>`}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
