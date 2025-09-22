export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "AAPL"
  const timeframe = searchParams.get("timeframe") || "1M"

  try {
    // Using the new Alpha Vantage API key
    const apiKey = "GgtzU5I4EaYKVAlZDZbSRKtCvT4mACBy"
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=full`,
    )

    const data = await response.json()

    if (data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"]
      const entries = Object.entries(timeSeries)

      // Filter based on timeframe
      let filteredEntries = entries
      const now = new Date()

      switch (timeframe) {
        case "1D":
          filteredEntries = entries.slice(0, 1)
          break
        case "1W":
          filteredEntries = entries.slice(0, 7)
          break
        case "1M":
          filteredEntries = entries.slice(0, 30)
          break
        case "3M":
          filteredEntries = entries.slice(0, 90)
          break
        case "1Y":
          filteredEntries = entries.slice(0, 365)
          break
      }

      const stockData = filteredEntries
        .map(([date, values]: [string, any]) => ({
          date,
          price: Number.parseFloat(values["4. close"]),
          volume: Number.parseInt(values["5. volume"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
          open: Number.parseFloat(values["1. open"]),
        }))
        .reverse()

      const latestPrice = stockData[stockData.length - 1]?.price || 0
      const previousPrice = stockData[stockData.length - 2]?.price || 0
      const change = latestPrice - previousPrice
      const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0

      return Response.json({
        stockData,
        stockInfo: {
          symbol: symbol.toUpperCase(),
          name: `${symbol.toUpperCase()} Inc.`,
          price: latestPrice,
          change,
          changePercent,
          volume: stockData[stockData.length - 1]?.volume,
        },
      })
    } else {
      // Fallback to mock data
      return generateMockStockData(symbol, timeframe)
    }
  } catch (error) {
    console.error("Stock API error:", error)
    return generateMockStockData(symbol, timeframe)
  }
}

function generateMockStockData(symbol: string, timeframe: string) {
  const mockData = []
  const basePrice = 150 + Math.random() * 100

  let days = 30
  switch (timeframe) {
    case "1D":
      days = 1
      break
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

    const price = basePrice + (Math.random() - 0.5) * 20
    mockData.push({
      date: date.toISOString().split("T")[0],
      price: price,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      high: price + Math.random() * 5,
      low: price - Math.random() * 5,
      open: price + (Math.random() - 0.5) * 3,
    })
  }

  const latestPrice = mockData[mockData.length - 1]?.price || 0
  const previousPrice = mockData[mockData.length - 2]?.price || 0
  const change = latestPrice - previousPrice
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0

  return Response.json({
    stockData: mockData,
    stockInfo: {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Inc.`,
      price: latestPrice,
      change,
      changePercent,
      volume: mockData[mockData.length - 1]?.volume,
    },
  })
}
