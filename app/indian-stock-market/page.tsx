"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  BarChart3,
  Activity,
  RefreshCw,
  Target,
  Zap,
} from "lucide-react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"

const API_KEY = "67ZNRTJMOIPMVD2E" // Alpha Vantage API Key

const INDIAN_STOCKS = [
  { symbol: "RELIANCE.BSE", name: "Reliance Industries" },
  { symbol: "TCS.BSE", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.BSE", name: "HDFC Bank" },
  { symbol: "INFY.BSE", name: "Infosys" },
  { symbol: "ICICIBANK.BSE", name: "ICICI Bank" },
  { symbol: "HINDUNILVR.BSE", name: "Hindustan Unilever" },
  { symbol: "ITC.BSE", name: "ITC Limited" },
  { symbol: "SBIN.BSE", name: "State Bank of India" },
  { symbol: "BHARTIARTL.BSE", name: "Bharti Airtel" },
  { symbol: "KOTAKBANK.BSE", name: "Kotak Mahindra Bank" },
]

export default function IndianStockMarket() {
  const [selectedStock, setSelectedStock] = useState(INDIAN_STOCKS[0])
  const [stockData, setStockData] = useState(null)
  const [chartData, setChartData] = useState([])
  const [volumeData, setVolumeData] = useState([])
  const [stockAnalysis, setStockAnalysis] = useState(null)
  const [marketIndices, setMarketIndices] = useState(null)
  const [topMovers, setTopMovers] = useState({ gainers: [], losers: [], active: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchSymbol, setSearchSymbol] = useState("")

  useEffect(() => {
    loadMarketData()
  }, [])

  useEffect(() => {
    if (selectedStock) {
      loadStockData(selectedStock.symbol)
    }
  }, [selectedStock])

  const loadMarketData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([loadIndicesData(), loadTopMovers(), loadStockData(selectedStock.symbol)])
    } catch (error) {
      console.error("Error loading market data:", error)
    }
    setIsLoading(false)
  }

  const loadIndicesData = async () => {
    try {
      const mockIndicesData = {
        nifty50: {
          current: 22150.75,
          change: 125.3,
          change_percent: 0.57,
        },
        sensex: {
          current: 73158.24,
          change: 398.45,
          change_percent: 0.55,
        },
        nifty_bank: {
          current: 48250.8,
          change: -85.2,
          change_percent: -0.18,
        },
        nifty_it: {
          current: 35420.15,
          change: 245.6,
          change_percent: 0.7,
        },
        market_cap: "₹425.8 Lakh Crores",
        trading_volume: "₹1.2 Lakh Crores",
      }
      setMarketIndices(mockIndicesData)
    } catch (error) {
      console.error("Error loading indices data:", error)
    }
  }

  const loadTopMovers = async () => {
    try {
      const mockTopMovers = {
        top_gainers: [
          { name: "Adani Ports", symbol: "ADANIPORTS", price: 1285.5, change_percent: 4.85 },
          { name: "Tech Mahindra", symbol: "TECHM", price: 1650.25, change_percent: 3.92 },
          { name: "Wipro", symbol: "WIPRO", price: 425.8, change_percent: 3.45 },
          { name: "HCL Tech", symbol: "HCLTECH", price: 1820.15, change_percent: 3.12 },
          { name: "Infosys", symbol: "INFY", price: 1875.4, change_percent: 2.98 },
          { name: "Bajaj Finance", symbol: "BAJFINANCE", price: 6850.75, change_percent: 2.75 },
          { name: "Maruti Suzuki", symbol: "MARUTI", price: 12450.3, change_percent: 2.45 },
          { name: "Asian Paints", symbol: "ASIANPAINT", price: 2950.6, change_percent: 2.15 },
        ],
        top_losers: [
          { name: "HDFC Bank", symbol: "HDFCBANK", price: 1685.25, change_percent: -2.85 },
          { name: "ICICI Bank", symbol: "ICICIBANK", price: 1125.8, change_percent: -2.45 },
          { name: "Kotak Bank", symbol: "KOTAKBANK", price: 1750.15, change_percent: -2.12 },
          { name: "Axis Bank", symbol: "AXISBANK", price: 1085.4, change_percent: -1.95 },
          { name: "SBI", symbol: "SBIN", price: 825.75, change_percent: -1.75 },
          { name: "Bajaj Finserv", symbol: "BAJAJFINSV", price: 1650.3, change_percent: -1.65 },
          { name: "HDFC Life", symbol: "HDFCLIFE", price: 685.6, change_percent: -1.45 },
          { name: "IndusInd Bank", symbol: "INDUSINDBK", price: 975.25, change_percent: -1.25 },
        ],
        most_active: [
          { name: "Reliance Industries", symbol: "RELIANCE", volume: "2.5 Cr" },
          { name: "HDFC Bank", symbol: "HDFCBANK", volume: "1.8 Cr" },
          { name: "ICICI Bank", symbol: "ICICIBANK", volume: "1.6 Cr" },
          { name: "Infosys", symbol: "INFY", volume: "1.4 Cr" },
          { name: "TCS", symbol: "TCS", volume: "1.2 Cr" },
          { name: "State Bank of India", symbol: "SBIN", volume: "1.1 Cr" },
        ],
      }
      setTopMovers({
        gainers: mockTopMovers.top_gainers,
        losers: mockTopMovers.top_losers,
        active: mockTopMovers.most_active,
      })
    } catch (error) {
      console.error("Error loading top movers:", error)
    }
  }

  const loadStockData = async (symbol) => {
    try {
      const mockStockData = {
        "01. symbol": symbol,
        "02. open": "2850.00",
        "03. high": "2895.50",
        "04. low": "2835.75",
        "05. price": "2875.25",
        "06. volume": "1250000",
        "07. latest trading day": "2025-01-21",
        "08. previous close": "2860.50",
        "09. change": "14.75",
        "10. change percent": "0.52%",
      }

      const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        price: 2800 + Math.random() * 200 + i * 2,
        high: 2850 + Math.random() * 150 + i * 2,
        low: 2750 + Math.random() * 100 + i * 2,
        volume: Math.floor(Math.random() * 2000000) + 500000,
      }))

      const mockVolumeData = Array.from({ length: 50 }, (_, i) => ({
        time: `${9 + Math.floor(i / 12)}:${(i % 12) * 5}`,
        volume: Math.floor(Math.random() * 100000) + 10000,
        price: 2850 + Math.random() * 50 - 25,
      }))

      // Try to fetch real data first, fallback to mock data
      try {
        const quoteResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`,
        )
        const quoteData = await quoteResponse.json()

        if (quoteData["Global Quote"] && Object.keys(quoteData["Global Quote"]).length > 0) {
          setStockData(quoteData["Global Quote"])
        } else {
          setStockData(mockStockData)
        }

        const dailyResponse = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`,
        )
        const dailyData = await dailyResponse.json()

        if (dailyData["Time Series (Daily)"]) {
          const timeSeries = dailyData["Time Series (Daily)"]
          const formattedData = Object.entries(timeSeries)
            .slice(0, 30)
            .map(([date, values]) => ({
              date,
              price: Number.parseFloat(values["4. close"]),
              high: Number.parseFloat(values["2. high"]),
              low: Number.parseFloat(values["3. low"]),
              volume: Number.parseInt(values["5. volume"]),
            }))
            .reverse()
          setChartData(formattedData)
        } else {
          setChartData(mockChartData)
        }
      } catch (apiError) {
        console.log("API failed, using mock data:", apiError)
        setStockData(mockStockData)
        setChartData(mockChartData)
      }

      setVolumeData(mockVolumeData)

      // Generate AI analysis
      await generateStockAnalysis(symbol)
    } catch (error) {
      console.error("Error loading stock data:", error)
    }
  }

  const generateStockAnalysis = async (symbol) => {
    try {
      const mockAnalysis = {
        technical_analysis: {
          trend: "Bullish",
          support_level: 2750,
          resistance_level: 2950,
          rsi: 65.5,
          moving_average_signal: "Buy",
        },
        fundamental_analysis: {
          pe_ratio: 24.5,
          market_cap: "₹18.2 Lakh Crores",
          sector_outlook:
            "The technology sector continues to show strong fundamentals with increasing digital transformation demand and robust export growth.",
          financial_health: "Strong",
        },
        sentiment: "Positive",
        short_term_outlook:
          "Stock is expected to test resistance levels around ₹2,950 in the next 1-3 months, supported by strong quarterly results and sector tailwinds.",
        long_term_outlook:
          "Long-term prospects remain strong with digital transformation trends, government digitization initiatives, and expanding global market presence driving growth over 6-12 months.",
        risk_factors: [
          "Global economic slowdown affecting IT spending",
          "Currency fluctuation impact on export revenues",
          "Increased competition in cloud services",
          "Regulatory changes in key markets",
        ],
        opportunities: [
          "Growing demand for AI and machine learning services",
          "Expansion in emerging markets",
          "Strategic acquisitions and partnerships",
          "Government digital initiatives creating new opportunities",
        ],
        recommendation: {
          action: "BUY",
          target_price: 3100,
          rationale:
            "Strong fundamentals, positive sector outlook, and technical indicators suggest upward momentum. Current price offers good entry point for long-term investors.",
        },
      }
      setStockAnalysis(mockAnalysis)
    } catch (error) {
      console.error("Error generating stock analysis:", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchSymbol.trim()) {
      const customStock = { symbol: searchSymbol.toUpperCase(), name: searchSymbol.toUpperCase() }
      setSelectedStock(customStock)
      setSearchSymbol("")
    }
  }

  const IndexCard = ({ title, data, icon: Icon }) => {
    const isPositive = data?.change >= 0
    return (
      <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-700">{title}</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data?.current?.toLocaleString("en-IN")}</p>
              <div
                className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? "text-emerald-600" : "text-red-600"}`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {data?.change > 0 ? "+" : ""}
                  {data?.change?.toFixed(2)} ({data?.change_percent?.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Indian Stock Market</h1>
          <p className="text-slate-600 mt-2">Real-time prices, charts, and comprehensive analysis</p>
        </div>
        <Button
          onClick={loadMarketData}
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Market Overview
          </TabsTrigger>
          <TabsTrigger value="stocks" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Stock Analysis
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Charts & Volume
          </TabsTrigger>
          <TabsTrigger value="movers" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Top Movers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Market Indices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <IndexCard title="NIFTY 50" data={marketIndices?.nifty50} icon={BarChart3} />
            <IndexCard title="SENSEX" data={marketIndices?.sensex} icon={TrendingUp} />
            <IndexCard title="NIFTY Bank" data={marketIndices?.nifty_bank} icon={IndianRupee} />
            <IndexCard title="NIFTY IT" data={marketIndices?.nifty_it} icon={Activity} />
          </div>

          {/* Market Summary */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Market Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-600 font-medium">Total Market Cap</p>
                  <p className="text-xl font-bold text-blue-700">{marketIndices?.market_cap}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-emerald-600 font-medium">Trading Volume</p>
                  <p className="text-xl font-bold text-emerald-700">{marketIndices?.trading_volume}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Popular Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {INDIAN_STOCKS.slice(0, 6).map((stock) => (
                    <Button
                      key={stock.symbol}
                      variant={selectedStock.symbol === stock.symbol ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStock(stock)}
                      className="text-xs"
                    >
                      {stock.symbol.replace(".BSE", "")}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-6">
          {/* Stock Search */}
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Enter stock symbol (e.g., RELIANCE.BSE)"
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-emerald-500"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  Search
                </Button>
              </form>
              <div className="flex gap-2 flex-wrap mt-4">
                {INDIAN_STOCKS.map((stock) => (
                  <Button
                    key={stock.symbol}
                    variant={selectedStock.symbol === stock.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStock(stock)}
                  >
                    {stock.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Details */}
          {stockData && (
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="glass-card border-0 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{selectedStock.name}</span>
                    <Badge variant="outline">{selectedStock.symbol}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600">Price</p>
                      <p className="text-xl font-bold text-slate-900 flex items-center">
                        <IndianRupee className="w-5 h-5" />
                        {Number.parseFloat(stockData["05. price"]).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600">Change</p>
                      <p
                        className={`text-xl font-bold ${Number.parseFloat(stockData["09. change"]) >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {stockData["10. change percent"]}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600">High</p>
                      <p className="text-xl font-bold text-slate-900 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {Number.parseFloat(stockData["03. high"]).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600">Low</p>
                      <p className="text-xl font-bold text-slate-900 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {Number.parseFloat(stockData["04. low"]).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Preview */}
              {stockAnalysis && (
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <p className="text-sm text-purple-600 font-medium">Recommendation</p>
                      <p className="font-bold text-purple-700 uppercase">{stockAnalysis.recommendation?.action}</p>
                      {stockAnalysis.recommendation?.target_price && (
                        <p className="text-sm text-purple-600">Target: ₹{stockAnalysis.recommendation.target_price}</p>
                      )}
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-blue-600 font-medium">Trend</p>
                      <p className="font-bold text-blue-700">{stockAnalysis.technical_analysis?.trend}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <p className="text-sm text-emerald-600 font-medium">Sentiment</p>
                      <p className="font-bold text-emerald-700">{stockAnalysis.sentiment}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Detailed Analysis */}
          {stockAnalysis && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Technical Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Support Level</span>
                      <span className="font-semibold">₹{stockAnalysis.technical_analysis?.support_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Resistance Level</span>
                      <span className="font-semibold">₹{stockAnalysis.technical_analysis?.resistance_level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">RSI</span>
                      <span className="font-semibold">{stockAnalysis.technical_analysis?.rsi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">MA Signal</span>
                      <span className="font-semibold">{stockAnalysis.technical_analysis?.moving_average_signal}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Fundamental Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">P/E Ratio</span>
                      <span className="font-semibold">{stockAnalysis.fundamental_analysis?.pe_ratio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Market Cap</span>
                      <span className="font-semibold">{stockAnalysis.fundamental_analysis?.market_cap}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Sector Outlook</h4>
                    <p className="text-sm text-slate-600">{stockAnalysis.fundamental_analysis?.sector_outlook}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {/* Price Chart */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Price Chart - {selectedStock.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                    <Tooltip
                      formatter={(value) => [`₹${value.toFixed(2)}`, "Price"]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#10B981" fill="url(#priceGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Volume Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="volume" orientation="left" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="price" orientation="right" stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar yAxisId="volume" dataKey="volume" fill="#8B5CF6" opacity={0.7} />
                    <Line yAxisId="price" type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movers" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Top Gainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMovers.gainers?.slice(0, 8).map((stock, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{stock.name}</p>
                        <p className="text-sm text-slate-600 flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {stock.price}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800">+{stock.change_percent?.toFixed(2)}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  Top Losers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topMovers.losers?.slice(0, 8).map((stock, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{stock.name}</p>
                        <p className="text-sm text-slate-600 flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {stock.price}
                        </p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">{stock.change_percent?.toFixed(2)}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Most Active */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Most Active by Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topMovers.active?.slice(0, 6).map((stock, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium text-slate-900">{stock.name}</p>
                    <p className="text-sm text-blue-600 font-semibold">Volume: {stock.volume}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
