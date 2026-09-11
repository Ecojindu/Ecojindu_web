import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva("flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed", {
  variants: {
    variant: {
      info: "border-teal/25 bg-teal/[0.07] text-ink-muted",
      success: "border-leaf/30 bg-leaf/[0.09] text-forest",
      warning: "border-[#E8D19A] bg-[#FBF5E6] text-[#7A5A12]",
      error: "border-clay/30 bg-clay-light text-clay-dark",
    },
  },
  defaultVariants: { variant: "info" },
});

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  icon?: boolean;
}

export function Alert({ className, variant = "info", title, icon = true, children, ...props }: AlertProps) {
  const Icon = icons[variant ?? "info"];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <Icon className="mt-0.5 size-4.5 shrink-0" aria-hidden />}
      <div className="min-w-0 flex-1">
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/** Consistent empty state — icon, headline, one line of guidance, optional action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-cream-400 bg-white/60 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-cream-200">
        <Icon className="size-6 text-ink-soft" />
      </div>
      <h3 className="text-lg font-bold text-forest">{title}</h3>
      <p className="mt-1.5 max-w-sm text-pretty text-sm leading-relaxed text-ink-soft">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
