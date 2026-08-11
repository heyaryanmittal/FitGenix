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
      "inline-flex h-12 items-center justify-center rounded-xl bg-zinc-950 p-1 text-zinc-400 border border-zinc-800/80 w-full",
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
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50",
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
