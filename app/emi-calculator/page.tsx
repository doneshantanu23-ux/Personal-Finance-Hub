"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Calculator, Home, Car, User, IndianRupee, TrendingUp, Calendar } from "lucide-react"

interface LoanType {
  id: string
  name: string
  icon: any
  color: string
  bgColor: string
  defaultRate: number
  description: string
}

interface EMIResult {
  emi: number
  totalAmount: number
  totalInterest: number
  principalPercentage: number
  interestPercentage: number
}

interface AmortizationEntry {
  month: number
  emi: number
  principal: number
  interest: number
  balance: number
}

const loanTypes: LoanType[] = [
  {
    id: "home",
    name: "Home Loan",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-50",
    defaultRate: 8.5,
    description: "Tax benefits available under Section 80C & 24(b)",
  },
  {
    id: "car",
    name: "Car Loan",
    icon: Car,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    defaultRate: 9.0,
    description: "Shorter tenure recommended for better rates",
  },
  {
    id: "personal",
    name: "Personal Loan",
    icon: User,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    defaultRate: 12.0,
    description: "No collateral required, higher interest rates",
  },
]

export default function EMICalculator() {
  const [selectedLoanType, setSelectedLoanType] = useState<string>("home")
  const [principal, setPrincipal] = useState<string>("2500000")
  const [interestRate, setInterestRate] = useState<string>("8.5")
  const [tenure, setTenure] = useState<string>("20")
  const [emiResult, setEMIResult] = useState<EMIResult | null>(null)
  const [amortization, setAmortization] = useState<AmortizationEntry[]>([])

  const formatIndianCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatIndianNumber = (num: number): string => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  const calculateEMI = () => {
    const P = Number.parseFloat(principal)
    const r = Number.parseFloat(interestRate) / 100 / 12
    const n = Number.parseFloat(tenure) * 12

    if (P <= 0 || r <= 0 || n <= 0) return

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalAmount = emi * n
    const totalInterest = totalAmount - P
    const principalPercentage = (P / totalAmount) * 100
    const interestPercentage = (totalInterest / totalAmount) * 100

    setEMIResult({
      emi,
      totalAmount,
      totalInterest,
      principalPercentage,
      interestPercentage,
    })

    // Calculate amortization schedule (first 5 years)
    const schedule: AmortizationEntry[] = []
    let balance = P
    const monthsToShow = Math.min(60, n) // Show first 5 years or total tenure

    for (let month = 1; month <= monthsToShow; month++) {
      const interestPayment = balance * r
      const principalPayment = emi - interestPayment
      balance -= principalPayment

      schedule.push({
        month,
        emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      })
    }

    setAmortization(schedule)
  }

  useEffect(() => {
    calculateEMI()
  }, [principal, interestRate, tenure])

  useEffect(() => {
    const selectedType = loanTypes.find((type) => type.id === selectedLoanType)
    if (selectedType) {
      setInterestRate(selectedType.defaultRate.toString())
    }
  }, [selectedLoanType])

  const currentLoanType = loanTypes.find((type) => type.id === selectedLoanType)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EMI Calculator</h1>
          <p className="text-gray-600">Calculate your Equated Monthly Installments in Indian Rupees</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span>Loan Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loan Type Selection */}
                <div className="space-y-3">
                  <Label>Loan Type</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {loanTypes.map((type) => {
                      const IconComponent = type.icon
                      return (
                        <Button
                          key={type.id}
                          variant={selectedLoanType === type.id ? "default" : "outline"}
                          className={`justify-start h-auto p-4 ${
                            selectedLoanType === type.id ? `${type.color} ${type.bgColor}` : ""
                          }`}
                          onClick={() => setSelectedLoanType(type.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`h-5 w-5 ${type.color}`} />
                            <div className="text-left">
                              <div className="font-medium">{type.name}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {/* Principal Amount */}
                <div className="space-y-2">
                  <Label htmlFor="principal">Loan Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="Enter loan amount"
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500">
                    {principal && formatIndianCurrency(Number.parseFloat(principal))}
                  </p>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Enter interest rate"
                    className="text-lg"
                  />
                </div>

                {/* Loan Tenure */}
                <div className="space-y-2">
                  <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="Enter tenure in years"
                    className="text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {emiResult && (
              <>
                {/* EMI Results Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={`${currentLoanType?.bgColor} border-0`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Monthly EMI</p>
                          <p className="text-3xl font-bold text-gray-900">{formatIndianCurrency(emiResult.emi)}</p>
                        </div>
                        <IndianRupee className={`h-8 w-8 ${currentLoanType?.color}`} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Amount</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {formatIndianCurrency(emiResult.totalAmount)}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Interest</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {formatIndianCurrency(emiResult.totalInterest)}
                          </p>
                        </div>
                        <Calendar className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-0">
                    <CardContent className="p-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-4">Principal vs Interest</p>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Principal ({emiResult.principalPercentage.toFixed(1)}%)</span>
                              <span>{formatIndianCurrency(Number.parseFloat(principal))}</span>
                            </div>
                            <Progress value={emiResult.principalPercentage} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Interest ({emiResult.interestPercentage.toFixed(1)}%)</span>
                              <span>{formatIndianCurrency(emiResult.totalInterest)}</span>
                            </div>
                            <Progress value={emiResult.interestPercentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Amortization Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amortization Schedule (First 5 Years)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Month</th>
                            <th className="text-right p-2">EMI</th>
                            <th className="text-right p-2">Principal</th>
                            <th className="text-right p-2">Interest</th>
                            <th className="text-right p-2">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortization.slice(0, 12).map((entry) => (
                            <tr key={entry.month} className="border-b hover:bg-gray-50">
                              <td className="p-2">{entry.month}</td>
                              <td className="text-right p-2">₹{formatIndianNumber(Math.round(entry.emi))}</td>
                              <td className="text-right p-2">₹{formatIndianNumber(Math.round(entry.principal))}</td>
                              <td className="text-right p-2">₹{formatIndianNumber(Math.round(entry.interest))}</td>
                              <td className="text-right p-2">₹{formatIndianNumber(Math.round(entry.balance))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {amortization.length > 12 && (
                      <p className="text-sm text-gray-500 mt-4 text-center">
                        Showing first 12 months of {Math.min(60, Number.parseFloat(tenure) * 12)} total payments
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>💡 Tips for {currentLoanType?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      {selectedLoanType === "home" && (
                        <>
                          <p>• Claim tax deduction up to ₹1.5 lakh under Section 80C for principal repayment</p>
                          <p>• Interest deduction up to ₹2 lakh under Section 24(b) for self-occupied property</p>
                          <p>• Consider prepayment to reduce total interest burden</p>
                        </>
                      )}
                      {selectedLoanType === "car" && (
                        <>
                          <p>• Car loans typically have shorter tenure (3-7 years) for better rates</p>
                          <p>• Down payment of 10-20% can help reduce EMI burden</p>
                          <p>• Compare rates across banks and NBFCs for best deals</p>
                        </>
                      )}
                      {selectedLoanType === "personal" && (
                        <>
                          <p>• Personal loans have higher interest rates due to unsecured nature</p>
                          <p>• Keep tenure short to minimize interest burden</p>
                          <p>• Good credit score can help negotiate better rates</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
