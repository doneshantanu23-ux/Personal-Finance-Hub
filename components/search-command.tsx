"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Calendar,
  Receipt,
  Building,
  DollarSign,
  BarChart3,
  Coins,
  ArrowUpDown,
  TrendingDown,
  Bot,
  Home,
  Briefcase,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

interface SearchItem {
  id: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<any>
  category: string
  keywords: string[]
}

const searchItems: SearchItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Overview of your financial portfolio",
    href: "/",
    icon: Home,
    category: "Navigation",
    keywords: ["home", "overview", "main", "portfolio"],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Manage your investment portfolio",
    href: "/portfolio",
    icon: Briefcase,
    category: "Investments",
    keywords: ["investments", "stocks", "portfolio", "assets"],
  },
  {
    id: "ai-advisor",
    title: "AI Financial Advisor",
    description: "Get AI-powered financial advice",
    href: "/ai-advisor",
    icon: Bot,
    category: "AI Tools",
    keywords: ["ai", "advisor", "chat", "advice", "assistant"],
  },
  {
    id: "emi-calculator",
    title: "EMI Calculator",
    description: "Calculate loan EMIs and interest",
    href: "/emi-calculator",
    icon: Calculator,
    category: "Calculators",
    keywords: ["emi", "loan", "calculator", "interest", "monthly"],
  },
  {
    id: "fd-calculator",
    title: "FD Calculator",
    description: "Calculate fixed deposit returns",
    href: "/fd-calculator",
    icon: PiggyBank,
    category: "Calculators",
    keywords: ["fd", "fixed deposit", "calculator", "returns", "maturity"],
  },
  {
    id: "tax-calculator",
    title: "Tax Calculator",
    description: "Calculate income tax and plan savings",
    href: "/tax-calculator",
    icon: Calculator,
    category: "Calculators",
    keywords: ["tax", "income tax", "calculator", "savings", "deductions"],
  },
  {
    id: "debt-planner",
    title: "Debt Planner",
    description: "Plan and track debt payoff strategies",
    href: "/debt-planner",
    icon: CreditCard,
    category: "Planning",
    keywords: ["debt", "planner", "payoff", "strategy", "loans"],
  },
  {
    id: "budget-calendar",
    title: "Budget Calendar",
    description: "Track expenses with calendar view",
    href: "/budget-calendar",
    icon: Calendar,
    category: "Planning",
    keywords: ["budget", "calendar", "expenses", "monthly", "planning"],
  },
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    description: "Track and categorize daily expenses",
    href: "/expense-tracker",
    icon: Receipt,
    category: "Planning",
    keywords: ["expenses", "tracker", "spending", "categories", "daily"],
  },
  {
    id: "daily-spending",
    title: "Daily Spending",
    description: "Monitor daily spending patterns",
    href: "/daily-spending",
    icon: DollarSign,
    category: "Planning",
    keywords: ["daily", "spending", "patterns", "monitor", "track"],
  },
  {
    id: "forex-market",
    title: "Forex Market",
    description: "Live forex rates and analysis",
    href: "/forex-market",
    icon: ArrowUpDown,
    category: "Markets",
    keywords: ["forex", "currency", "exchange", "rates", "trading"],
  },
  {
    id: "crypto-market",
    title: "Crypto Market",
    description: "Cryptocurrency prices and trends",
    href: "/crypto-market",
    icon: Coins,
    category: "Markets",
    keywords: ["crypto", "cryptocurrency", "bitcoin", "ethereum", "trading"],
  },
  {
    id: "indian-stock-market",
    title: "Indian Stock Market",
    description: "NSE, BSE stocks and market data",
    href: "/indian-stock-market",
    icon: TrendingUp,
    category: "Markets",
    keywords: ["stocks", "nse", "bse", "indian", "market", "sensex", "nifty"],
  },
  {
    id: "commodities",
    title: "Commodities",
    description: "Gold, silver and commodity prices",
    href: "/commodities",
    icon: BarChart3,
    category: "Markets",
    keywords: ["commodities", "gold", "silver", "oil", "prices"],
  },
  {
    id: "indian-real-estate",
    title: "Indian Real Estate",
    description: "Property market analysis and tracking",
    href: "/indian-real-estate",
    icon: Building,
    category: "Markets",
    keywords: ["real estate", "property", "housing", "investment", "market"],
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    description: "Convert between different currencies",
    href: "/currency-converter",
    icon: ArrowUpDown,
    category: "Tools",
    keywords: ["currency", "converter", "exchange", "rates", "convert"],
  },
  {
    id: "indian-economic-indicators",
    title: "Economic Indicators",
    description: "Indian economic data and indicators",
    href: "/indian-economic-indicators",
    icon: TrendingDown,
    category: "Tools",
    keywords: ["economic", "indicators", "gdp", "inflation", "data"],
  },
]

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return searchItems

    const query = searchQuery.toLowerCase()
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, SearchItem[]> = {}
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  const handleSelect = (href: string) => {
    onOpenChange(false)
    router.push(href)
    setSearchQuery("")
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Financial Tools"
      description="Search for financial tools, calculators, and market data"
    >
      <CommandInput
        placeholder="Search financial tools, calculators, markets..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.description} ${item.keywords.join(" ")}`}
                  onSelect={() => handleSelect(item.href)}
                  className="cursor-pointer"
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        ))}
        {!searchQuery && (
          <CommandGroup heading="Tips">
            <CommandItem disabled>
              <span className="text-xs text-muted-foreground">
                Press <CommandShortcut>⌘K</CommandShortcut> to open search anytime
              </span>
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
