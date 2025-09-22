export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "US10Y"
  const timeframe = searchParams.get("timeframe") || "1M"

  try {
    // Using Alpha Vantage API for bond data with new key
    const apiKey = "GgtzU5I4EaYKVAlZDZbSRKtCvT4mACBy"

    const function_name = "TREASURY_YIELD"
    const interval = "daily"
    let maturity = "10year"

    switch (symbol) {
      case "US10Y":
        maturity = "10year"
        break
      case "US30Y":
        maturity = "30year"
        break
      case "US2Y":
        maturity = "2year"
        break
      case "US5Y":
        maturity = "5year"
        break
      case "CORP10Y":
        maturity = "10year"
        break
      case "MUNI10Y":
        maturity = "10year"
        break
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=${function_name}&interval=${interval}&maturity=${maturity}&apikey=${apiKey}`,
    )

    const data = await response.json()

    if (data.data) {
      const timeSeries = data.data
      let filteredEntries = timeSeries

      switch (timeframe) {
        case "1W":
          filteredEntries = timeSeries.slice(0, 7)
          break
        case "1M":
          filteredEntries = timeSeries.slice(0, 30)
          break
        case "3M":
          filteredEntries = timeSeries.slice(0, 90)
          break
        case "1Y":
          filteredEntries = timeSeries.slice(0, 365)
          break
      }

      const bondData = filteredEntries.map((entry: any) => ({
        date: entry.date,
        yield: Number.parseFloat(entry.value),
        price: 100 - (Number.parseFloat(entry.value) - 4) * 10, // Inverse relationship approximation
      }))

      return Response.json({
        bondData,
        bonds: generateBondsList(),
      })
    } else {
      return generateMockBondData(symbol, timeframe)
    }
  } catch (error) {
    console.error("Bond API error:", error)
    return generateMockBondData(symbol, timeframe)
  }
}

function generateMockBondData(symbol: string, timeframe: string) {
  const mockData = []
  let baseYield = 4.5

  switch (symbol) {
    case "US10Y":
      baseYield = 4.5
      break
    case "US30Y":
      baseYield = 4.8
      break
    case "US2Y":
      baseYield = 4.2
      break
    case "US5Y":
      baseYield = 4.3
      break
    case "CORP10Y":
      baseYield = 5.2
      break
    case "MUNI10Y":
      baseYield = 3.8
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

    const yieldValue = baseYield + (Math.random() - 0.5) * 0.5
    const price = 100 - (yieldValue - 4) * 10
    mockData.push({
      date: date.toISOString().split("T")[0],
      yield: yieldValue,
      price: price,
    })
  }

  return Response.json({
    bondData: mockData,
    bonds: generateBondsList(),
  })
}

function generateBondsList() {
  const bondTypes = [
    { id: "US10Y", name: "US 10-Year Treasury", type: "Government" },
    { id: "US30Y", name: "US 30-Year Treasury", type: "Government" },
    { id: "US2Y", name: "US 2-Year Treasury", type: "Government" },
    { id: "US5Y", name: "US 5-Year Treasury", type: "Government" },
    { id: "CORP10Y", name: "Corporate 10-Year", type: "Corporate" },
    { id: "MUNI10Y", name: "Municipal 10-Year", type: "Municipal" },
  ]

  return bondTypes.map((bond) => ({
    symbol: bond.id,
    name: bond.name,
    yield: 4.0 + Math.random() * 2,
    price: 95 + Math.random() * 10,
    maturity: "2034-01-15",
    rating: ["AAA", "AA+", "AA", "A+", "A"][Math.floor(Math.random() * 5)],
    change: (Math.random() - 0.5) * 0.2,
    changePercent: (Math.random() - 0.5) * 5,
  }))
}
