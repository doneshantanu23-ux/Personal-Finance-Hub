"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, IndianRupee, Factory, Users, Zap } from "lucide-react"

interface EconomicData {
  date: string
  gdp: number
  inflation: number
  unemployment: number
  repoRate: number
  sensex: number
  nifty: number
  usdInr: number
}

interface Indicator {
  name: string
  value: number
  change: number
  unit: string
  icon: any
  color: string
}

export default function IndianEconomicIndicators() {
  const [selectedIndicator, setSelectedIndicator] = useState("gdp")
  const [timeframe, setTimeframe] = useState("1Y")
  const [economicData, setEconomicData] = useState<EconomicData[]>([])
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(false)

  const indicatorOptions = [
    { value: "gdp", label: "GDP Growth Rate" },
    { value: "inflation", label: "Inflation Rate (CPI)" },
    { value: "unemployment", label: "Unemployment Rate" },
    { value: "repoRate", label: "Repo Rate" },
    { value: "sensex", label: "BSE Sensex" },
    { value: "nifty", label: "NSE Nifty 50" },
    { value: "usdInr", label: "USD/INR Exchange Rate" },
  ]

  const fetchEconomicData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/indian-economic-data?indicator=${selectedIndicator}&timeframe=${timeframe}`)
      const data = await response.json()

      if (data.economicData) {
        setEconomicData(data.economicData)
      }
      if (data.indicators) {
        setIndicators(data.indicators)
      }
    } catch (error) {
      console.error("Error fetching economic data:", error)
      generateMockData()
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    // Generate mock economic data
    const mockData = []
    let months = 12

    switch (timeframe) {
      case "6M":
        months = 6
        break
      case "1Y":
        months = 12
        break
      case "2Y":
        months = 24
        break
    }

    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - (months - 1 - i))

      mockData.push({
        date: date.toISOString().split("T")[0],
        gdp: 6.5 + (Math.random() - 0.5) * 2,
        inflation: 5.2 + (Math.random() - 0.5) * 2,
        unemployment: 7.8 + (Math.random() - 0.5) * 1.5,
        repoRate: 6.5 + (Math.random() - 0.5) * 0.5,
        sensex: 65000 + (Math.random() - 0.5) * 10000,
        nifty: 19500 + (Math.random() - 0.5) * 3000,
        usdInr: 82.5 + (Math.random() - 0.5) * 2,
      })
    }

    setEconomicData(mockData)

    // Generate mock indicators
    const mockIndicators: Indicator[] = [
      {
        name: "GDP Growth Rate",
        value: 6.7,
        change: 0.3,
        unit: "%",
        icon: Factory,
        color: "text-blue-600",
      },
      {
        name: "Inflation Rate (CPI)",
        value: 5.1,
        change: -0.2,
        unit: "%",
        icon: TrendingUp,
        color: "text-red-600",
      },
      {
        name: "Unemployment Rate",
        value: 7.5,
        change: -0.3,
        unit: "%",
        icon: Users,
        color: "text-orange-600",
      },
      {
        name: "Repo Rate",
        value: 6.5,
        change: 0.0,
        unit: "%",
        icon: IndianRupee,
        color: "text-green-600",
      },
      {
        name: "BSE Sensex",
        value: 67234,
        change: 1.2,
        unit: "",
        icon: TrendingUp,
        color: "text-purple-600",
      },
      {
        name: "NSE Nifty 50",
        value: 20123,
        change: 0.8,
        unit: "",
        icon: TrendingUp,
        color: "text-indigo-600",
      },
      {
        name: "USD/INR",
        value: 82.75,
        change: 0.15,
        unit: "₹",
        icon: IndianRupee,
        color: "text-yellow-600",
      },
    ]

    setIndicators(mockIndicators)
  }

  useEffect(() => {
    fetchEconomicData()
  }, [selectedIndicator, timeframe])

  const getChartData = () => {
    return economicData.map((item) => ({
      date: item.date,
      value: item[selectedIndicator as keyof EconomicData] as number,
    }))
  }

  const formatValue = (value: number, indicator: string) => {
    switch (indicator) {
      case "sensex":
      case "nifty":
        return value.toLocaleString("en-IN", { maximumFractionDigits: 0 })
      case "usdInr":
        return value.toFixed(2)
      default:
        return value.toFixed(1)
    }
  }

  const getUnit = (indicator: string) => {
    switch (indicator) {
      case "sensex":
      case "nifty":
        return ""
      case "usdInr":
        return "₹"
      default:
        return "%"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Indian Economic Indicators</h1>
          <p className="text-gray-600">Track key economic metrics and trends for India</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <IndianRupee className="h-5 w-5" />
                      <span>Economic Indicators Dashboard</span>
                    </CardTitle>
                    <CardDescription>Real-time Indian economic data and analysis</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {indicatorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6M">6M</SelectItem>
                        <SelectItem value="1Y">1Y</SelectItem>
                        <SelectItem value="2Y">2Y</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Key Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {indicators.slice(0, 4).map((indicator, index) => {
                const IconComponent = indicator.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-4 w-4 ${indicator.color}`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{indicator.name}</p>
                          <p className="text-lg font-bold">
                            {formatValue(indicator.value, selectedIndicator)}
                            {indicator.unit}
                          </p>
                          <div className="flex items-center space-x-1">
                            {indicator.change >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${indicator.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {indicator.change >= 0 ? "+" : ""}
                              {indicator.change.toFixed(1)}
                              {indicator.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Main Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{indicatorOptions.find((opt) => opt.value === selectedIndicator)?.label} Trend</CardTitle>
                <CardDescription>Historical data and trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading economic data...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) =>
                            `${formatValue(value, selectedIndicator)}${getUnit(selectedIndicator)}`
                          }
                        />
                        <Tooltip
                          formatter={(value: any) => [
                            `${formatValue(value, selectedIndicator)}${getUnit(selectedIndicator)}`,
                            indicatorOptions.find((opt) => opt.value === selectedIndicator)?.label,
                          ]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
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
                <CardTitle className="text-lg">All Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {indicators.map((indicator, index) => {
                    const IconComponent = indicator.icon
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedIndicator === indicatorOptions[index]?.value
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedIndicator(indicatorOptions[index]?.value || "gdp")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className={`h-4 w-4 ${indicator.color}`} />
                            <span className="font-medium text-sm">{indicator.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {indicator.change >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${indicator.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {indicator.change >= 0 ? "+" : ""}
                              {indicator.change.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatValue(indicator.value, selectedIndicator)}
                          {indicator.unit}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Economic Outlook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">GDP Growth</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Steady growth trajectory maintained</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Inflation</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Within RBI target range</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Monetary Policy</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Accommodative stance continues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">RBI Policy Meeting</p>
                    <p className="text-gray-600">Next meeting scheduled for Feb 8, 2024</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">GDP Data Release</p>
                    <p className="text-gray-600">Q3 FY24 data expected on Feb 29, 2024</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Union Budget</p>
                    <p className="text-gray-600">Interim budget presented on Feb 1, 2024</p>
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
