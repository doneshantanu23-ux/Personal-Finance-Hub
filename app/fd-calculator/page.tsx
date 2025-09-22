"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Calculator, TrendingUp, IndianRupee, Calendar, Percent } from "lucide-react"

interface FDCalculation {
  principal: number
  rate: number
  tenure: number
  compoundingFrequency: number
  maturityAmount: number
  totalInterest: number
  effectiveRate: number
}

interface YearlyBreakdown {
  year: number
  openingBalance: number
  interestEarned: number
  closingBalance: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function FDCalculator() {
  const [principal, setPrincipal] = useState("100000")
  const [rate, setRate] = useState("7.5")
  const [tenure, setTenure] = useState("5")
  const [compounding, setCompounding] = useState("4") // Quarterly
  const [calculation, setCalculation] = useState<FDCalculation | null>(null)
  const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([])

  const compoundingOptions = [
    { value: "1", label: "Annually" },
    { value: "2", label: "Half-Yearly" },
    { value: "4", label: "Quarterly" },
    { value: "12", label: "Monthly" },
  ]

  const calculateFD = () => {
    const P = Number.parseFloat(principal)
    const r = Number.parseFloat(rate) / 100
    const t = Number.parseFloat(tenure)
    const n = Number.parseFloat(compounding)

    if (!P || !r || !t || !n) return

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + r / n, n * t)
    const totalInterest = maturityAmount - P
    const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100

    const result: FDCalculation = {
      principal: P,
      rate: Number.parseFloat(rate),
      tenure: t,
      compoundingFrequency: n,
      maturityAmount,
      totalInterest,
      effectiveRate,
    }

    setCalculation(result)

    // Generate yearly breakdown
    const breakdown: YearlyBreakdown[] = []
    let currentAmount = P

    for (let year = 1; year <= t; year++) {
      const openingBalance = currentAmount
      const yearEndAmount = P * Math.pow(1 + r / n, n * year)
      const interestEarned = yearEndAmount - currentAmount

      breakdown.push({
        year,
        openingBalance,
        interestEarned,
        closingBalance: yearEndAmount,
      })

      currentAmount = yearEndAmount
    }

    setYearlyBreakdown(breakdown)
  }

  const getPieChartData = () => {
    if (!calculation) return []
    return [
      { name: "Principal", value: calculation.principal },
      { name: "Interest", value: calculation.totalInterest },
    ]
  }

  const getComparisonData = () => {
    const P = Number.parseFloat(principal)
    const r = Number.parseFloat(rate) / 100
    const t = Number.parseFloat(tenure)

    if (!P || !r || !t) return []

    return [
      {
        type: "Simple Interest",
        amount: P + P * r * t,
        interest: P * r * t,
      },
      {
        type: "Compound Interest",
        amount: calculation?.maturityAmount || 0,
        interest: calculation?.totalInterest || 0,
      },
    ]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fixed Deposit Calculator</h1>
          <p className="text-gray-600">Calculate returns on your fixed deposit investments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>FD Calculator</span>
                </CardTitle>
                <CardDescription>Enter your FD details to calculate returns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="principal">Principal Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="100000"
                  />
                </div>

                <div>
                  <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="7.5"
                  />
                </div>

                <div>
                  <Label htmlFor="tenure">Tenure (Years)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label htmlFor="compounding">Compounding Frequency</Label>
                  <Select value={compounding} onValueChange={setCompounding}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {compoundingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateFD} className="w-full">
                  Calculate Returns
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {calculation && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Principal</p>
                          <p className="text-lg font-bold">₹{calculation.principal.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Interest</p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{calculation.totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Maturity Amount</p>
                          <p className="text-lg font-bold text-purple-600">
                            ₹{calculation.maturityAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Percent className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Effective Rate</p>
                          <p className="text-lg font-bold text-orange-600">{calculation.effectiveRate.toFixed(2)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Principal vs Interest</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getPieChartData()}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                            >
                              {getPieChartData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => `₹${value.toLocaleString("en-IN")}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Simple vs Compound Interest</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getComparisonData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="type" />
                            <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value: any) => `₹${value.toLocaleString("en-IN")}`} />
                            <Bar dataKey="amount" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Yearly Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Year-wise Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Year</th>
                            <th className="text-right p-2">Opening Balance</th>
                            <th className="text-right p-2">Interest Earned</th>
                            <th className="text-right p-2">Closing Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearlyBreakdown.map((year) => (
                            <tr key={year.year} className="border-b hover:bg-gray-50">
                              <td className="p-2 font-medium">{year.year}</td>
                              <td className="p-2 text-right">
                                ₹{year.openingBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                              </td>
                              <td className="p-2 text-right text-green-600">
                                ₹{year.interestEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                              </td>
                              <td className="p-2 text-right font-semibold">
                                ₹{year.closingBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!calculation && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Calculate Your FD Returns</h3>
                  <p className="text-gray-600">
                    Enter your FD details in the form to see detailed calculations and projections.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
