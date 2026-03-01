"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "solid" | "outline";
  className?: string;
  onClick?: () => void;
}

export default function Badge({
  children,
  color,
  variant = "solid",
  className,
  onClick,
}: BadgeProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variant === "solid"
          ? "bg-zinc-800 text-zinc-300 border border-zinc-700/50"
          : "border text-zinc-400",
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      style={
        color
          ? {
              backgroundColor: `${color}15`,
              color: color,
              borderColor: `${color}30`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
