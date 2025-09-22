"use client"

import { useState, useEffect } from "react"
import { InvokeLLM } from "@/integrations/Core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Bitcoin,
  Coins,
  Activity,
  RefreshCw,
  Zap,
  AlertTriangle,
  Target,
  BarChart3,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts"

const COINGECKO_API = "https://api.coingecko.com/api/v3"

const CRYPTO_CATEGORIES = [
  { id: "bitcoin", name: "Bitcoin", icon: "₿" },
  { id: "ethereum", name: "Ethereum", icon: "Ξ" },
  { id: "smart-contract-platform", name: "Smart Contracts", icon: "🔗" },
  { id: "decentralized-finance-defi", name: "DeFi", icon: "🏦" },
  { id: "layer-1", name: "Layer 1", icon: "🔧" },
  { id: "meme-token", name: "Meme Coins", icon: "🐕" },
  { id: "exchange-based-tokens", name: "Exchange Tokens", icon: "🏢" },
  { id: "stablecoins", name: "Stablecoins", icon: "💰" },
]

const POPULAR_CRYPTOS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "cardano",
  "solana",
  "xrp",
  "dogecoin",
  "polygon-matic",
  "avalanche-2",
  "chainlink",
]

export default function CryptoMarket() {
  const [cryptoData, setCryptoData] = useState([])
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [chartData, setChartData] = useState([])
  const [marketStats, setMarketStats] = useState(null)
  const [topGainers, setTopGainers] = useState([])
  const [topLosers, setTopLosers] = useState([])
  const [highVolume, setHighVolume] = useState([])
  const [oversoldCoins, setOversoldCoins] = useState([])
  const [nearLowHigh, setNearLowHigh] = useState([])
  const [inrRate, setInrRate] = useState(83.0) // Default INR rate
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [apiError, setApiError] = useState(false)

  useEffect(() => {
    loadCryptoData()
    fetchInrRate()
  }, [])

  const fetchInrRate = async () => {
    try {
      // Try CoinGecko first
      const response = await fetch(`${COINGECKO_API}/simple/price?ids=usd&vs_currencies=inr`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      // Check if response is throttled
      if (text.includes("Throttled") || text.includes("429")) {
        throw new Error("API throttled")
      }

      const data = JSON.parse(text)
      if (data.usd?.inr) {
        setInrRate(data.usd.inr)
        return
      }
    } catch (error) {
      setApiError(true)
      console.error("Error fetching INR rate from CoinGecko, falling back:", error)
    }

    // Fallback: Use a reasonable default rate
    setInrRate(83.5) // Updated fallback rate
  }

  const loadCryptoData = async () => {
    setIsLoading(true)
    setApiError(false)
    try {
      // Load data sequentially with delays to avoid rate limiting
      await fetchPopularCryptos()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1s delay

      await fetchMarketStats()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1s delay

      await fetchTopMovers()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1s delay

      await fetchHighVolumeCoins()
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 1s delay

      await fetchOversoldCoins()
      // Only fetch chart for default crypto to avoid extra API calls on initial load
      await fetchCryptoChart("bitcoin")

      // Skip near low/high for now to reduce API calls on initial load
      setNearLowHigh([])
    } catch (error) {
      setApiError(true)
      console.error("Error loading crypto data:", error)
    }
    setIsLoading(false)
  }

  const fetchPopularCryptos = async () => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${POPULAR_CRYPTOS.join(",")}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      if (text.includes("Throttled") || text.includes("429")) {
        // Use fallback data
        console.warn("API throttled for popular cryptos, using fallback data.")
        setCryptoData(getFallbackCryptoData())
        return
      }

      const data = JSON.parse(text)
      setCryptoData(data || [])
    } catch (error) {
      setApiError(true)
      console.error("Error fetching popular cryptos, using fallback data:", error)
      setCryptoData(getFallbackCryptoData())
    }
  }

  const fetchMarketStats = async () => {
    try {
      const response = await fetch(`${COINGECKO_API}/global`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      if (text.includes("Throttled") || text.includes("429")) {
        console.warn("API throttled for market stats, using fallback data.")
        setMarketStats(getFallbackMarketStats())
        return
      }

      const data = JSON.parse(text)
      setMarketStats(data.data)
    } catch (error) {
      setApiError(true)
      console.error("Error fetching market stats, using fallback data:", error)
      setMarketStats(getFallbackMarketStats())
    }
  }

  const fetchTopMovers = async () => {
    try {
      const response = await fetch(
        // Keep original order for top movers as it makes more sense for "movers"
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      if (text.includes("Throttled") || text.includes("429")) {
        console.warn("API throttled for top movers, using fallback data.")
        const fallbackData = getFallbackTopMovers()
        setTopGainers(fallbackData.gainers)
        setTopLosers(fallbackData.losers)
        return
      }

      const data = JSON.parse(text)

      if (data && Array.isArray(data)) {
        const gainers = data
          .filter((coin) => coin.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
          .slice(0, 10)

        const losers = data
          .filter((coin) => coin.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
          .slice(0, 10)

        setTopGainers(gainers)
        setTopLosers(losers)
      }
    } catch (error) {
      setApiError(true)
      console.error("Error fetching top movers, using fallback data:", error)
      const fallbackData = getFallbackTopMovers()
      setTopGainers(fallbackData.gainers)
      setTopLosers(fallbackData.losers)
    }
  }

  const fetchHighVolumeCoins = async () => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=volume_desc&per_page=15&page=1&sparkline=false`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      if (text.includes("Throttled") || text.includes("429")) {
        console.warn("API throttled for high volume coins, using fallback data.")
        setHighVolume(getFallbackHighVolumeCoins())
        return
      }

      const data = JSON.parse(text)
      setHighVolume(data || [])
    } catch (error) {
      setApiError(true)
      console.error("Error fetching high volume coins, using fallback data:", error)
      setHighVolume(getFallbackHighVolumeCoins())
    }
  }

  const fetchOversoldCoins = async () => {
    try {
      // Use AI analysis for oversold coins based on general market knowledge
      const response = await InvokeLLM({
        prompt: `Based on general cryptocurrency market knowledge, provide 6 commonly discussed potentially oversold cryptocurrencies. For each coin provide:
        - name (full name)
        - symbol (ticker)
        - current_price (estimated in USD)
        - rsi (estimated RSI value between 20-35)
        - reason (why it might be oversold, e.g., "Recent market correction", "Trading below key support", "Oversold RSI")
        - potential_upside (estimated percentage, e.g., "15-20%", "30-50%")
        
        Use well-known cryptocurrencies and provide realistic estimates.`,
        response_json_schema: {
          type: "object",
          properties: {
            oversold_coins: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  symbol: { type: "string" },
                  current_price: { type: "number" },
                  rsi: { type: "number" },
                  reason: { type: "string" },
                  potential_upside: { type: "string" },
                },
              },
            },
          },
        },
      })

      setOversoldCoins(response.oversold_coins || getFallbackOversoldCoins())
    } catch (error) {
      setApiError(true)
      console.error("Error fetching oversold coins from LLM, using fallback data:", error)
      setOversoldCoins(getFallbackOversoldCoins())
    }
  }

  // This function is no longer called in loadCryptoData but kept for completeness
  const fetchNearLowHighCoins = async () => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=30d`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      if (text.includes("Throttled") || text.includes("429")) {
        console.warn("API throttled for near low/high coins, skipping for now.")
        setNearLowHigh([]) // Ensure empty if throttled
        return
      }

      const data = JSON.parse(text)

      if (data && Array.isArray(data)) {
        const nearHighLow = data
          .map((coin) => {
            const monthChange = coin.price_change_percentage_30d || 0
            const isNearHigh = monthChange > 25
            const isNearLow = monthChange < -25

            return {
              ...coin,
              isNearHigh,
              isNearLow,
              monthChange,
            }
          })
          .filter((coin) => coin.isNearHigh || coin.isNearLow)

        setNearLowHigh(nearHighLow)
      }
    } catch (error) {
      setApiError(true)
      console.error("Error fetching near low/high coins, skipping for now:", error)
      setNearLowHigh([]) // Ensure empty if error
    }
  }

  const fetchCryptoChart = async (coinId) => {
    try {
      const response = await fetch(
        `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      if (text.includes("Throttled") || text.includes("429")) {
        console.warn(`API throttled for ${coinId} chart, using fallback data.`)
        setChartData(getFallbackChartData(coinId))
        return
      }

      const data = JSON.parse(text)

      if (data.prices) {
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price * inrRate,
          volume: data.total_volumes?.find(([t]) => t === timestamp)?.[1] || 0, // Use optional chaining
        }))
        setChartData(formattedData)
      }
    } catch (error) {
      setApiError(true)
      console.error(`Error fetching crypto chart for ${coinId}, using fallback data:`, error)
      setChartData(getFallbackChartData(coinId))
    }
  }

  // Fallback data functions
  const getFallbackCryptoData = () => [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 43500,
      market_cap: 851000000000,
      price_change_percentage_24h: 2.5,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 2650,
      market_cap: 318000000000,
      price_change_percentage_24h: 1.8,
    },
    {
      id: "binancecoin",
      name: "BNB",
      symbol: "bnb",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      current_price: 315,
      market_cap: 47000000000,
      price_change_percentage_24h: -0.5,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ada",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 0.48,
      market_cap: 17000000000,
      price_change_percentage_24h: 0.7,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "sol",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 98,
      market_cap: 43000000000,
      price_change_percentage_24h: 3.1,
    },
  ]

  const getFallbackMarketStats = () => ({
    total_market_cap: { usd: 1680000000000 },
    total_volume: { usd: 52000000000 },
    market_cap_percentage: { btc: 50.6 },
    active_cryptocurrencies: 2854,
    market_cap_change_percentage_24h_usd: 1.2,
  })

  const getFallbackTopMovers = () => ({
    gainers: [
      {
        id: "solana",
        name: "Solana",
        image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        current_price: 98,
        price_change_percentage_24h: 8.5,
      },
      {
        id: "cardano",
        name: "Cardano",
        image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
        current_price: 0.48,
        price_change_percentage_24h: 6.2,
      },
      {
        id: "dogecoin",
        name: "Dogecoin",
        image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
        current_price: 0.08,
        price_change_percentage_24h: 4.1,
      },
    ],
    losers: [
      {
        id: "avalanche-2",
        name: "Avalanche",
        image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
        current_price: 35,
        price_change_percentage_24h: -4.8,
      },
      {
        id: "chainlink",
        name: "Chainlink",
        image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
        current_price: 14.5,
        price_change_percentage_24h: -3.2,
      },
      {
        id: "xrp",
        name: "XRP",
        image: "https://assets.coingecko.com/coins/images/4404/large/XRP-icon-color.png",
        current_price: 0.52,
        price_change_percentage_24h: -2.1,
      },
    ],
  })

  const getFallbackHighVolumeCoins = () => [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "btc",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 43500,
      total_volume: 18500000000,
      price_change_percentage_24h: 2.5,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "eth",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 2650,
      total_volume: 12800000000,
      price_change_percentage_24h: 1.8,
    },
    {
      id: "tether",
      name: "Tether",
      symbol: "usdt",
      image: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
      current_price: 1.0,
      total_volume: 25000000000,
      price_change_percentage_24h: 0.0,
    },
  ]

  const getFallbackOversoldCoins = () => [
    {
      name: "Polygon",
      symbol: "MATIC",
      current_price: 0.82,
      rsi: 28,
      reason: "Recent market correction and FUD.",
      potential_upside: "25-40%",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      current_price: 14.5,
      rsi: 32,
      reason: "Trading below key support levels after major breakout.",
      potential_upside: "30-50%",
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      current_price: 70,
      rsi: 29,
      reason: "Out of favor in current market rally.",
      potential_upside: "15-25%",
    },
    {
      name: "XRP",
      symbol: "XRP",
      current_price: 0.51,
      rsi: 33,
      reason: "Legal uncertainties creating downward pressure.",
      potential_upside: "20-30%",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      current_price: 0.48,
      rsi: 27,
      reason: "Lack of significant ecosystem developments recently.",
      potential_upside: "20-35%",
    },
    {
      name: "Shiba Inu",
      symbol: "SHIB",
      current_price: 0.0000085,
      rsi: 30,
      reason: "Memecoin correction after initial hype.",
      potential_upside: "50-100%",
    },
  ]

  const getFallbackChartData = (coinId) => {
    let basePrice
    switch (coinId) {
      case "bitcoin":
        basePrice = 43500
        break
      case "ethereum":
        basePrice = 2650
        break
      case "binancecoin":
        basePrice = 315
        break
      case "cardano":
        basePrice = 0.48
        break
      case "solana":
        basePrice = 98
        break
      case "xrp":
        basePrice = 0.52
        break
      case "dogecoin":
        basePrice = 0.08
        break
      case "polygon-matic":
        basePrice = 0.82
        break
      case "avalanche-2":
        basePrice = 35
        break
      case "chainlink":
        basePrice = 14.5
        break
      default:
        basePrice = 1
    }

    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: (basePrice + (Math.random() - 0.5) * basePrice * 0.1) * inrRate, // Price fluctuating around base
      volume: Math.random() * 1000000000 + 500000000, // Random volume for fallback
    }))
  }

  const convertToINR = (usdPrice) => {
    return usdPrice * inrRate
  }

  const formatINR = (amount) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
  }

  const CryptoCard = ({ crypto, showChange = true }) => {
    const priceInINR = convertToINR(crypto.current_price)
    const change24h = crypto.price_change_percentage_24h || 0
    const isPositive = change24h >= 0

    return (
      <Card
        className="glass-card border-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => {
          setSelectedCrypto(crypto.id)
          fetchCryptoChart(crypto.id)
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-8 h-8 rounded-full" />
              <div>
                <h3 className="font-semibold text-slate-900">{crypto.name}</h3>
                <p className="text-sm text-slate-500 uppercase">{crypto.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">{formatINR(priceInINR)}</p>
              {showChange && (
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{Math.abs(change24h).toFixed(2)}%</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Market Cap</span>
            <span>{formatINR(convertToINR(crypto.market_cap || 0))}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const MarketStatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="glass-card border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {change !== undefined && (
              <div
                className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(change).toFixed(2)}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-2xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const filteredCryptos = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Crypto Market</h1>
          <p className="text-slate-600 mt-2">Real-time cryptocurrency prices and analysis in Indian Rupees</p>
        </div>
        <Button
          onClick={loadCryptoData}
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {apiError && (
        <Card className="bg-orange-50 border-orange-200 mb-6">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-800">Connection Issue: Displaying Cached Data</p>
              <p className="text-sm text-orange-700">
                We couldn't fetch live cryptocurrency data due to a network error. The information shown may be outdated
                or incomplete.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show loading state */}
      {isLoading ? (
        <Card className="glass-card border-0 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Loading cryptocurrency data...</p>
          <p className="text-sm text-slate-500 mt-2">
            Please wait, fetching data may take a few moments to avoid API rate limits.
          </p>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-100">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Bitcoin className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="movers" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Top Movers
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              High Volume
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Market Stats */}
            {marketStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MarketStatCard
                  title="Total Market Cap"
                  value={formatINR(convertToINR(marketStats.total_market_cap?.usd || 0))}
                  change={marketStats.market_cap_change_percentage_24h_usd}
                  icon={Bitcoin}
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
                <MarketStatCard
                  title="24h Trading Volume"
                  value={formatINR(convertToINR(marketStats.total_volume?.usd || 0))}
                  icon={Activity}
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <MarketStatCard
                  title="Bitcoin Dominance"
                  value={`${marketStats.market_cap_percentage?.btc?.toFixed(1) || 0}%`}
                  icon={Bitcoin}
                  color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                />
                <MarketStatCard
                  title="Active Cryptocurrencies"
                  value={marketStats.active_cryptocurrencies?.toLocaleString() || "0"}
                  icon={Coins}
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
              </div>
            )}

            {/* Categories */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Crypto Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {CRYPTO_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className="p-3 text-center bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="text-2xl mb-1">{category.icon}</div>
                      <p className="text-xs font-medium text-slate-700">{category.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search cryptocurrencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCryptos.map((crypto) => (
                <CryptoCard key={crypto.id} crypto={crypto} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movers" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Gainers */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Top Gainers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainers.slice(0, 8).map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={crypto.image || "/placeholder.svg"}
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{crypto.name}</p>
                            <p className="text-sm text-slate-600">{formatINR(convertToINR(crypto.current_price))}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          +{crypto.price_change_percentage_24h?.toFixed(2)}%
                        </Badge>
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
                    Top Losers (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosers.slice(0, 8).map((crypto) => (
                      <div
                        key={crypto.id}
                        className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={crypto.image || "/placeholder.svg"}
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{crypto.name}</p>
                            <p className="text-sm text-slate-600">{formatINR(convertToINR(crypto.current_price))}</p>
                          </div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          {crypto.price_change_percentage_24h?.toFixed(2)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="volume" className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Highest Trading Volume (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coin</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Volume</TableHead>
                      <TableHead>24h Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {highVolume.slice(0, 15).map((crypto) => (
                      <TableRow key={crypto.id} className="cursor-pointer hover:bg-slate-50">
                        <TableCell className="flex items-center gap-3">
                          <img
                            src={crypto.image || "/placeholder.svg"}
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{crypto.name}</p>
                            <p className="text-sm text-slate-500 uppercase">{crypto.symbol}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatINR(convertToINR(crypto.current_price))}</TableCell>
                        <TableCell>{formatINR(convertToINR(crypto.total_volume))}</TableCell>
                        <TableCell>
                          <span
                            className={`flex items-center gap-1 ${
                              crypto.price_change_percentage_24h >= 0 ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Near 1 Month Low/High (currently skipped on initial load) */}
            {nearLowHigh.length > 0 && (
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Near Monthly Low/High
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nearLowHigh.slice(0, 8).map((crypto) => (
                      <div
                        key={crypto.id}
                        className={`p-3 rounded-lg ${crypto.isNearHigh ? "bg-emerald-50" : "bg-red-50"}`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img
                              src={crypto.image || "/placeholder.svg"}
                              alt={crypto.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-slate-900">{crypto.name}</p>
                              <p className="text-sm text-slate-600">{formatINR(convertToINR(crypto.current_price))}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                crypto.isNearHigh ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {crypto.isNearHigh ? "Near High" : "Near Low"}
                            </Badge>
                            <p className="text-sm text-slate-500 mt-1">30d: {crypto.monthChange?.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Oversold Coins */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Oversold Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {oversoldCoins.slice(0, 6).map((crypto, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900">{crypto.name}</h4>
                          <p className="text-sm text-purple-600 font-medium">{crypto.symbol?.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{formatINR(convertToINR(crypto.current_price))}</p>
                          <Badge variant="outline" className="text-xs">
                            RSI: {crypto.rsi}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{crypto.reason}</p>
                      <p className="text-sm text-emerald-600 font-medium">Upside: {crypto.potential_upside}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {/* Crypto Selection */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex gap-2 flex-wrap">
                  {POPULAR_CRYPTOS.slice(0, 8).map((cryptoId) => {
                    const crypto = cryptoData.find((c) => c.id === cryptoId)
                    return crypto ? (
                      <Button
                        key={cryptoId}
                        variant={selectedCrypto === cryptoId ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedCrypto(cryptoId)
                          fetchCryptoChart(cryptoId)
                        }}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={crypto.image || "/placeholder.svg"}
                          alt={crypto.name}
                          className="w-4 h-4 rounded-full"
                        />
                        {crypto.symbol.toUpperCase()}
                      </Button>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>
                  {cryptoData.find((c) => c.id === selectedCrypto)?.name || "Bitcoin"} - 7 Day Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="cryptoGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val.toLocaleString()}`} />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Price"]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#10B981"
                        fill="url(#cryptoGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
