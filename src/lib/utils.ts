import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getTypeColor(type: string) {
  switch (type) {
    case "NOTE":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "LINK":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "INSIGHT":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

export function getTypeIcon(type: string) {
  switch (type) {
    case "NOTE":
      return "FileText";
    case "LINK":
      return "Link";
    case "INSIGHT":
      return "Lightbulb";
    default:
      return "File";
  }
}

export const TAG_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

export function getRandomTagColor() {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}
