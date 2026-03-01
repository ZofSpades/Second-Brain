"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  FileText,
  Link as LinkIcon,
  Lightbulb,
  Plus,
  Star,
  Sparkles,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn, formatDate, getTypeColor, truncate } from "@/lib/utils";

interface TagData {
  id: string;
  name: string;
  color: string | null;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: "NOTE" | "LINK" | "INSIGHT";
  summary: string | null;
  sourceUrl: string | null;
  isFavorite: boolean;
  tags: TagData[];
  createdAt: string;
  updatedAt: string;
}

const typeIcons = {
  NOTE: FileText,
  LINK: LinkIcon,
  INSIGHT: Lightbulb,
};

export default function DashboardPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allTags, setAllTags] = useState<TagData[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      if (tagFilter) params.set("tag", tagFilter);
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/knowledge?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.items);
      setAllTags(data.tags || []);
    } catch {
      addToast("Failed to load knowledge items", "error");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, tagFilter, sortBy, addToast]);

  useEffect(() => {
    const debounce = setTimeout(fetchItems, 300);
    return () => clearTimeout(debounce);
  }, [fetchItems]);

  const toggleFavorite = async (id: string, current: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !current } : item
      )
    );
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !current }),
      });
      if (!res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isFavorite: current } : item
          )
        );
        addToast("Failed to update", "error");
      }
    } catch {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFavorite: current } : item
        )
      );
      addToast("Failed to update", "error");
    }
  };

  const deleteItem = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || "Failed to delete", "error");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      addToast("Item deleted", "success");
    } catch {
      addToast("Failed to delete", "error");
    }
  };

  const stats = {
    total: items.length,
    notes: items.filter((i) => i.type === "NOTE").length,
    links: items.filter((i) => i.type === "LINK").length,
    insights: items.filter((i) => i.type === "INSIGHT").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Knowledge Base</h1>
          <p className="text-zinc-400 mt-1">
            {stats.total} items &middot; {stats.notes} notes &middot;{" "}
            {stats.links} links &middot; {stats.insights} insights
          </p>
        </div>
        <Link href="/capture">
          <Button>
            <Plus size={16} />
            Add Knowledge
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            placeholder="Search knowledge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 hover:border-zinc-700 transition-all"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All Types"
            options={[
              { value: "NOTE", label: "Notes" },
              { value: "LINK", label: "Links" },
              { value: "INSIGHT", label: "Insights" },
            ]}
            className="w-36"
          />
          <Select
            value={tagFilter}
            onChange={setTagFilter}
            placeholder="All Tags"
            options={allTags.map((t) => ({ value: t.name, label: t.name }))}
            className="w-36"
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "title", label: "A-Z" },
            ]}
            className="w-40"
          />
          <div className="flex rounded-xl border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === "grid"
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 transition-colors",
                viewMode === "list"
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <DashboardSkeleton />
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
            <FileText size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">
            No knowledge items yet
          </h3>
          <p className="text-zinc-500 mb-6 max-w-sm">
            Start capturing your knowledge — notes, links, and insights — to
            build your second brain.
          </p>
          <Link href="/capture">
            <Button>
              <Plus size={16} />
              Capture Your First Item
            </Button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-3"
            )}
          >
            {items.map((item, i) => {
              const TypeIcon = typeIcons[item.type];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <Card
                    className={cn(
                      viewMode === "list" &&
                        "flex flex-row items-start gap-4"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-medium border",
                            getTypeColor(item.type)
                          )}
                        >
                          <TypeIcon size={12} />
                          {item.type.toLowerCase()}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(item.id, item.isFavorite);
                            }}
                            className="p-1 rounded-md hover:bg-zinc-800 transition-colors"
                          >
                            <Star
                              size={14}
                              className={cn(
                                item.isFavorite
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-zinc-600 hover:text-zinc-400"
                              )}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(item.id);
                            }}
                            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/knowledge/${item.id}`}>
                        <h3 className="text-base font-semibold text-zinc-100 hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Summary or content preview */}
                      <p className="text-sm text-zinc-400 line-clamp-3 mb-3 leading-relaxed">
                        {item.summary || truncate(item.content, 150)}
                      </p>

                      {/* Source URL */}
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-3 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={10} />
                          {truncate(item.sourceUrl, 40)}
                        </a>
                      )}

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.tags.map((tag) => (
                            <Badge key={tag.id} color={tag.color || undefined}>
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(item.createdAt)}
                        </span>
                        {item.summary && (
                          <span className="flex items-center gap-1 text-violet-400">
                            <Sparkles size={10} />
                            AI Summary
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      <ConfirmDialog
        open={!!deleteTargetId}
        title="Delete this item?"
        description="This will permanently remove the item from your knowledge base. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
