"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Link as LinkIcon,
  Lightbulb,
  Sparkles,
  Check,
  ArrowLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn, getRandomTagColor } from "@/lib/utils";

type ItemType = "NOTE" | "LINK" | "INSIGHT";

const typeOptions = [
  {
    type: "NOTE" as ItemType,
    icon: FileText,
    label: "Note",
    description: "Personal thoughts, ideas, or reference material",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    type: "LINK" as ItemType,
    icon: LinkIcon,
    label: "Link",
    description: "Web articles, resources, or bookmarks",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    type: "INSIGHT" as ItemType,
    icon: Lightbulb,
    label: "Insight",
    description: "Key learnings, takeaways, or epiphanies",
    gradient: "from-purple-500 to-violet-500",
  },
];

export default function CapturePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "NOTE" as ItemType,
    sourceUrl: "",
    tags: [] as string[],
  });

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagKeydown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleAutoTag = async () => {
    if (!form.content && !form.title) {
      addToast("Add some content first", "warning");
      return;
    }
    setAiProcessing(true);
    try {
      const res = await fetch("/api/ai/auto-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || "AI tagging failed — please try again", "error");
        return;
      }
      const data = await res.json();
      if (data.tags?.length) {
        setForm((prev) => ({
          ...prev,
          tags: [...new Set([...prev.tags, ...data.tags])],
        }));
        addToast(`Added ${data.tags.length} AI-suggested tags`, "success");
      }
    } catch {
      addToast("AI tagging failed — please try again", "error");
    } finally {
      setAiProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      addToast("Title and content are required", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || "Failed to save item", "error");
        return;
      }
      addToast("Knowledge captured successfully!", "success");
      router.push("/dashboard");
    } catch {
      addToast("Failed to save item", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      addToast("Title and content are required", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, autoSummarize: true, autoTag: true }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || "Failed to save item", "error");
        return;
      }
      addToast("Captured & AI-processed!", "success");
      router.push("/dashboard");
    } catch {
      addToast("Failed to save item", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Capture Knowledge
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Add a new item to your second brain
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">
            Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {typeOptions.map((opt) => {
              const Icon = opt.icon;
              const selected = form.type === opt.type;
              return (
                <motion.button
                  key={opt.type}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, type: opt.type }))
                  }
                  className={cn(
                    "relative rounded-xl border p-4 text-left transition-all duration-200",
                    selected
                      ? "border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/20"
                      : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex rounded-lg p-2 mb-2 bg-gradient-to-r",
                      opt.gradient
                    )}
                  >
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    {opt.label}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {opt.description}
                  </div>
                  {selected && (
                    <motion.div
                      layoutId="type-check"
                      className="absolute top-3 right-3"
                    >
                      <Check size={14} className="text-blue-400" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <Input
          label="Title *"
          placeholder="e.g., How to build a knowledge graph"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        {/* Content */}
        <Textarea
          label="Content *"
          placeholder="Your notes, insights, or description..."
          rows={8}
          value={form.content}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
        />

        {/* Source URL (for links) */}
        {form.type === "LINK" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              label="Source URL"
              placeholder="https://example.com/article"
              type="url"
              value={form.sourceUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, sourceUrl: e.target.value }))
              }
            />
          </motion.div>
        )}

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-300">
              Tags
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAutoTag}
              loading={aiProcessing}
            >
              <Sparkles size={14} className="text-violet-400" />
              AI Auto-Tag
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 min-h-[44px] focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500/40 transition-all">
            {form.tags.map((tag) => (
              <Badge
                key={tag}
                color={getRandomTagColor()}
                onClick={() => removeTag(tag)}
                className="cursor-pointer group"
              >
                {tag}
                <X size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Badge>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeydown}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder={
                form.tags.length === 0 ? "Type and press Enter to add tags..." : "Add more..."
              }
              className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button type="submit" loading={saving} className="flex-1">
            <Check size={16} />
            Save Knowledge
          </Button>
          <Button
            type="button"
            variant="secondary"
            loading={saving}
            onClick={handleSaveWithAI}
            className="flex-1"
          >
            <Sparkles size={16} className="text-violet-400" />
            Save & AI Process
          </Button>
        </div>
      </form>
    </div>
  );
}
