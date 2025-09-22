"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { TrendingUp, TrendingDown, Plus, IndianRupee, Target, BarChart3, Trash2 } from "lucide-react"

interface Holding {
  id: string
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  sector: string
  type: "stock" | "mutual_fund" | "etf" | "bond"
}

interface PortfolioData {
  date: string
  value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioData[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHolding, setNewHolding] = useState({
    symbol: "",
    name: "",
    quantity: "",
    avgPrice: "",
    currentPrice: "",
    sector: "",
    type: "stock" as const,
  })

  useEffect(() => {
    // Load mock data
    loadMockData()
  }, [])

  const loadMockData = () => {
    const mockHoldings: Holding[] = [
      {
        id: "1",
        symbol: "RELIANCE",
        name: "Reliance Industries Ltd.",
        quantity: 50,
        avgPrice: 2450,
        currentPrice: 2680,
        sector: "Energy",
        type: "stock",
      },
      {
        id: "2",
        symbol: "TCS",
        name: "Tata Consultancy Services",
        quantity: 25,
        avgPrice: 3200,
        currentPrice: 3580,
        sector: "Information Technology",
        type: "stock",
      },
      {
        id: "3",
        symbol: "INFY",
        name: "Infosys Limited",
        quantity: 30,
        avgPrice: 1450,
        currentPrice: 1620,
        sector: "Information Technology",
        type: "stock",
      },
      {
        id: "4",
        symbol: "HDFCBANK",
        name: "HDFC Bank Limited",
        quantity: 40,
        avgPrice: 1580,
        currentPrice: 1720,
        sector: "Financial Services",
        type: "stock",
      },
      {
        id: "5",
        symbol: "NIFTYBEES",
        name: "Nippon India ETF Nifty BeES",
        quantity: 100,
        avgPrice: 185,
        currentPrice: 205,
        sector: "Diversified",
        type: "etf",
      },
    ]

    setHoldings(mockHoldings)

    const history = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const baseValue = 450000 // Base value in INR
      const variation = Math.sin(i / 5) * 25000 + Math.random() * 15000
      history.push({
        date: date.toISOString().split("T")[0],
        value: baseValue + variation,
      })
    }
    setPortfolioHistory(history)
  }

  const calculateTotalValue = () => {
    return holdings.reduce((sum, holding) => sum + holding.quantity * holding.currentPrice, 0)
  }

  const calculateTotalCost = () => {
    return holdings.reduce((sum, holding) => sum + holding.quantity * holding.avgPrice, 0)
  }

  const calculateGainLoss = () => {
    return calculateTotalValue() - calculateTotalCost()
  }

  const calculateGainLossPercent = () => {
    const cost = calculateTotalCost()
    return cost > 0 ? ((calculateTotalValue() - cost) / cost) * 100 : 0
  }

  const getSectorAllocation = () => {
    const sectorMap = new Map()
    holdings.forEach((holding) => {
      const value = holding.quantity * holding.currentPrice
      sectorMap.set(holding.sector, (sectorMap.get(holding.sector) || 0) + value)
    })

    return Array.from(sectorMap.entries()).map(([sector, value]) => ({
      name: sector,
      value,
    }))
  }

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.quantity || !newHolding.avgPrice) return

    const holding: Holding = {
      id: Date.now().toString(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || newHolding.symbol.toUpperCase(),
      quantity: Number.parseFloat(newHolding.quantity),
      avgPrice: Number.parseFloat(newHolding.avgPrice),
      currentPrice: Number.parseFloat(newHolding.currentPrice) || Number.parseFloat(newHolding.avgPrice),
      sector: newHolding.sector || "Other",
      type: newHolding.type,
    }

    setHoldings([...holdings, holding])
    setNewHolding({
      symbol: "",
      name: "",
      quantity: "",
      avgPrice: "",
      currentPrice: "",
      sector: "",
      type: "stock",
    })
    setShowAddForm(false)
  }

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter((h) => h.id !== id))
  }

  const totalValue = calculateTotalValue()
  const totalCost = calculateTotalCost()
  const gainLoss = calculateGainLoss()
  const gainLossPercent = calculateGainLossPercent()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Manager</h1>
            <p className="text-gray-600">Track and manage your investment portfolio</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Holding</span>
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold">₹{totalCost.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                {gainLoss >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Gain/Loss</p>
                  <p className={`text-2xl font-bold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{gainLoss.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Return %</p>
                  <p className={`text-2xl font-bold ${gainLossPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {gainLossPercent >= 0 ? "+" : ""}
                    {gainLossPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Holdings List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
                <CardDescription>Your current investment positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => {
                    const value = holding.quantity * holding.currentPrice
                    const cost = holding.quantity * holding.avgPrice
                    const gain = value - cost
                    const gainPercent = (gain / cost) * 100

                    return (
                      <div key={holding.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{holding.symbol}</h3>
                              <Badge variant="outline">{holding.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{holding.name}</p>
                            <p className="text-sm text-gray-500">{holding.sector}</p>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Quantity: </span>
                                <span className="font-medium">{holding.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Avg Price: </span>
                                <span className="font-medium">₹{holding.avgPrice}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Current: </span>
                                <span className="font-medium">₹{holding.currentPrice}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Value: </span>
                                <span className="font-medium">₹{value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={gain >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {gain >= 0 ? "+" : ""}₹{gain.toFixed(0)} ({gainPercent.toFixed(1)}%)
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHolding(holding.id)}
                              className="mt-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSectorAllocation()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getSectorAllocation().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: any) => [`₹${value.toLocaleString()}`, "Portfolio Value"]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Holding Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Holding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                    placeholder="RELIANCE"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    value={newHolding.name}
                    onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                    placeholder="Reliance Industries Ltd."
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newHolding.type}
                    onValueChange={(value: any) => setNewHolding({ ...newHolding, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="etf">ETF</SelectItem>
                      <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                      <SelectItem value="bond">Bond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newHolding.quantity}
                    onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="avgPrice">Average Price</Label>
                  <Input
                    id="avgPrice"
                    type="number"
                    value={newHolding.avgPrice}
                    onChange={(e) => setNewHolding({ ...newHolding, avgPrice: e.target.value })}
                    placeholder="2450.00"
                  />
                </div>
                <div>
                  <Label htmlFor="currentPrice">Current Price (Optional)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    value={newHolding.currentPrice}
                    onChange={(e) => setNewHolding({ ...newHolding, currentPrice: e.target.value })}
                    placeholder="2680.00"
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Sector</Label>
                  <Input
                    id="sector"
                    value={newHolding.sector}
                    onChange={(e) => setNewHolding({ ...newHolding, sector: e.target.value })}
                    placeholder="Energy"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={addHolding} className="flex-1">
                    Add Holding
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
