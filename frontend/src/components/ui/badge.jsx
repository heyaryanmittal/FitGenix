import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-orange-500/30 dark:border-orange-500/40 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border font-mono text-[11px] font-bold",
    glow: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sunrise-orange font-bold text-[11px] uppercase tracking-wider",
    secondary: "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border font-mono text-[11px]",
    destructive: "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border font-bold uppercase tracking-wider animate-pulse text-[11px]",
    success: "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border font-bold uppercase tracking-wider text-[11px]",
    outline: "text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-mono text-[11px]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
