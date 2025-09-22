"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  PieChart,
  Calculator,
  Target,
  CreditCard,
  Calendar,
  DollarSign,
  Coins,
  BarChart3,
  TrendingUp,
  Menu,
  Globe,
  Bitcoin,
  IndianRupee,
  Receipt,
  Building,
  Search,
  Settings,
  Shield,
} from "lucide-react"
import { SearchCommand } from "@/components/search-command"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "AI Advisor", href: "/ai-advisor", icon: TrendingUp },
  { name: "Risk Manager", href: "/risk-manager", icon: Shield }, // Added Risk Manager navigation item
  { name: "EMI Calculator", href: "/emi-calculator", icon: Calculator },
  { name: "Debt Planner", href: "/debt-planner", icon: CreditCard },
  { name: "FD Calculator", href: "/fd-calculator", icon: Target },
  { name: "Tax Calculator", href: "/tax-calculator", icon: Calculator },
  { name: "Budget Calendar", href: "/budget-calendar", icon: Calendar },
  { name: "Expense Tracker", href: "/expense-tracker", icon: Receipt },
  { name: "Currency Converter", href: "/currency-converter", icon: DollarSign },
  { name: "Commodities", href: "/commodities", icon: Coins },
  { name: "Economic Indicators", href: "/indian-economic-indicators", icon: BarChart3 },
  { name: "Forex Market", href: "/forex-market", icon: Globe },
  { name: "Crypto Market", href: "/crypto-market", icon: Bitcoin },
  { name: "Indian Stocks", href: "/indian-stock-market", icon: IndianRupee },
  { name: "Indian Real Estate", href: "/indian-real-estate", icon: Building },
  { name: "Settings", href: "/settings", icon: Settings }, // Added Settings navigation item
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false) // Added search dialog state

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <IndianRupee className="h-6 w-6 text-blue-600" />
              <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Finance Hub
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navigation.slice(0, 6).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1 transition-colors hover:text-blue-600 ${
                      pathname === item.href ? "text-blue-600" : "text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <IndianRupee className="h-6 w-6 text-blue-600" />
                <span className="font-bold">Finance Hub</span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-2 transition-colors hover:text-blue-600 ${
                          pathname === item.href ? "text-blue-600" : "text-slate-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Link href="/" className="flex items-center space-x-2 md:hidden">
                <IndianRupee className="h-6 w-6 text-blue-600" />
                <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Finance Hub
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-blue-600"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-blue-600">
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  <span className="hidden lg:inline ml-2">Settings</span>
                </Link>
              </Button>
              {/* Mobile search button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="md:hidden text-slate-600 hover:text-blue-600"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
