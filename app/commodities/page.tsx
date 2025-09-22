"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Coins, Zap, Wheat, Droplets } from "lucide-react"

interface CommodityData {
  date: string
  price: number
}

interface Commodity {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
  category: string
}

export default function Commodities() {
  const [selectedCommodity, setSelectedCommodity] = useState("GOLD")
  const [timeframe, setTimeframe] = useState("1M")
  const [commodityData, setCommodityData] = useState<CommodityData[]>([])
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [loading, setLoading] = useState(false)

  const commodityList = [
    { symbol: "GOLD", name: "Gold", category: "Precious Metals", unit: "per oz" },
    { symbol: "SILVER", name: "Silver", category: "Precious Metals", unit: "per oz" },
    { symbol: "CRUDE", name: "Crude Oil", category: "Energy", unit: "per barrel" },
    { symbol: "NATGAS", name: "Natural Gas", category: "Energy", unit: "per MMBtu" },
    { symbol: "WHEAT", name: "Wheat", category: "Agriculture", unit: "per bushel" },
    { symbol: "CORN", name: "Corn", category: "Agriculture", unit: "per bushel" },
    { symbol: "COPPER", name: "Copper", category: "Industrial Metals", unit: "per lb" },
    { symbol: "ALUMINUM", name: "Aluminum", category: "Industrial Metals", unit: "per lb" },
  ]

  const fetchCommodityData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/commodity-data?symbol=${selectedCommodity}&timeframe=${timeframe}`)
      const data = await response.json()

      if (data.commodityData) {
        setCommodityData(data.commodityData)
      }
      if (data.commodities) {
        setCommodities(data.commodities)
      }
    } catch (error) {
      console.error("Error fetching commodity data:", error)
      generateMockData()
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    // Generate mock commodity data
    const mockData = []
    let basePrice = 2000

    switch (selectedCommodity) {
      case "GOLD":
        basePrice = 2000
        break
      case "SILVER":
        basePrice = 25
        break
      case "CRUDE":
        basePrice = 80
        break
      case "NATGAS":
        basePrice = 3.5
        break
      case "WHEAT":
        basePrice = 7.5
        break
      case "CORN":
        basePrice = 6.8
        break
      case "COPPER":
        basePrice = 4.2
        break
      case "ALUMINUM":
        basePrice = 1.1
        break
    }

    let days = 30
    switch (timeframe) {
      case "1W":
        days = 7
        break
      case "1M":
        days = 30
        break
      case "3M":
        days = 90
        break
      case "1Y":
        days = 365
        break
    }

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))

      const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1
      mockData.push({
        date: date.toISOString().split("T")[0],
        price: price,
      })
    }

    setCommodityData(mockData)

    // Generate mock commodities list
    const mockCommodities = commodityList.map((commodity) => {
      let price = 100
      switch (commodity.symbol) {
        case "GOLD":
          price = 2000 + (Math.random() - 0.5) * 100
          break
        case "SILVER":
          price = 25 + (Math.random() - 0.5) * 2
          break
        case "CRUDE":
          price = 80 + (Math.random() - 0.5) * 10
          break
        case "NATGAS":
          price = 3.5 + (Math.random() - 0.5) * 0.5
          break
        case "WHEAT":
          price = 7.5 + (Math.random() - 0.5) * 1
          break
        case "CORN":
          price = 6.8 + (Math.random() - 0.5) * 0.8
          break
        case "COPPER":
          price = 4.2 + (Math.random() - 0.5) * 0.5
          break
        case "ALUMINUM":
          price = 1.1 + (Math.random() - 0.5) * 0.2
          break
      }

      return {
        symbol: commodity.symbol,
        name: commodity.name,
        price: price,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        unit: commodity.unit,
        category: commodity.category,
      }
    })

    setCommodities(mockCommodities)
  }

  useEffect(() => {
    fetchCommodityData()
  }, [selectedCommodity, timeframe])

  const currentCommodity = commodities.find((c) => c.symbol === selectedCommodity)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Precious Metals":
        return Coins
      case "Energy":
        return Zap
      case "Agriculture":
        return Wheat
      case "Industrial Metals":
        return Droplets
      default:
        return Coins
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Precious Metals":
        return "text-yellow-600"
      case "Energy":
        return "text-red-600"
      case "Agriculture":
        return "text-green-600"
      case "Industrial Metals":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Commodities Market</h1>
          <p className="text-gray-600">Track precious metals, energy, and agricultural commodity prices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Coins className="h-5 w-5" />
                      <span>{currentCommodity?.name || selectedCommodity} Price Chart</span>
                    </CardTitle>
                    <CardDescription>Live commodity market data and price movements</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {commodityList.map((commodity) => (
                          <SelectItem key={commodity.symbol} value={commodity.symbol}>
                            {commodity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1W">1W</SelectItem>
                        <SelectItem value="1M">1M</SelectItem>
                        <SelectItem value="3M">3M</SelectItem>
                        <SelectItem value="1Y">1Y</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Current Price Info */}
            {currentCommodity && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">Current Price</p>
                        <p className="text-xl font-bold">${currentCommodity.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{currentCommodity.unit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      {currentCommodity.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Change</p>
                        <p
                          className={`text-lg font-semibold ${currentCommodity.change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {currentCommodity.change >= 0 ? "+" : ""}${currentCommodity.change.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const IconComponent = getCategoryIcon(currentCommodity.category)
                        return <IconComponent className="h-4 w-4 text-purple-600" />
                      })()}
                      <div>
                        <p className="text-sm text-gray-600">Change %</p>
                        <p
                          className={`text-lg font-semibold ${currentCommodity.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {currentCommodity.changePercent >= 0 ? "+" : ""}
                          {currentCommodity.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Price Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Price Movement</CardTitle>
                <CardDescription>Historical price data and trends</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading commodity data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={commodityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value.toFixed(0)}`} />
                        <Tooltip
                          formatter={(value: any) => [`$${value.toFixed(2)}`, "Price"]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line type="monotone" dataKey="price" stroke="#F59E0B" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commodity Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Precious Metals", "Energy", "Agriculture", "Industrial Metals"].map((category) => {
                    const categoryItems = commodities.filter((c) => c.category === category)
                    const IconComponent = getCategoryIcon(category)
                    const colorClass = getCategoryColor(category)

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`h-4 w-4 ${colorClass}`} />
                          <span className="font-medium text-sm">{category}</span>
                        </div>
                        {categoryItems.map((commodity) => (
                          <div
                            key={commodity.symbol}
                            className={`ml-6 p-2 rounded cursor-pointer transition-colors ${
                              selectedCommodity === commodity.symbol
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedCommodity(commodity.symbol)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{commodity.name}</span>
                              <div className="flex items-center space-x-1">
                                {commodity.changePercent >= 0 ? (
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <span
                                  className={`text-xs ${commodity.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {commodity.changePercent >= 0 ? "+" : ""}
                                  {commodity.changePercent.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              ${commodity.price.toFixed(2)} {commodity.unit}
                            </p>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Gold</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Safe haven demand remains strong</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Oil</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Supply concerns drive prices higher</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Wheat className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Agriculture</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Weather patterns affect crop yields</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Fed Policy Impact</p>
                    <p className="text-gray-600">Interest rate decisions affect commodity demand</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Supply Chain Updates</p>
                    <p className="text-gray-600">Global logistics affecting commodity flows</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Weather Patterns</p>
                    <p className="text-gray-600">Climate impacts on agricultural commodities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
