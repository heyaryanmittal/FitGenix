import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = ({
  variant = "default",
  size = "default",
  className = ""
}) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold tracking-wide ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]"
  
  const variants = {
    default: "bg-primary text-white hover:bg-orange-600 shadow-sunrise-orange hover:shadow-sunrise-orange font-display tracking-wider",
    outline: "border border-orange-500/30 bg-white text-slate-800 hover:border-primary hover:bg-orange-50 hover:text-primary shadow-sm",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
    ghost: "text-slate-600 hover:bg-orange-50 hover:text-primary",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
    glow: "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-sunrise-orange hover:brightness-105 font-display tracking-wider font-extrabold",
  }

  const sizes = {
    default: "h-11 px-6 py-2.5",
    sm: "h-9 rounded-lg px-4 text-xs font-bold",
    lg: "h-13 rounded-2xl px-8 text-base font-black",
    icon: "h-10 w-10 p-0 rounded-xl",
  }

  return cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)
}

const Button = React.forwardRef(({ className, variant, size, children, ...props }, ref) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button }
