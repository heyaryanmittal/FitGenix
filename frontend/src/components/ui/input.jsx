import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, startIcon, endIcon, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {startIcon && (
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
          startIcon && "pl-10",
          endIcon && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-3 text-slate-400">
          {endIcon}
        </div>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
