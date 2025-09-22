"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, CreditCard, TrendingDown, Calendar, Target, Trash2, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

interface Debt {
  id: string
  name: string
  type: string
  balance: number
  interestRate: number
  minimumPayment: number
  dueDate: number // day of month
  priority: number
}

interface PayoffStrategy {
  name: string
  description: string
  totalInterest: number
  payoffTime: number
  monthlyPayment: number
}

const debtTypes = [
  { name: "Credit Card", color: "bg-red-500", icon: "💳" },
  { name: "Personal Loan", color: "bg-orange-500", icon: "💰" },
  { name: "Home Loan", color: "bg-blue-500", icon: "🏠" },
  { name: "Car Loan", color: "bg-green-500", icon: "🚗" },
  { name: "Student Loan", color: "bg-purple-500", icon: "🎓" },
  { name: "Business Loan", color: "bg-indigo-500", icon: "💼" },
  { name: "Other", color: "bg-gray-500", icon: "📋" },
]

export default function DebtPlanner() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [extraPayment, setExtraPayment] = useState<number>(0)
  const [selectedStrategy, setSelectedStrategy] = useState<string>("minimum")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  })

  // Load debts from localStorage
  useEffect(() => {
    const savedDebts = localStorage.getItem("debts")
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts))
    }
  }, [])

  // Save debts to localStorage
  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts))
  }, [debts])

  const addDebt = () => {
    if (!formData.name || !formData.type || !formData.balance || !formData.interestRate || !formData.minimumPayment) {
      return
    }

    const newDebt: Debt = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      balance: Number.parseFloat(formData.balance),
      interestRate: Number.parseFloat(formData.interestRate),
      minimumPayment: Number.parseFloat(formData.minimumPayment),
      dueDate: Number.parseInt(formData.dueDate) || 1,
      priority: debts.length + 1,
    }

    setDebts([...debts, newDebt])
    setFormData({
      name: "",
      type: "",
      balance: "",
      interestRate: "",
      minimumPayment: "",
      dueDate: "",
    })
    setIsAddDialogOpen(false)
  }

  const deleteDebt = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id))
  }

  const updateDebtPriority = (id: string, newPriority: number) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, priority: newPriority } : debt)))
  }

  // Calculate debt statistics
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)
  const averageInterestRate =
    debts.length > 0 ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length : 0

  // Calculate payoff strategies
  const calculatePayoffStrategies = (): PayoffStrategy[] => {
    if (debts.length === 0) return []

    const strategies: PayoffStrategy[] = []
    const totalAvailable = totalMinimumPayment + extraPayment

    // Minimum Payment Strategy
    let minimumTotalInterest = 0
    let minimumPayoffTime = 0
    debts.forEach((debt) => {
      const monthlyRate = debt.interestRate / 100 / 12
      const months = Math.log(1 + (debt.balance * monthlyRate) / debt.minimumPayment) / Math.log(1 + monthlyRate)
      const totalPaid = debt.minimumPayment * months
      minimumTotalInterest += totalPaid - debt.balance
      minimumPayoffTime = Math.max(minimumPayoffTime, months)
    })

    strategies.push({
      name: "Minimum Payments",
      description: "Pay only minimum amounts on all debts",
      totalInterest: minimumTotalInterest,
      payoffTime: minimumPayoffTime,
      monthlyPayment: totalMinimumPayment,
    })

    // Debt Snowball (lowest balance first)
    const snowballDebts = [...debts].sort((a, b) => a.balance - b.balance)
    let snowballInterest = 0
    let snowballTime = 0
    let remainingPayment = totalAvailable

    snowballDebts.forEach((debt, index) => {
      const monthlyRate = debt.interestRate / 100 / 12
      const payment = index === 0 ? remainingPayment : debt.minimumPayment
      const months = Math.log(1 + (debt.balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
      const totalPaid = payment * months
      snowballInterest += totalPaid - debt.balance
      snowballTime += months
      remainingPayment += payment - debt.minimumPayment
    })

    strategies.push({
      name: "Debt Snowball",
      description: "Pay off smallest balances first for psychological wins",
      totalInterest: snowballInterest,
      payoffTime: snowballTime,
      monthlyPayment: totalAvailable,
    })

    // Debt Avalanche (highest interest rate first)
    const avalancheDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate)
    let avalancheInterest = 0
    let avalancheTime = 0
    remainingPayment = totalAvailable

    avalancheDebts.forEach((debt, index) => {
      const monthlyRate = debt.interestRate / 100 / 12
      const payment = index === 0 ? remainingPayment : debt.minimumPayment
      const months = Math.log(1 + (debt.balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
      const totalPaid = payment * months
      avalancheInterest += totalPaid - debt.balance
      avalancheTime += months
      remainingPayment += payment - debt.minimumPayment
    })

    strategies.push({
      name: "Debt Avalanche",
      description: "Pay off highest interest rates first to minimize total interest",
      totalInterest: avalancheInterest,
      payoffTime: avalancheTime,
      monthlyPayment: totalAvailable,
    })

    return strategies
  }

  const payoffStrategies = calculatePayoffStrategies()

  const getDebtTypeIcon = (type: string) => {
    const debtType = debtTypes.find((dt) => dt.name === type)
    return debtType?.icon || "📋"
  }

  const getDebtTypeColor = (type: string) => {
    const debtType = debtTypes.find((dt) => dt.name === type)
    return debtType?.color || "bg-gray-500"
  }

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12)
    const remainingMonths = Math.floor(months % 12)
    if (years > 0) {
      return `${years}y ${remainingMonths}m`
    }
    return `${remainingMonths}m`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debt Planner</h1>
          <p className="text-gray-600">Manage your debts and plan your path to financial freedom</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Debt</DialogTitle>
              <DialogDescription>
                Enter details about your debt to start tracking and planning payoff.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="debt-name">Debt Name</Label>
                <Input
                  id="debt-name"
                  placeholder="e.g., Chase Credit Card"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="debt-type">Debt Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {debtTypes.map((type) => (
                        <SelectItem key={type.name} value={type.name}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="balance">Current Balance (₹)</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="minimum-payment">Minimum Payment (₹)</Label>
                  <Input
                    id="minimum-payment"
                    type="number"
                    placeholder="0.00"
                    value={formData.minimumPayment}
                    onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="due-date">Due Date (Day of Month)</Label>
                <Input
                  id="due-date"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="15"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <Button onClick={addDebt} className="w-full">
                Add Debt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDebt.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{debts.length} active debts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalMinimumPayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Minimum required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageInterestRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all debts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Debt-to-Income</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Add income to calculate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="debts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="debts">My Debts</TabsTrigger>
          <TabsTrigger value="strategies">Payoff Strategies</TabsTrigger>
          <TabsTrigger value="calculator">Payoff Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="debts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Debt Overview</CardTitle>
              <CardDescription>Manage your debts and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {debts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No debts added yet</p>
                    <p className="text-sm">Add your first debt to start planning</p>
                  </div>
                ) : (
                  debts
                    .sort((a, b) => a.priority - b.priority)
                    .map((debt) => (
                      <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center text-white",
                              getDebtTypeColor(debt.type),
                            )}
                          >
                            <span className="text-xl">{getDebtTypeIcon(debt.type)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-lg">{debt.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{debt.type}</span>
                              <span>•</span>
                              <span>{debt.interestRate}% APR</span>
                              <span>•</span>
                              <span>Due: {debt.dueDate}th</span>
                            </div>
                            <div className="mt-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <span>Min Payment: ₹{debt.minimumPayment.toLocaleString()}</span>
                                <Badge variant="outline">Priority {debt.priority}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">₹{debt.balance.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Current Balance</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDebt(debt.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extra Payment Amount</CardTitle>
              <CardDescription>How much extra can you pay toward debts each month?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="extra-payment">Extra Monthly Payment (₹)</Label>
                <Input
                  id="extra-payment"
                  type="number"
                  placeholder="0.00"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number.parseFloat(e.target.value) || 0)}
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {payoffStrategies.map((strategy) => (
              <Card key={strategy.name} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Interest</p>
                    <p className="text-xl font-bold text-red-600">₹{strategy.totalInterest.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payoff Time</p>
                    <p className="text-xl font-bold">{formatMonths(strategy.payoffTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="text-xl font-bold">₹{strategy.monthlyPayment.toLocaleString()}</p>
                  </div>
                  {strategy.name === "Debt Avalanche" && (
                    <Badge className="absolute top-2 right-2 bg-green-500">Recommended</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Debt Payoff Calculator</CardTitle>
              <CardDescription>Calculate how long it will take to pay off individual debts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Individual debt calculators coming soon</p>
                <p className="text-sm">Use the strategies tab for comprehensive planning</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
