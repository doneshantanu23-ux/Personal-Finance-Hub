"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, IndianRupee, TrendingUp, TrendingDown, Target } from "lucide-react"

interface BudgetEntry {
  id: string
  date: string
  category: string
  amount: number
  type: "income" | "expense"
  description: string
}

interface DayData {
  date: string
  income: number
  expenses: number
  balance: number
  entries: BudgetEntry[]
}

export default function BudgetCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([])
  const [monthlyBudget, setMonthlyBudget] = useState(50000)
  const [newEntry, setNewEntry] = useState({
    category: "",
    amount: "",
    type: "expense" as "income" | "expense",
    description: "",
  })

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other Income"],
    expense: ["Food", "Transportation", "Entertainment", "Shopping", "Bills", "Healthcare", "Education", "Other"],
  }

  const addEntry = () => {
    if (!newEntry.category || !newEntry.amount) return

    const entry: BudgetEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      category: newEntry.category,
      amount: Number.parseFloat(newEntry.amount),
      type: newEntry.type,
      description: newEntry.description,
    }

    setBudgetEntries([...budgetEntries, entry])
    setNewEntry({
      category: "",
      amount: "",
      type: "expense",
      description: "",
    })
    setShowAddForm(false)
  }

  const getDayData = (date: string): DayData => {
    const dayEntries = budgetEntries.filter((entry) => entry.date === date)
    const income = dayEntries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
    const expenses = dayEntries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)

    return {
      date,
      income,
      expenses,
      balance: income - expenses,
      entries: dayEntries,
    }
  }

  const getMonthData = () => {
    const currentMonth = selectedDate.substring(0, 7)
    const monthEntries = budgetEntries.filter((entry) => entry.date.startsWith(currentMonth))
    const totalIncome = monthEntries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
    const totalExpenses = monthEntries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      budgetUsed: (totalExpenses / monthlyBudget) * 100,
    }
  }

  const generateCalendarDays = () => {
    const year = Number.parseInt(selectedDate.substring(0, 4))
    const month = Number.parseInt(selectedDate.substring(5, 7)) - 1
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dateString = current.toISOString().split("T")[0]
      const dayData = getDayData(dateString)
      const isCurrentMonth = current.getMonth() === month
      const isToday = dateString === new Date().toISOString().split("T")[0]
      const isSelected = dateString === selectedDate

      days.push({
        date: dateString,
        day: current.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        ...dayData,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const selectedDayData = getDayData(selectedDate)
  const monthData = getMonthData()
  const calendarDays = generateCalendarDays()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Calendar</h1>
          <p className="text-gray-600">Plan and track your daily budget with visual calendar interface</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>
                      {new Date(selectedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="monthlyBudget">Monthly Budget:</Label>
                    <Input
                      id="monthlyBudget"
                      type="number"
                      value={monthlyBudget}
                      onChange={(e) => setMonthlyBudget(Number.parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Month Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Income</p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{monthData.totalIncome.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Expenses</p>
                          <p className="text-lg font-bold text-red-600">
                            ₹{monthData.totalExpenses.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Balance</p>
                          <p
                            className={`text-lg font-bold ${monthData.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            ₹{monthData.balance.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Budget Used</p>
                          <p
                            className={`text-lg font-bold ${monthData.budgetUsed > 100 ? "text-red-600" : "text-purple-600"}`}
                          >
                            {monthData.budgetUsed.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-50">
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day) => (
                    <div
                      key={day.date}
                      className={`p-2 min-h-[80px] border cursor-pointer transition-colors ${
                        day.isSelected
                          ? "bg-blue-100 border-blue-300"
                          : day.isToday
                            ? "bg-yellow-50 border-yellow-300"
                            : day.isCurrentMonth
                              ? "bg-white hover:bg-gray-50"
                              : "bg-gray-50 text-gray-400"
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="font-medium">{day.day}</div>
                      {day.isCurrentMonth && (day.income > 0 || day.expenses > 0) && (
                        <div className="mt-1 space-y-1">
                          {day.income > 0 && (
                            <div className="text-xs text-green-600">+₹{day.income.toLocaleString("en-IN")}</div>
                          )}
                          {day.expenses > 0 && (
                            <div className="text-xs text-red-600">-₹{day.expenses.toLocaleString("en-IN")}</div>
                          )}
                          <div
                            className={`text-xs font-medium ${day.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            ₹{day.balance.toLocaleString("en-IN")}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Day */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <Button size="sm" onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Income:</span>
                    <span className="font-medium text-green-600">
                      ₹{selectedDayData.income.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expenses:</span>
                    <span className="font-medium text-red-600">
                      ₹{selectedDayData.expenses.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Balance:</span>
                    <span className={`font-bold ${selectedDayData.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ₹{selectedDayData.balance.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {selectedDayData.entries.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Transactions</h4>
                    {selectedDayData.entries.map((entry) => (
                      <div key={entry.id} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium">{entry.category}</span>
                            {entry.description && <p className="text-gray-600">{entry.description}</p>}
                          </div>
                          <Badge variant={entry.type === "income" ? "default" : "destructive"}>
                            {entry.type === "income" ? "+" : "-"}₹{entry.amount.toLocaleString("en-IN")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Days with expenses:</span>
                    <span className="font-medium">
                      {calendarDays.filter((d) => d.isCurrentMonth && d.expenses > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average daily expense:</span>
                    <span className="font-medium">
                      ₹
                      {monthData.totalExpenses > 0
                        ? Math.round(monthData.totalExpenses / new Date().getDate()).toLocaleString("en-IN")
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Remaining budget:</span>
                    <span
                      className={`font-medium ${monthlyBudget - monthData.totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ₹{(monthlyBudget - monthData.totalExpenses).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Entry Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>
                  Add income or expense for {new Date(selectedDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newEntry.type}
                    onValueChange={(value: "income" | "expense") => setNewEntry({ ...newEntry, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newEntry.category}
                    onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[newEntry.type].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    placeholder="Add a note..."
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={addEntry} className="flex-1">
                    Add Transaction
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
