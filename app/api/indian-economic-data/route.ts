import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const indicator = searchParams.get("indicator") || "gdp"
  const timeframe = searchParams.get("timeframe") || "1Y"

  try {
    // In a real application, you would fetch data from economic data APIs
    // For now, we'll return mock data

    const mockData = generateMockEconomicData(timeframe)
    const mockIndicators = generateMockIndicators()

    return NextResponse.json({
      economicData: mockData,
      indicators: mockIndicators,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching economic data:", error)
    return NextResponse.json({ error: "Failed to fetch economic data" }, { status: 500 })
  }
}

function generateMockEconomicData(timeframe: string) {
  const data = []
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

    data.push({
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

  return data
}

function generateMockIndicators() {
  return [
    {
      name: "GDP Growth Rate",
      value: 6.7,
      change: 0.3,
      unit: "%",
      icon: "Factory",
      color: "text-blue-600",
    },
    {
      name: "Inflation Rate (CPI)",
      value: 5.1,
      change: -0.2,
      unit: "%",
      icon: "TrendingUp",
      color: "text-red-600",
    },
    {
      name: "Unemployment Rate",
      value: 7.5,
      change: -0.3,
      unit: "%",
      icon: "Users",
      color: "text-orange-600",
    },
    {
      name: "Repo Rate",
      value: 6.5,
      change: 0.0,
      unit: "%",
      icon: "IndianRupee",
      color: "text-green-600",
    },
    {
      name: "BSE Sensex",
      value: 67234,
      change: 1.2,
      unit: "",
      icon: "TrendingUp",
      color: "text-purple-600",
    },
    {
      name: "NSE Nifty 50",
      value: 20123,
      change: 0.8,
      unit: "",
      icon: "TrendingUp",
      color: "text-indigo-600",
    },
    {
      name: "USD/INR",
      value: 82.75,
      change: 0.15,
      unit: "₹",
      icon: "IndianRupee",
      color: "text-yellow-600",
    },
  ]
}
