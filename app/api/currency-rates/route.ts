import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const from = searchParams.get("from") || "USD"
  const to = searchParams.get("to") || "INR"

  try {
    // In a real application, you would fetch data from a currency API like:
    // - Fixer.io
    // - CurrencyAPI
    // - ExchangeRate-API
    // For now, we'll return mock data

    const mockRates = generateMockRates(from)

    return NextResponse.json({
      rates: mockRates,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching currency rates:", error)
    return NextResponse.json({ error: "Failed to fetch currency rates" }, { status: 500 })
  }
}

function generateMockRates(baseCurrency: string) {
  const currencies = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CHF", "CNY", "SGD"]

  // Mock exchange rates (these would come from a real API)
  const baseRates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110,
    INR: 82.5,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45,
    SGD: 1.35,
  }

  return currencies.map((currency) => {
    const baseRate = baseRates[baseCurrency] || 1
    const targetRate = baseRates[currency] || 1
    const rate = targetRate / baseRate

    return {
      from: baseCurrency,
      to: currency,
      rate: rate,
      change: (Math.random() - 0.5) * 0.1,
      changePercent: (Math.random() - 0.5) * 2,
    }
  })
}
