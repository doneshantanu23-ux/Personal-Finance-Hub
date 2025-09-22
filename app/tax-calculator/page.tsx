"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Calculator, IndianRupee, FileText, TrendingDown, Shield } from "lucide-react"

interface TaxCalculation {
  grossIncome: number
  taxableIncome: number
  totalTax: number
  netIncome: number
  effectiveRate: number
  marginalRate: number
  deductions: number
  cess: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function TaxCalculator() {
  const [income, setIncome] = useState("1200000")
  const [regime, setRegime] = useState("new")
  const [deductions, setDeductions] = useState({
    section80C: "150000",
    section80D: "25000",
    section24B: "200000",
    nps: "50000",
  })
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null)

  const calculateTax = () => {
    const grossIncome = Number.parseFloat(income)
    if (!grossIncome) return

    let taxableIncome = grossIncome
    let totalDeductions = 0

    if (regime === "old") {
      // Old regime with deductions
      totalDeductions =
        Number.parseFloat(deductions.section80C || "0") +
        Number.parseFloat(deductions.section80D || "0") +
        Number.parseFloat(deductions.section24B || "0") +
        Number.parseFloat(deductions.nps || "0")

      taxableIncome = Math.max(grossIncome - totalDeductions, 0)
    }

    let tax = 0
    let marginalRate = 0

    if (regime === "new") {
      // New tax regime rates (FY 2023-24)
      if (taxableIncome <= 300000) {
        tax = 0
        marginalRate = 0
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05
        marginalRate = 5
      } else if (taxableIncome <= 900000) {
        tax = 300000 * 0.05 + (taxableIncome - 600000) * 0.1
        marginalRate = 10
      } else if (taxableIncome <= 1200000) {
        tax = 300000 * 0.05 + 300000 * 0.1 + (taxableIncome - 900000) * 0.15
        marginalRate = 15
      } else if (taxableIncome <= 1500000) {
        tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + (taxableIncome - 1200000) * 0.2
        marginalRate = 20
      } else {
        tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + 300000 * 0.2 + (taxableIncome - 1500000) * 0.3
        marginalRate = 30
      }
    } else {
      // Old tax regime rates
      if (taxableIncome <= 250000) {
        tax = 0
        marginalRate = 0
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05
        marginalRate = 5
      } else if (taxableIncome <= 1000000) {
        tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.2
        marginalRate = 20
      } else {
        tax = 250000 * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3
        marginalRate = 30
      }
    }

    // Add Health and Education Cess (4%)
    const cess = tax * 0.04
    const totalTax = tax + cess
    const netIncome = grossIncome - totalTax
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0

    const result: TaxCalculation = {
      grossIncome,
      taxableIncome,
      totalTax,
      netIncome,
      effectiveRate,
      marginalRate,
      deductions: totalDeductions,
      cess,
    }

    setCalculation(result)
  }

  const getPieChartData = () => {
    if (!calculation) return []
    return [
      { name: "Net Income", value: calculation.netIncome },
      { name: "Income Tax", value: calculation.totalTax - calculation.cess },
      { name: "Cess", value: calculation.cess },
      { name: "Deductions", value: calculation.deductions },
    ]
  }

  const getComparisonData = () => {
    const grossIncome = Number.parseFloat(income)
    if (!grossIncome) return []

    // Calculate for both regimes
    const newRegimeCalc = calculateRegimeTax(grossIncome, "new", 0)
    const oldRegimeCalc = calculateRegimeTax(
      grossIncome,
      "old",
      Number.parseFloat(deductions.section80C || "0") +
        Number.parseFloat(deductions.section80D || "0") +
        Number.parseFloat(deductions.section24B || "0") +
        Number.parseFloat(deductions.nps || "0"),
    )

    return [
      {
        regime: "New Regime",
        tax: newRegimeCalc.totalTax,
        netIncome: newRegimeCalc.netIncome,
      },
      {
        regime: "Old Regime",
        tax: oldRegimeCalc.totalTax,
        netIncome: oldRegimeCalc.netIncome,
      },
    ]
  }

  const calculateRegimeTax = (grossIncome: number, regimeType: string, totalDeductions: number) => {
    const taxableIncome = regimeType === "old" ? Math.max(grossIncome - totalDeductions, 0) : grossIncome
    let tax = 0

    if (regimeType === "new") {
      if (taxableIncome <= 300000) tax = 0
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05
      else if (taxableIncome <= 900000) tax = 300000 * 0.05 + (taxableIncome - 600000) * 0.1
      else if (taxableIncome <= 1200000) tax = 300000 * 0.05 + 300000 * 0.1 + (taxableIncome - 900000) * 0.15
      else if (taxableIncome <= 1500000)
        tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + (taxableIncome - 1200000) * 0.2
      else tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + 300000 * 0.2 + (taxableIncome - 1500000) * 0.3
    } else {
      if (taxableIncome <= 250000) tax = 0
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05
      else if (taxableIncome <= 1000000) tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.2
      else tax = 250000 * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3
    }

    const cess = tax * 0.04
    const totalTax = tax + cess
    const netIncome = grossIncome - totalTax

    return { totalTax, netIncome }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Income Tax Calculator</h1>
          <p className="text-gray-600">Calculate your income tax for FY 2023-24 under both tax regimes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Tax Calculator</span>
                </CardTitle>
                <CardDescription>Enter your income details to calculate tax</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="1200000"
                  />
                </div>

                <div>
                  <Label htmlFor="regime">Tax Regime</Label>
                  <Select value={regime} onValueChange={setRegime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Tax Regime</SelectItem>
                      <SelectItem value="old">Old Tax Regime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {regime === "old" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Deductions</h4>

                    <div>
                      <Label htmlFor="section80C">Section 80C (₹)</Label>
                      <Input
                        id="section80C"
                        type="number"
                        value={deductions.section80C}
                        onChange={(e) => setDeductions({ ...deductions, section80C: e.target.value })}
                        placeholder="150000"
                      />
                      <p className="text-xs text-gray-500 mt-1">PPF, ELSS, Life Insurance (Max: ₹1.5L)</p>
                    </div>

                    <div>
                      <Label htmlFor="section80D">Section 80D (₹)</Label>
                      <Input
                        id="section80D"
                        type="number"
                        value={deductions.section80D}
                        onChange={(e) => setDeductions({ ...deductions, section80D: e.target.value })}
                        placeholder="25000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Health Insurance Premium</p>
                    </div>

                    <div>
                      <Label htmlFor="section24B">Section 24(B) (₹)</Label>
                      <Input
                        id="section24B"
                        type="number"
                        value={deductions.section24B}
                        onChange={(e) => setDeductions({ ...deductions, section24B: e.target.value })}
                        placeholder="200000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Home Loan Interest (Max: ₹2L)</p>
                    </div>

                    <div>
                      <Label htmlFor="nps">NPS 80CCD(1B) (₹)</Label>
                      <Input
                        id="nps"
                        type="number"
                        value={deductions.nps}
                        onChange={(e) => setDeductions({ ...deductions, nps: e.target.value })}
                        placeholder="50000"
                      />
                      <p className="text-xs text-gray-500 mt-1">Additional NPS (Max: ₹50K)</p>
                    </div>
                  </div>
                )}

                <Button onClick={calculateTax} className="w-full">
                  Calculate Tax
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
                          <p className="text-sm text-gray-600">Gross Income</p>
                          <p className="text-lg font-bold">₹{calculation.grossIncome.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Tax</p>
                          <p className="text-lg font-bold text-red-600">
                            ₹{calculation.totalTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Net Income</p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{calculation.netIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Effective Rate</p>
                          <p className="text-lg font-bold text-purple-600">{calculation.effectiveRate.toFixed(2)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Income Breakdown</CardTitle>
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
                      <CardTitle>Regime Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getComparisonData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="regime" />
                            <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value: any) => `₹${value.toLocaleString("en-IN")}`} />
                            <Bar dataKey="tax" fill="#EF4444" name="Tax" />
                            <Bar dataKey="netIncome" fill="#10B981" name="Net Income" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tax Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Calculation Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Income Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Gross Income:</span>
                            <span>₹{calculation.grossIncome.toLocaleString("en-IN")}</span>
                          </div>
                          {regime === "old" && (
                            <div className="flex justify-between">
                              <span>Total Deductions:</span>
                              <span>₹{calculation.deductions.toLocaleString("en-IN")}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium">
                            <span>Taxable Income:</span>
                            <span>₹{calculation.taxableIncome.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Tax Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Income Tax:</span>
                            <span>
                              ₹
                              {(calculation.totalTax - calculation.cess).toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Health & Education Cess (4%):</span>
                            <span>₹{calculation.cess.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total Tax:</span>
                            <span>₹{calculation.totalTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Marginal Tax Rate:</span>
                            <span>{calculation.marginalRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!calculation && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Calculate Your Income Tax</h3>
                  <p className="text-gray-600">
                    Enter your income details to see tax calculations for both old and new tax regimes.
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
