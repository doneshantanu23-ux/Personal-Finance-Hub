"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react"

export default function MarketAnalysis({ pair }) {
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateAnalysis()
  }, [pair])

  const generateAnalysis = () => {
    setIsLoading(true)

    // Simulate analysis generation
    setTimeout(() => {
      const mockAnalysis = {
        trend: Math.random() > 0.5 ? "Bullish" : "Bearish",
        strength: Math.floor(Math.random() * 100),
        support: (Math.random() * 0.1 + 1.0).toFixed(4),
        resistance: (Math.random() * 0.1 + 1.1).toFixed(4),
        volatility: Math.random() > 0.5 ? "High" : "Low",
        recommendation: Math.random() > 0.5 ? "Buy" : "Sell",
        signals: [
          "RSI indicates oversold conditions",
          "Moving averages show bullish crossover",
          "Volume increasing on upward moves",
        ],
      }
      setAnalysis(mockAnalysis)
      setIsLoading(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Market Analysis - {pair}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle>Market Analysis - {pair}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Trend</p>
            <div className="flex items-center gap-2">
              {analysis.trend === "Bullish" ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`font-semibold ${analysis.trend === "Bullish" ? "text-emerald-600" : "text-red-600"}`}>
                {analysis.trend}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Strength</p>
            <p className="font-semibold">{analysis.strength}%</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Support</p>
            <p className="font-semibold">{analysis.support}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">Resistance</p>
            <p className="font-semibold">{analysis.resistance}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600">Volatility</p>
            <Badge variant={analysis.volatility === "High" ? "destructive" : "secondary"}>{analysis.volatility}</Badge>
          </div>
          <div>
            <p className="text-sm text-slate-600">Recommendation</p>
            <Badge variant={analysis.recommendation === "Buy" ? "default" : "outline"}>{analysis.recommendation}</Badge>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Key Signals
          </h4>
          <ul className="space-y-1">
            {analysis.signals.map((signal, index) => (
              <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-3 h-3 mt-0.5 text-blue-500" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
