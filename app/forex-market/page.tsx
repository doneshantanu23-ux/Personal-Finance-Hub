"use client"

import { useState, useEffect } from "react"
import { ForexPosition } from "@/entities/ForexPosition"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Landmark, CandlestickChart, BookOpen, BarChart2, IndianRupee } from "lucide-react"

// Import Components for the Forex Page
import EducationalContent from "./components/EducationalContent"
import PositionTracker from "./components/PositionTracker"
import AccountStats from "./components/AccountStats"
import ForexChart from "./components/ForexChart"
import MarketAnalysis from "./components/MarketAnalysis"

const API_KEY = "67ZNRTJMOIPMVD2E" // Alpha Vantage API Key

export default function ForexMarket() {
  const [activeTab, setActiveTab] = useState("learn")
  const [positions, setPositions] = useState([])
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [inrRate, setInrRate] = useState(83.5) // Default fallback rate
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)
    await Promise.all([fetchPositions(), fetchUsdInrRate()])
    setIsLoading(false)
  }

  const fetchPositions = async () => {
    try {
      const positionData = await ForexPosition.list("-open_date")
      setPositions(positionData)
    } catch (error) {
      console.error("Error fetching positions:", error)
      setPositions([])
    }
  }

  const fetchUsdInrRate = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${API_KEY}`,
      )
      const data = await response.json()

      // Check if the expected data structure exists
      if (
        data &&
        data["Realtime Currency Exchange Rate"] &&
        data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
      ) {
        const rate = Number.parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
        if (rate && !isNaN(rate)) {
          setInrRate(rate)
        }
      } else {
        console.warn("API response structure unexpected, using fallback rate")
      }
    } catch (error) {
      console.error("Failed to fetch INR rate, using fallback.", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Forex Market Terminal</h1>
          <p className="text-slate-600 mt-2">Analyze, trade, and learn about the foreign exchange market.</p>
        </div>
        <Card className="glass-card p-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-orange-500" />
            <span className="font-semibold">1 USD = ₹{inrRate.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-slate-100">
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Learn Forex
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <CandlestickChart className="w-4 h-4" />
            Charts & Analysis
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <Landmark className="w-4 h-4" />
            Trade Journal
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Account Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learn">
          <EducationalContent />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <ForexChart pair={selectedPair} inrRate={inrRate} onPairChange={setSelectedPair} />
            <MarketAnalysis pair={selectedPair} />
          </div>
        </TabsContent>

        <TabsContent value="journal">
          <PositionTracker positions={positions} inrRate={inrRate} refreshPositions={fetchPositions} />
        </TabsContent>

        <TabsContent value="stats">
          <AccountStats positions={positions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
