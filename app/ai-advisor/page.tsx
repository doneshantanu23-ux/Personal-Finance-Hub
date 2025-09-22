"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Bot, Send, User, TrendingUp, DollarSign, Target, PieChart } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      const assistantMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessageObj])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const data = JSON.parse(line.slice(2))
                if (data.content) {
                  assistantMessage += data.content
                  setMessages((prev) =>
                    prev.map((m) => (m.id === assistantMessageObj.id ? { ...m, content: assistantMessage } : m)),
                  )
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
  }

  const suggestedQuestions = [
    "How should I diversify my investment portfolio?",
    "What's the best strategy for retirement planning?",
    "How can I reduce my tax liability legally?",
    "Should I invest in mutual funds or direct stocks?",
    "How much emergency fund should I maintain?",
    "What are the best investment options for beginners?",
  ]

  const quickStats = [
    {
      title: "Portfolio Allocation",
      description: "Recommended asset allocation based on your risk profile",
      icon: PieChart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Investment Goals",
      description: "Track progress towards your financial objectives",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Risk Assessment",
      description: "Understand your risk tolerance and capacity",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Tax Optimization",
      description: "Strategies to minimize your tax burden",
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Financial Advisor</h1>
          <p className="text-gray-600">Get personalized financial advice powered by artificial intelligence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  <span>Financial Assistant</span>
                </CardTitle>
                <CardDescription>
                  Ask me anything about personal finance, investments, and financial planning
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Welcome to your AI Financial Advisor!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        I'm here to help you with financial planning, investment advice, and money management
                        strategies.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {suggestedQuestions.slice(0, 4).map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-left h-auto p-3 whitespace-normal bg-transparent"
                            onClick={() => handleQuestionClick(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === "assistant" && <Bot className="h-5 w-5 mt-0.5 text-blue-600" />}
                          {message.role === "user" && <User className="h-5 w-5 mt-0.5" />}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5 text-blue-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me about investments, budgeting, taxes, or any financial topic..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left h-auto p-2 whitespace-normal justify-start"
                      onClick={() => handleQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickStats.map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                      <div key={index} className={`p-3 rounded-lg ${stat.bg}`}>
                        <div className="flex items-start space-x-2">
                          <IconComponent className={`h-5 w-5 ${stat.color} mt-0.5`} />
                          <div>
                            <h4 className="font-medium text-sm">{stat.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "SIP",
                    "Mutual Funds",
                    "Tax Saving",
                    "Emergency Fund",
                    "Retirement",
                    "Insurance",
                    "Real Estate",
                    "Stocks",
                    "Bonds",
                    "Gold",
                  ].map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleQuestionClick(`Tell me about ${topic} investment`)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  This AI advisor provides general financial information and should not be considered as personalized
                  financial advice. Always consult with qualified financial professionals before making investment
                  decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
