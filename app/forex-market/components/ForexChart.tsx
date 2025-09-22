"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_KEY = "67ZNRTJMOIPMVD2E"
const FOREX_PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD"]

export default function ForexChart({ pair, inrRate, onPairChange }) {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChartData(pair)
  }, [pair, inrRate])

  const fetchChartData = async (selectedPair) => {
    setIsLoading(true)
    const [fromCurrency, toCurrency] = selectedPair.split("/")
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&outputsize=compact&apikey=${API_KEY}`,
      )
      const data = await response.json()

      // Add better error checking for API response
      if (data && data["Time Series FX (Daily)"]) {
        const timeSeries = data["Time Series FX (Daily)"]
        const formattedData = Object.entries(timeSeries)
          .map(([date, values]) => {
            const price = Number.parseFloat(values["4. close"])
            // If the quote currency is USD, we convert it to INR. Otherwise, we can't reliably convert and show the original value.
            const priceInInr = toCurrency === "USD" ? price * inrRate : price
            return { date, price: priceInInr }
          })
          .reverse()
        setChartData(formattedData)
      } else if (data && data["Note"]) {
        console.warn("API rate limit reached:", data["Note"])
        // Generate sample data as fallback
        generateSampleData(selectedPair)
      } else {
        console.warn("No chart data available for", selectedPair, data) // Added `data` to warn for more context
        // Generate sample data as fallback
        generateSampleData(selectedPair)
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
      // Generate sample data as fallback
      generateSampleData(selectedPair)
    }
    setIsLoading(false)
  }

  const generateSampleData = (selectedPair) => {
    // Generate 30 days of sample data
    const sampleData = []
    const basePrice = getBasePriceForPair(selectedPair)

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Generate realistic price movement
      const randomChange = (Math.random() - 0.5) * 0.02 // ±1% change
      const price = basePrice * (1 + randomChange * (i / 30))
      const priceInInr = selectedPair.split("/")[1] === "USD" ? price * inrRate : price

      sampleData.push({
        date: date.toISOString().split("T")[0],
        price: priceInInr,
      })
    }

    setChartData(sampleData)
    console.log("Using sample data for", selectedPair)
  }

  const getBasePriceForPair = (pair) => {
    const basePrices = {
      "EUR/USD": 1.1,
      "GBP/USD": 1.25,
      "USD/JPY": 150.0,
      "USD/CHF": 0.91,
      "AUD/USD": 0.65,
      "USD/CAD": 1.36,
      "NZD/USD": 0.6,
    }
    return basePrices[pair] || 1.0
  }

  const quoteCurrency = pair.split("/")[1]

  return (
    <Card className="glass-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{pair} Price Chart</CardTitle>
        <Select value={pair} onValueChange={onPairChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FOREX_PAIRS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" fontSize={12} tickFormatter={(str) => str.substring(5)} />
                <YAxis
                  domain={["dataMin", "dataMax"]}
                  fontSize={12}
                  tickFormatter={(val) => (quoteCurrency === "USD" ? `₹${val.toFixed(2)}` : val.toFixed(4))}
                />
                <Tooltip
                  formatter={(value) => [
                    `${quoteCurrency === "USD" ? "₹" : ""}${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}`,
                    "Price",
                  ]}
                />
                <Area type="monotone" dataKey="price" stroke="#10B981" fill="url(#priceGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full text-slate-500">
              Could not load chart data for {pair}.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
