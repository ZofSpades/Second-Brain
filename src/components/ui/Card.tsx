"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = true,
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm p-5",
        "transition-all duration-300",
        hover && "hover:border-zinc-700/80 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-black/20",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
