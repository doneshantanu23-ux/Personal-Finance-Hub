export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pair = searchParams.get("pair") || "EUR/USD"
  const timeframe = searchParams.get("timeframe") || "1D"

  try {
    // Using Alpha Vantage API for forex data with new key
    const apiKey = "GgtzU5I4EaYKVAlZDZbSRKtCvT4mACBy"
    const [fromCurrency, toCurrency] = pair.split("/")

    const response = await fetch(
      `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&apikey=${apiKey}`,
    )

    const data = await response.json()

    if (data["Time Series FX (Daily)"]) {
      const timeSeries = data["Time Series FX (Daily)"]
      const entries = Object.entries(timeSeries)

      let filteredEntries = entries
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
      }

      const forexData = filteredEntries
        .map(([date, values]: [string, any]) => ({
          date,
          rate: Number.parseFloat(values["4. close"]),
          high: Number.parseFloat(values["2. high"]),
          low: Number.parseFloat(values["3. low"]),
        }))
        .reverse()

      // Generate currency pairs data
      const majorPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD", "EUR/GBP"]

      const currencyPairs = majorPairs.map((pairName) => ({
        pair: pairName,
        rate: 1 + (Math.random() - 0.5) * 0.5,
        change: (Math.random() - 0.5) * 0.02,
        changePercent: (Math.random() - 0.5) * 2,
      }))

      return Response.json({
        forexData,
        currencyPairs,
      })
    } else {
      return generateMockForexData(pair, timeframe)
    }
  } catch (error) {
    console.error("Forex API error:", error)
    return generateMockForexData(pair, timeframe)
  }
}

function generateMockForexData(pair: string, timeframe: string) {
  const mockData = []
  const baseRate = 1.0842 + (Math.random() - 0.5) * 0.1

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
  }

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))

    const rate = baseRate + (Math.random() - 0.5) * 0.02
    mockData.push({
      date: date.toISOString().split("T")[0],
      rate: rate,
      high: rate + Math.random() * 0.005,
      low: rate - Math.random() * 0.005,
    })
  }

  const majorPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD", "EUR/GBP"]
  const currencyPairs = majorPairs.map((pairName) => ({
    pair: pairName,
    rate: 1 + (Math.random() - 0.5) * 0.5,
    change: (Math.random() - 0.5) * 0.02,
    changePercent: (Math.random() - 0.5) * 2,
  }))

  return Response.json({
    forexData: mockData,
    currencyPairs,
  })
}
