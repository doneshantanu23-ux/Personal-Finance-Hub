import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get("symbol") || "GOLD"
  const timeframe = searchParams.get("timeframe") || "1M"

  try {
    // In a real application, you would fetch data from a commodity API
    // For now, we'll return mock data

    const mockData = generateMockCommodityData(symbol, timeframe)
    const mockCommodities = generateMockCommoditiesList()

    return NextResponse.json({
      commodityData: mockData,
      commodities: mockCommodities,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching commodity data:", error)
    return NextResponse.json({ error: "Failed to fetch commodity data" }, { status: 500 })
  }
}

function generateMockCommodityData(symbol: string, timeframe: string) {
  const data = []
  let basePrice = 100

  // Set base prices for different commodities
  switch (symbol) {
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

    const variation = (Math.random() - 0.5) * basePrice * 0.1
    const price = basePrice + variation

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.max(price, basePrice * 0.8), // Ensure price doesn't go too low
    })
  }

  return data
}

function generateMockCommoditiesList() {
  const commodities = [
    { symbol: "GOLD", name: "Gold", category: "Precious Metals", unit: "per oz" },
    { symbol: "SILVER", name: "Silver", category: "Precious Metals", unit: "per oz" },
    { symbol: "CRUDE", name: "Crude Oil", category: "Energy", unit: "per barrel" },
    { symbol: "NATGAS", name: "Natural Gas", category: "Energy", unit: "per MMBtu" },
    { symbol: "WHEAT", name: "Wheat", category: "Agriculture", unit: "per bushel" },
    { symbol: "CORN", name: "Corn", category: "Agriculture", unit: "per bushel" },
    { symbol: "COPPER", name: "Copper", category: "Industrial Metals", unit: "per lb" },
    { symbol: "ALUMINUM", name: "Aluminum", category: "Industrial Metals", unit: "per lb" },
  ]

  return commodities.map((commodity) => {
    let basePrice = 100
    switch (commodity.symbol) {
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

    const variation = (Math.random() - 0.5) * basePrice * 0.05
    const price = basePrice + variation
    const change = (Math.random() - 0.5) * basePrice * 0.02
    const changePercent = (change / price) * 100

    return {
      ...commodity,
      price: Math.max(price, basePrice * 0.9),
      change,
      changePercent,
    }
  })
}
