"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  TrendingUp,
  Calculator,
  PieChart,
  DollarSign,
  Target,
  Calendar,
  CreditCard,
  BarChart3,
  Coins,
  Globe,
  Bitcoin,
  IndianRupee,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const features = [
    {
      title: "Portfolio Tracker",
      description: "Track your investments across stocks, mutual funds, and more",
      icon: PieChart,
      href: "/portfolio",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "AI Financial Advisor",
      description: "Get personalized investment advice powered by AI",
      icon: TrendingUp,
      href: "/ai-advisor",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "EMI Calculator",
      description: "Calculate loan EMIs for home, car, and personal loans",
      icon: Calculator,
      href: "/emi-calculator",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "FD Calculator",
      description: "Calculate returns on Fixed Deposits and recurring deposits",
      icon: Target,
      href: "/fd-calculator",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Tax Calculator",
      description: "Calculate income tax and plan your tax savings",
      icon: CreditCard,
      href: "/tax-calculator",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Budget Calendar",
      description: "Plan and track your monthly budget and expenses",
      icon: Calendar,
      href: "/budget-calendar",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Currency Converter",
      description: "Convert between currencies with real-time rates",
      icon: DollarSign,
      href: "/currency-converter",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Commodities",
      description: "Track gold, silver, and other commodity prices",
      icon: Coins,
      href: "/commodities",
      color: "from-amber-500 to-yellow-500",
    },
    {
      title: "Indian Economic Indicators",
      description: "Monitor key economic indicators and market trends",
      icon: BarChart3,
      href: "/indian-economic-indicators",
      color: "from-slate-500 to-gray-500",
    },
    {
      title: "Forex Market",
      description: "Advanced forex trading terminal with educational content",
      icon: Globe,
      href: "/forex-market",
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Crypto Market",
      description: "Comprehensive cryptocurrency market analysis and tracking",
      icon: Bitcoin,
      href: "/crypto-market",
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Indian Stock Market",
      description: "Live Indian stock market data with AI-powered analysis",
      icon: TrendingUp,
      href: "/indian-stock-market",
      color: "from-green-600 to-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Personal Finance Hub
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your comprehensive financial companion for investments, planning, and wealth management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 cursor-pointer h-full">
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100">Total Tools</p>
                  <p className="text-2xl font-bold">12+</p>
                </div>
                <Calculator className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Market Data</p>
                  <p className="text-2xl font-bold">Live</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">AI Powered</p>
                  <p className="text-2xl font-bold">Yes</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Indian Focus</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
                <IndianRupee className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
