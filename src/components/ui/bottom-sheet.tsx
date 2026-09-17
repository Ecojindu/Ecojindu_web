"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-3xl",
            "border border-cream-300 bg-cream-50 shadow-lift outline-none",
            "dark:border-forest-light/30 dark:bg-forest-dark",
            "data-[state=open]:animate-fade-up",
            "pb-[env(safe-area-inset-bottom)]",
            className,
          )}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-cream-300/80 bg-cream-50/95 px-4 pb-3 pt-4 backdrop-blur dark:border-white/10 dark:bg-forest-dark/95">
            <div className="min-w-0">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/15 dark:bg-white/20 md:hidden" aria-hidden />
              <Dialog.Title className="text-base font-bold text-forest dark:text-cream-100">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-0.5 text-sm text-ink-muted dark:text-cream-100/70">
                  {description}
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="tap-target grid shrink-0 place-items-center rounded-full text-ink-muted hover:bg-cream-200 dark:text-cream-100 dark:hover:bg-white/10"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="px-4 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
