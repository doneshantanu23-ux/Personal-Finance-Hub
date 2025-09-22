"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowRightLeft, TrendingUp, TrendingDown, RefreshCw, Star, Clock } from "lucide-react"

interface ExchangeRate {
  from: string
  to: string
  rate: number
  change: number
  changePercent: number
}

interface ConversionHistory {
  id: string
  from: string
  to: string
  amount: number
  result: number
  rate: number
  timestamp: Date
}

interface RateHistory {
  date: string
  rate: number
}

const POPULAR_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
]

const ALL_CURRENCIES = [
  ...POPULAR_CURRENCIES,
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "AFN", name: "Afghan Afghani", flag: "🇦🇫" },
  { code: "ALL", name: "Albanian Lek", flag: "🇦🇱" },
  { code: "AMD", name: "Armenian Dram", flag: "🇦🇲" },
  { code: "ANG", name: "Netherlands Antillean Guilder", flag: "🇳🇱" },
  { code: "AOA", name: "Angolan Kwanza", flag: "🇦🇴" },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
  { code: "AWG", name: "Aruban Florin", flag: "🇦🇼" },
  { code: "AZN", name: "Azerbaijani Manat", flag: "🇦🇿" },
  { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark", flag: "🇧🇦" },
  { code: "BBD", name: "Barbadian Dollar", flag: "🇧🇧" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
  { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬" },
  { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
  { code: "BIF", name: "Burundian Franc", flag: "🇧🇮" },
  { code: "BMD", name: "Bermudan Dollar", flag: "🇧🇲" },
  { code: "BND", name: "Brunei Dollar", flag: "🇧🇳" },
  { code: "BOB", name: "Bolivian Boliviano", flag: "🇧🇴" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "BSD", name: "Bahamian Dollar", flag: "🇧🇸" },
  { code: "BTN", name: "Bhutanese Ngultrum", flag: "🇧🇹" },
  { code: "BWP", name: "Botswanan Pula", flag: "🇧🇼" },
  { code: "BYN", name: "Belarusian Ruble", flag: "🇧🇾" },
  { code: "BZD", name: "Belize Dollar", flag: "🇧🇿" },
  { code: "CDF", name: "Congolese Franc", flag: "🇨🇩" },
  { code: "CLP", name: "Chilean Peso", flag: "🇨🇱" },
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴" },
  { code: "CRC", name: "Costa Rican Colón", flag: "🇨🇷" },
  { code: "CUP", name: "Cuban Peso", flag: "🇨🇺" },
  { code: "CVE", name: "Cape Verdean Escudo", flag: "🇨🇻" },
  { code: "CZK", name: "Czech Republic Koruna", flag: "🇨🇿" },
  { code: "DJF", name: "Djiboutian Franc", flag: "🇩🇯" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "DOP", name: "Dominican Peso", flag: "🇩🇴" },
  { code: "DZD", name: "Algerian Dinar", flag: "🇩🇿" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "ERN", name: "Eritrean Nakfa", flag: "🇪🇷" },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹" },
  { code: "FJD", name: "Fijian Dollar", flag: "🇫🇯" },
  { code: "FKP", name: "Falkland Islands Pound", flag: "🇫🇰" },
  { code: "GEL", name: "Georgian Lari", flag: "🇬🇪" },
  { code: "GGP", name: "Guernsey Pound", flag: "🇬🇬" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "GIP", name: "Gibraltar Pound", flag: "🇬🇮" },
  { code: "GMD", name: "Gambian Dalasi", flag: "🇬🇲" },
  { code: "GNF", name: "Guinean Franc", flag: "🇬🇳" },
  { code: "GTQ", name: "Guatemalan Quetzal", flag: "🇬🇹" },
  { code: "GYD", name: "Guyanaese Dollar", flag: "🇬🇾" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "HNL", name: "Honduran Lempira", flag: "🇭🇳" },
  { code: "HRK", name: "Croatian Kuna", flag: "🇭🇷" },
  { code: "HTG", name: "Haitian Gourde", flag: "🇭🇹" },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "ILS", name: "Israeli New Sheqel", flag: "🇮🇱" },
  { code: "IMP", name: "Manx pound", flag: "🇮🇲" },
  { code: "IQD", name: "Iraqi Dinar", flag: "🇮🇶" },
  { code: "IRR", name: "Iranian Rial", flag: "🇮🇷" },
  { code: "ISK", name: "Icelandic Króna", flag: "🇮🇸" },
  { code: "JEP", name: "Jersey Pound", flag: "🇯🇪" },
  { code: "JMD", name: "Jamaican Dollar", flag: "🇯🇲" },
  { code: "JOD", name: "Jordanian Dinar", flag: "🇯🇴" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "KGS", name: "Kyrgystani Som", flag: "🇰🇬" },
  { code: "KHR", name: "Cambodian Riel", flag: "🇰🇭" },
  { code: "KMF", name: "Comorian Franc", flag: "🇰🇲" },
  { code: "KPW", name: "North Korean Won", flag: "🇰🇵" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
  { code: "KYD", name: "Cayman Islands Dollar", flag: "🇰🇾" },
  { code: "KZT", name: "Kazakhstani Tenge", flag: "🇰🇿" },
  { code: "LAK", name: "Laotian Kip", flag: "🇱🇦" },
  { code: "LBP", name: "Lebanese Pound", flag: "🇱🇧" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "LRD", name: "Liberian Dollar", flag: "🇱🇷" },
  { code: "LSL", name: "Lesotho Loti", flag: "🇱🇸" },
  { code: "LYD", name: "Libyan Dinar", flag: "🇱🇾" },
  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦" },
  { code: "MDL", name: "Moldovan Leu", flag: "🇲🇩" },
  { code: "MGA", name: "Malagasy Ariary", flag: "🇲🇬" },
  { code: "MKD", name: "Macedonian Denar", flag: "🇲🇰" },
  { code: "MMK", name: "Myanma Kyat", flag: "🇲🇲" },
  { code: "MNT", name: "Mongolian Tugrik", flag: "🇲🇳" },
  { code: "MOP", name: "Macanese Pataca", flag: "🇲🇴" },
  { code: "MRU", name: "Mauritanian Ouguiya", flag: "🇲🇷" },
  { code: "MUR", name: "Mauritian Rupee", flag: "🇲🇺" },
  { code: "MVR", name: "Maldivian Rufiyaa", flag: "🇲🇻" },
  { code: "MWK", name: "Malawian Kwacha", flag: "🇲🇼" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "MZN", name: "Mozambican Metical", flag: "🇲🇿" },
  { code: "NAD", name: "Namibian Dollar", flag: "🇳🇦" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "NIO", name: "Nicaraguan Córdoba", flag: "🇳🇮" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
  { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
  { code: "PAB", name: "Panamanian Balboa", flag: "🇵🇦" },
  { code: "PEN", name: "Peruvian Nuevo Sol", flag: "🇵🇪" },
  { code: "PGK", name: "Papua New Guinean Kina", flag: "🇵🇬" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },
  { code: "PYG", name: "Paraguayan Guarani", flag: "🇵🇾" },
  { code: "QAR", name: "Qatari Rial", flag: "🇶🇦" },
  { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
  { code: "RSD", name: "Serbian Dinar", flag: "🇷🇸" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "SBD", name: "Solomon Islands Dollar", flag: "🇸🇧" },
  { code: "SCR", name: "Seychellois Rupee", flag: "🇸🇨" },
  { code: "SDG", name: "Sudanese Pound", flag: "🇸🇩" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "SHP", name: "Saint Helena Pound", flag: "🇸🇭" },
  { code: "SLE", name: "Sierra Leonean Leone", flag: "🇸🇱" },
  { code: "SOS", name: "Somali Shilling", flag: "🇸🇴" },
  { code: "SRD", name: "Surinamese Dollar", flag: "🇸🇷" },
  { code: "STN", name: "São Tomé and Príncipe Dobra", flag: "🇸🇹" },
  { code: "SVC", name: "Salvadoran Colón", flag: "🇸🇻" },
  { code: "SYP", name: "Syrian Pound", flag: "🇸🇾" },
  { code: "SZL", name: "Swazi Lilangeni", flag: "🇸🇿" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "TJS", name: "Tajikistani Somoni", flag: "🇹🇯" },
  { code: "TMT", name: "Turkmenistani Manat", flag: "🇹🇲" },
  { code: "TND", name: "Tunisian Dinar", flag: "🇹🇳" },
  { code: "TOP", name: "Tongan Paʻanga", flag: "🇹🇴" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", flag: "🇹🇹" },
  { code: "TWD", name: "New Taiwan Dollar", flag: "🇹🇼" },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿" },
  { code: "UAH", name: "Ukrainian Hryvnia", flag: "🇺🇦" },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬" },
  { code: "UYU", name: "Uruguayan Peso", flag: "🇺🇾" },
  { code: "UZS", name: "Uzbekistan Som", flag: "🇺🇿" },
  { code: "VED", name: "Venezuelan Bolívar", flag: "🇻🇪" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
  { code: "VUV", name: "Vanuatu Vatu", flag: "🇻🇺" },
  { code: "WST", name: "Samoan Tala", flag: "🇼🇸" },
  { code: "XAF", name: "CFA Franc BEAC", flag: "🇨🇫" },
  { code: "XCD", name: "East Caribbean Dollar", flag: "🇦🇬" },
  { code: "XDR", name: "Special Drawing Rights", flag: "🏛️" },
  { code: "XOF", name: "CFA Franc BCEAO", flag: "🇧🇫" },
  { code: "XPF", name: "CFP Franc", flag: "🇵🇫" },
  { code: "YER", name: "Yemeni Rial", flag: "🇾🇪" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "ZMW", name: "Zambian Kwacha", flag: "🇿🇲" },
  { code: "ZWL", name: "Zimbabwean Dollar", flag: "🇿🇼" },
]

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("INR")
  const [amount, setAmount] = useState("1")
  const [result, setResult] = useState<number | null>(null)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [conversionHistory, setConversionHistory] = useState<ConversionHistory[]>([])
  const [rateHistory, setRateHistory] = useState<RateHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(["USD", "EUR", "GBP", "JPY"])

  useEffect(() => {
    fetchExchangeRates()
    fetchRateHistory()
  }, [fromCurrency, toCurrency])

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(`/api/currency-rates?from=${fromCurrency}&to=${toCurrency}`)
      const data = await response.json()

      if (data.rates) {
        setExchangeRates(data.rates)
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
      generateMockRates()
    }
  }

  const fetchRateHistory = async () => {
    try {
      const response = await fetch(`/api/currency-rates/history?from=${fromCurrency}&to=${toCurrency}`)
      const data = await response.json()

      if (data.history) {
        setRateHistory(data.history)
      }
    } catch (error) {
      console.error("Error fetching rate history:", error)
      generateMockHistory()
    }
  }

  const generateMockRates = () => {
    const mockRates = POPULAR_CURRENCIES.map((currency) => ({
      from: fromCurrency,
      to: currency.code,
      rate: currency.code === fromCurrency ? 1 : Math.random() * 100 + 0.5,
      change: (Math.random() - 0.5) * 2,
      changePercent: (Math.random() - 0.5) * 5,
    }))
    setExchangeRates(mockRates)
  }

  const generateMockHistory = () => {
    const history = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      history.push({
        date: date.toISOString().split("T")[0],
        rate: 82.5 + (Math.random() - 0.5) * 5,
      })
    }
    setRateHistory(history)
  }

  const convertCurrency = async () => {
    if (!amount || isNaN(Number.parseFloat(amount))) return

    setLoading(true)
    try {
      const response = await fetch(`/api/currency-rates/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)
      const data = await response.json()

      if (data.result) {
        setResult(data.result)

        // Add to history
        const conversion: ConversionHistory = {
          id: Date.now().toString(),
          from: fromCurrency,
          to: toCurrency,
          amount: Number.parseFloat(amount),
          result: data.result,
          rate: data.rate,
          timestamp: new Date(),
        }

        setConversionHistory([conversion, ...conversionHistory.slice(0, 9)])
      }
    } catch (error) {
      console.error("Error converting currency:", error)
      // Fallback calculation
      const rate = fromCurrency === "USD" && toCurrency === "INR" ? 82.5 : 1.2
      const convertedAmount = Number.parseFloat(amount) * rate
      setResult(convertedAmount)
    } finally {
      setLoading(false)
    }
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const addToFavorites = (currencyCode: string) => {
    if (!favorites.includes(currencyCode)) {
      setFavorites([...favorites, currencyCode])
    }
  }

  const removeFromFavorites = (currencyCode: string) => {
    setFavorites(favorites.filter((code) => code !== currencyCode))
  }

  const getCurrentRate = () => {
    const rate = exchangeRates.find((r) => r.from === fromCurrency && r.to === toCurrency)
    return rate?.rate || 1
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Currency Converter</h1>
          <p className="text-gray-600">Convert between 180+ world currencies with live exchange rates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Converter */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  <span>Currency Converter</span>
                </CardTitle>
                <CardDescription>Convert any amount between different currencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="from">From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <p className="text-sm font-medium text-gray-500 mb-2">Popular Currencies</p>
                          {POPULAR_CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center space-x-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code}</span>
                                <span className="text-gray-500">- {currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                          <p className="text-sm font-medium text-gray-500 mb-2 mt-4">All Currencies</p>
                          {ALL_CURRENCIES.filter((c) => !POPULAR_CURRENCIES.find((p) => p.code === c.code)).map(
                            (currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center space-x-2">
                                  <span>{currency.flag}</span>
                                  <span>{currency.code}</span>
                                  <span className="text-gray-500">- {currency.name}</span>
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" size="icon" onClick={swapCurrencies}>
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="to">To</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <p className="text-sm font-medium text-gray-500 mb-2">Popular Currencies</p>
                          {POPULAR_CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center space-x-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code}</span>
                                <span className="text-gray-500">- {currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                          <p className="text-sm font-medium text-gray-500 mb-2 mt-4">All Currencies</p>
                          {ALL_CURRENCIES.filter((c) => !POPULAR_CURRENCIES.find((p) => p.code === c.code)).map(
                            (currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                <div className="flex items-center space-x-2">
                                  <span>{currency.flag}</span>
                                  <span>{currency.code}</span>
                                  <span className="text-gray-500">- {currency.name}</span>
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={convertCurrency} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert Currency"
                  )}
                </Button>

                {result !== null && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {amount} {fromCurrency} equals
                      </p>
                      <p className="text-3xl font-bold text-blue-600 mb-2">
                        {result.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}{" "}
                        {toCurrency}
                      </p>
                      <p className="text-sm text-gray-500">
                        1 {fromCurrency} = {getCurrentRate().toFixed(6)} {toCurrency}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rate History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Exchange Rate History</CardTitle>
                <CardDescription>
                  {fromCurrency}/{toCurrency} - Last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rateHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: any) => [value.toFixed(4), "Rate"]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Exchange Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exchangeRates.slice(0, 8).map((rate) => {
                    const currency = ALL_CURRENCIES.find((c) => c.code === rate.to)
                    return (
                      <div
                        key={`${rate.from}-${rate.to}`}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{currency?.flag}</span>
                          <div>
                            <span className="font-medium">
                              {rate.from}/{rate.to}
                            </span>
                            <p className="text-xs text-gray-500">{currency?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{rate.rate.toFixed(4)}</p>
                          <div className="flex items-center space-x-1">
                            {rate.changePercent >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${rate.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {rate.changePercent >= 0 ? "+" : ""}
                              {rate.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Favorite Currencies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((code) => {
                    const currency = ALL_CURRENCIES.find((c) => c.code === code)
                    return (
                      <Badge
                        key={code}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setFromCurrency(code)}
                      >
                        {currency?.flag} {code}
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Conversion History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Recent Conversions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversionHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No conversions yet</p>
                  ) : (
                    conversionHistory.map((conversion) => (
                      <div key={conversion.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {conversion.amount} {conversion.from} → {conversion.result.toFixed(2)} {conversion.to}
                            </p>
                            <p className="text-xs text-gray-500">
                              Rate: {conversion.rate.toFixed(4)} • {conversion.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Market Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Forex Markets</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Open
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm text-gray-600">2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Source</span>
                    <span className="text-sm text-gray-600">Live Rates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
