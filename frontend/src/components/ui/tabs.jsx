import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext({ activeTab: "", setActiveTab: () => {} })

const Tabs = ({ defaultValue, value, onValueChange, className, children }) => {
  const [selected, setSelected] = React.useState(defaultValue || "")
  const activeTab = value !== undefined ? value : selected

  const handleTabChange = (val) => {
    if (value === undefined) setSelected(val)
    if (onValueChange) onValueChange(val)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ className, children }) => (
  <div
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 w-full transition-colors",
      className
    )}
  >
    {children}
  </div>
)

const TabsTrigger = ({ value, className, children, ...props }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, className, children }) => {
  const { activeTab } = React.useContext(TabsContext)
  if (activeTab !== value) return null

  return (
    <div className={cn("mt-4 ring-offset-background focus-visible:outline-none", className)}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
