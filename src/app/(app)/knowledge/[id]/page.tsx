"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Link as LinkIcon,
  Lightbulb,
  Star,
  ExternalLink,
  Sparkles,
  Clock,
  CalendarDays,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn, formatDate, getTypeColor } from "@/lib/utils";

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

export default function KnowledgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [item, setItem] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/knowledge/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setItem(data);
      } catch {
        addToast("Item not found", "error");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [params.id, router, addToast]);

  const handleSummarize = async () => {
    if (!item) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, content: item.content }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || "Summarization failed — please try again", "error");
        return;
      }
      const data = await res.json();
      setItem((prev) => prev && { ...prev, summary: data.summary });
      addToast("Summary generated!", "success");
    } catch {
      addToast("Summarization failed — please try again", "error");
    } finally {
      setSummarizing(false);
    }
  };

  const handleDelete = () => {
    if (!item) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!item) return;
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`/api/knowledge/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || "Failed to delete", "error");
        return;
      }
      addToast("Deleted", "success");
      router.push("/dashboard");
    } catch {
      addToast("Failed to delete", "error");
    }
  };

  const toggleFavorite = async () => {
    if (!item) return;
    const prev = item.isFavorite;
    setItem((p) => p && { ...p, isFavorite: !prev });
    try {
      const res = await fetch(`/api/knowledge/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !prev }),
      });
      if (!res.ok) {
        setItem((p) => p && { ...p, isFavorite: prev });
        addToast("Failed to update", "error");
      }
    } catch {
      setItem((p) => p && { ...p, isFavorite: prev });
      addToast("Failed to update", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!item) return null;
  const TypeIcon = typeIcons[item.type];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border",
                  getTypeColor(item.type)
                )}
              >
                <TypeIcon size={12} />
                {item.type.toLowerCase()}
              </div>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <CalendarDays size={12} />
                {formatDate(item.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">
              {item.title}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFavorite}
              className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              <Star
                size={18}
                className={cn(
                  item.isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Source URL */}
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors rounded-lg border border-zinc-800 px-3 py-2 hover:bg-zinc-800/30"
          >
            <ExternalLink size={14} />
            {item.sourceUrl}
          </a>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag.id} color={tag.color || undefined}>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {item.summary ? (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-sm font-medium text-violet-300">
                AI Summary
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSummarize}
            loading={summarizing}
          >
            <Sparkles size={14} className="text-violet-400" />
            Generate AI Summary
          </Button>
        )}

        {/* Content */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <div className="prose prose-invert prose-sm max-w-none">
            {item.content.split("\n").map((paragraph, i) => (
              <p key={i} className="text-zinc-300 leading-relaxed mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-800/50">
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            Created {formatDate(item.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            Updated {formatDate(item.updatedAt)}
          </span>
        </div>
      </motion.article>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this item?"
        description="This will permanently remove the item from your knowledge base. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
