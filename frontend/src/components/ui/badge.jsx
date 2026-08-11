import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-orange-500/30 bg-orange-50 text-orange-600 border font-mono text-[11px] font-bold",
    glow: "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sunrise-orange font-bold text-[11px] uppercase tracking-wider",
    secondary: "border-slate-200 bg-slate-100 text-slate-700 border font-mono text-[11px]",
    destructive: "border-red-300 bg-red-50 text-red-600 border font-bold uppercase tracking-wider animate-pulse text-[11px]",
    success: "border-emerald-300 bg-emerald-50 text-emerald-600 border font-bold uppercase tracking-wider text-[11px]",
    outline: "text-slate-600 border border-slate-300 font-mono text-[11px]",
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
