"use client"

import { useState, useEffect } from "react"

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  time: string
}

interface CategoryTotal {
  category: string
  amount: number
  count: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Other",
]

export default function DailySpending() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [dailyBudget, setDailyBudget] = useState(1000)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
  })

  useEffect(() => {
    // Load mock data
    loadMockData()
  }, [])

  const loadMockData = () => {
    const mockExpenses: Expense[] = [
      {
        id: "1",
        amount: 250,
        category: "Food & Dining",
        description: "Lunch at restaurant",
        date: new Date().toISOString().split("T")[0],
        time: "13:30",
      },
      {
        id: "2",
        amount: 80,
        category: "Transportation",
        description: "Uber ride",
        date: new Date().toISOString().split("T")[0],
        time: "09:15",
      },
      {
        id: "3",
        amount: 150,
        category: "Groceries",
        description: "Weekly groceries",
        date: new Date().toISOString().split("T")[0],
        time: "18:45",
      },
      {
        id: "4",
        amount: 45,
        category: "Entertainment",
        description: "Movie ticket",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        time: "20:00",
      },
      {
        id: "5",
        amount: 320,
        category: "Shopping",
        description: "Clothing",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        time: "16:30",
      },
    ]
    setExpenses(mockExpenses)
  }

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.category) return

    const expense: Expense = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: selectedDate,
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    }

    setExpenses([expense, ...expenses])
    setNewExpense({
      amount: "",
      category: "",
      description: "",
    })
    setShowAddForm(false)
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const filteredExpenses = expenses.filter((expense) => expense.date === selectedDate)
  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = dailyBudget - totalSpent

  const categoryTotals: CategoryTotal[] = CATEGORIES.map((category) => {
    const categoryExpenses = filteredExpenses.filter((expense) => expense.category === category)
    return {
      category,
      amount: categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      count: categoryExpenses.length,
    }
  }).filter((total) => total.amount > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Daily Spending Tracker</h1>

          {/* Date Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Daily Budget</h3>
              <p className="text-2xl font-bold text-blue-800">₹{dailyBudget}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600">Total Spent</h3>
              <p className="text-2xl font-bold text-red-800">₹{totalSpent}</p>
            </div>
            <div className={`p-4 rounded-lg ${remainingBudget >= 0 ? "bg-green-50" : "bg-orange-50"}`}>
              <h3 className={`text-sm font-medium ${remainingBudget >= 0 ? "text-green-600" : "text-orange-600"}`}>
                {remainingBudget >= 0 ? "Remaining" : "Over Budget"}
              </h3>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? "text-green-800" : "text-orange-800"}`}>
                ₹{Math.abs(remainingBudget)}
              </p>
            </div>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-6"
          >
            {showAddForm ? "Cancel" : "Add Expense"}
          </button>

          {/* Add Expense Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <button
                onClick={addExpense}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Expense
              </button>
            </div>
          )}

          {/* Expenses List */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Expenses for {new Date(selectedDate).toLocaleDateString()}
            </h2>
            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses recorded for this date</p>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white border border-gray-200 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">₹{expense.amount}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{expense.category}</span>
                      <span className="text-sm text-gray-500">{expense.time}</span>
                    </div>
                    {expense.description && <p className="text-gray-600 mt-1">{expense.description}</p>}
                  </div>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Category Summary */}
          {categoryTotals.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTotals.map((total, index) => (
                  <div key={total.category} className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="font-medium">{total.category}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">₹{total.amount}</p>
                    <p className="text-sm text-gray-500">
                      {total.count} transaction{total.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
