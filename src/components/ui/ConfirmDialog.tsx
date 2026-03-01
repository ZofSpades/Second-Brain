"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/50"
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={22} className="text-red-400" />
            </div>

            {/* Text */}
            <h3 className="text-base font-semibold text-zinc-100 mb-1">{title}</h3>
            <p className="text-sm text-zinc-400 mb-6">{description}</p>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
              <button
                onClick={onConfirm}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
