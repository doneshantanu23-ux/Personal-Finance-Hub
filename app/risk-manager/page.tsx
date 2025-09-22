"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Eye,
  Settings,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Smartphone,
  Globe,
  Users,
  Leaf,
} from "lucide-react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

interface Risk {
  id: string
  title: string
  category: string
  likelihood: number
  impact: number
  riskScore: number
  status: "identified" | "assessed" | "mitigating" | "monitored" | "closed"
  owner: string
  dueDate: string
  description: string
  mitigationPlan: string
  controls: string[]
  lastAssessed: string
}

interface KRI {
  id: string
  name: string
  value: number
  threshold: number
  trend: "up" | "down" | "stable"
  status: "normal" | "warning" | "critical"
}

const RISK_CATEGORIES = [
  "Market Risk",
  "Credit Risk",
  "Operational Risk",
  "Liquidity Risk",
  "Regulatory Risk",
  "Technology Risk",
  "ESG Risk",
  "Reputational Risk",
]

const COMPLIANCE_FRAMEWORKS = [
  "GDPR",
  "SOX",
  "Basel III",
  "SEBI Guidelines",
  "RBI Regulations",
  "IRDAI Norms",
  "PMLA",
  "FEMA",
]

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#6B7280", "#14B8A6"]

export default function RiskManager() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [risks, setRisks] = useState<Risk[]>([])
  const [kris, setKris] = useState<KRI[]>([])
  const [showRiskForm, setShowRiskForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [riskFormData, setRiskFormData] = useState({
    title: "",
    category: "",
    likelihood: 3,
    impact: 3,
    owner: "",
    dueDate: "",
    description: "",
    mitigationPlan: "",
  })

  useEffect(() => {
    loadRiskData()
  }, [])

  const loadRiskData = async () => {
    setIsLoading(true)

    // Mock risk data
    const mockRisks: Risk[] = [
      {
        id: "1",
        title: "Market Volatility Impact on Portfolio",
        category: "Market Risk",
        likelihood: 4,
        impact: 4,
        riskScore: 16,
        status: "monitored",
        owner: "Portfolio Manager",
        dueDate: "2024-12-31",
        description: "High market volatility could significantly impact portfolio performance",
        mitigationPlan: "Diversification across asset classes and regular rebalancing",
        controls: ["Stop-loss orders", "Portfolio diversification", "Regular monitoring"],
        lastAssessed: "2024-01-15",
      },
      {
        id: "2",
        title: "Regulatory Changes in Tax Laws",
        category: "Regulatory Risk",
        likelihood: 3,
        impact: 3,
        riskScore: 9,
        status: "assessed",
        owner: "Compliance Officer",
        dueDate: "2024-06-30",
        description: "Potential changes in tax regulations affecting investment strategies",
        mitigationPlan: "Stay updated with regulatory changes and adjust strategies accordingly",
        controls: ["Regular compliance reviews", "Legal consultation", "Policy updates"],
        lastAssessed: "2024-01-10",
      },
      {
        id: "3",
        title: "Cybersecurity Threats to Financial Data",
        category: "Technology Risk",
        likelihood: 3,
        impact: 5,
        riskScore: 15,
        status: "mitigating",
        owner: "IT Security Team",
        dueDate: "2024-03-31",
        description: "Potential cyber attacks on financial systems and data",
        mitigationPlan: "Implement multi-factor authentication and regular security audits",
        controls: ["Firewall protection", "Encryption", "Regular backups", "Security training"],
        lastAssessed: "2024-01-12",
      },
    ]

    const mockKRIs: KRI[] = [
      { id: "1", name: "Portfolio Volatility", value: 15.2, threshold: 20, trend: "up", status: "normal" },
      { id: "2", name: "Liquidity Ratio", value: 8.5, threshold: 10, trend: "stable", status: "warning" },
      { id: "3", name: "Credit Exposure", value: 25.8, threshold: 30, trend: "down", status: "normal" },
      { id: "4", name: "Operational Incidents", value: 3, threshold: 5, trend: "up", status: "normal" },
      { id: "5", name: "Compliance Score", value: 92, threshold: 85, trend: "up", status: "normal" },
      { id: "6", name: "ESG Rating", value: 78, threshold: 70, trend: "stable", status: "normal" },
    ]

    setRisks(mockRisks)
    setKris(mockKRIs)
    setIsLoading(false)
  }

  const calculateRiskScore = (likelihood: number, impact: number) => likelihood * impact

  const getRiskLevel = (score: number) => {
    if (score >= 15) return { level: "High", color: "bg-red-100 text-red-800" }
    if (score >= 9) return { level: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Low", color: "bg-green-100 text-green-800" }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "identified":
        return "bg-blue-100 text-blue-800"
      case "assessed":
        return "bg-purple-100 text-purple-800"
      case "mitigating":
        return "bg-orange-100 text-orange-800"
      case "monitored":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRisk: Risk = {
      id: Date.now().toString(),
      ...riskFormData,
      riskScore: calculateRiskScore(riskFormData.likelihood, riskFormData.impact),
      status: "identified",
      controls: [],
      lastAssessed: new Date().toISOString().split("T")[0],
    }
    setRisks([...risks, newRisk])
    setRiskFormData({
      title: "",
      category: "",
      likelihood: 3,
      impact: 3,
      owner: "",
      dueDate: "",
      description: "",
      mitigationPlan: "",
    })
    setShowRiskForm(false)
  }

  const riskDistribution = RISK_CATEGORIES.map((category) => ({
    name: category,
    value: risks.filter((risk) => risk.category === category).length,
  })).filter((item) => item.value > 0)

  const riskTrends = [
    { month: "Jan", high: 2, medium: 5, low: 8 },
    { month: "Feb", high: 3, medium: 4, low: 7 },
    { month: "Mar", high: 1, medium: 6, low: 9 },
    { month: "Apr", high: 2, medium: 3, low: 10 },
    { month: "May", high: 4, medium: 5, low: 6 },
    { month: "Jun", high: 3, medium: 4, low: 8 },
  ]

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-600">Loading risk management data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Risk Manager
          </h1>
          <p className="text-slate-600 mt-2">Comprehensive risk identification, assessment, and management system</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadRiskData} disabled={isLoading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowRiskForm(!showRiskForm)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </div>

      {showRiskForm && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Add New Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRiskSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Risk Title</Label>
                  <Input
                    id="title"
                    value={riskFormData.title}
                    onChange={(e) => setRiskFormData({ ...riskFormData, title: e.target.value })}
                    placeholder="e.g., Market Volatility Risk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={riskFormData.category}
                    onValueChange={(value) => setRiskFormData({ ...riskFormData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Likelihood (1-5)</Label>
                  <Slider
                    value={[riskFormData.likelihood]}
                    onValueChange={([value]) => setRiskFormData({ ...riskFormData, likelihood: value })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Very Low</span>
                    <span>{riskFormData.likelihood}</span>
                    <span>Very High</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Impact (1-5)</Label>
                  <Slider
                    value={[riskFormData.impact]}
                    onValueChange={([value]) => setRiskFormData({ ...riskFormData, impact: value })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Very Low</span>
                    <span>{riskFormData.impact}</span>
                    <span>Very High</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Risk Owner</Label>
                  <Input
                    id="owner"
                    value={riskFormData.owner}
                    onChange={(e) => setRiskFormData({ ...riskFormData, owner: e.target.value })}
                    placeholder="e.g., Portfolio Manager"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Review Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={riskFormData.dueDate}
                    onChange={(e) => setRiskFormData({ ...riskFormData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Risk Description</Label>
                <Input
                  id="description"
                  value={riskFormData.description}
                  onChange={(e) => setRiskFormData({ ...riskFormData, description: e.target.value })}
                  placeholder="Detailed description of the risk"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
                <Input
                  id="mitigationPlan"
                  value={riskFormData.mitigationPlan}
                  onChange={(e) => setRiskFormData({ ...riskFormData, mitigationPlan: e.target.value })}
                  placeholder="How will this risk be mitigated?"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowRiskForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Risk
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-100">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Library
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Risk Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-slate-700">Total Risks</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">{risks.length}</p>
                <p className="text-sm text-slate-500">Active risks identified</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-slate-700">High Risk</h3>
                </div>
                <p className="text-2xl font-bold text-red-600">{risks.filter((r) => r.riskScore >= 15).length}</p>
                <p className="text-sm text-slate-500">Require immediate attention</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-700">Monitored</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {risks.filter((r) => r.status === "monitored").length}
                </p>
                <p className="text-sm text-slate-500">Under active monitoring</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-slate-700">Compliance Score</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">92%</p>
                <p className="text-sm text-slate-500">Overall compliance rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="high" stackId="a" fill="#EF4444" name="High Risk" />
                      <Bar dataKey="medium" stackId="a" fill="#F59E0B" name="Medium Risk" />
                      <Bar dataKey="low" stackId="a" fill="#10B981" name="Low Risk" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Risk Indicators */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Key Risk Indicators (KRIs)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kris.map((kri) => (
                  <div key={kri.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-900">{kri.name}</h4>
                      <Badge
                        className={`${
                          kri.status === "critical"
                            ? "bg-red-100 text-red-800"
                            : kri.status === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {kri.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900">{kri.value}</span>
                      <span className="text-sm text-slate-500">/ {kri.threshold}</span>
                      {kri.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {kri.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {kri.trend === "stable" && <div className="w-4 h-4 bg-slate-400 rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Risk Library</CardTitle>
              <p className="text-slate-600">Centralized repository for all identified risks</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.riskScore)
                  return (
                    <div key={risk.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{risk.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{risk.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={riskLevel.color}>{riskLevel.level}</Badge>
                          <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Category:</span>
                          <p className="font-medium">{risk.category}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Owner:</span>
                          <p className="font-medium">{risk.owner}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Risk Score:</span>
                          <p className="font-medium">{risk.riskScore}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Due Date:</span>
                          <p className="font-medium">{risk.dueDate}</p>
                        </div>
                      </div>
                      {risk.mitigationPlan && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-800">Mitigation Plan:</span>
                          <p className="text-sm text-blue-700 mt-1">{risk.mitigationPlan}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Assessment Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Automated Risk Assessment</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Leverage algorithms and scoring models to dynamically assess risks
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Run Assessment</Button>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2">Two-Level Assessment</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Multi-level assessment process for more realistic risk scores
                  </p>
                  <Button variant="outline" className="border-purple-600 text-purple-600 bg-transparent">
                    Configure Levels
                  </Button>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-2">Risk Scenarios</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Create various risk scenarios to simulate potential impacts
                  </p>
                  <Button variant="outline" className="border-green-600 text-green-600 bg-transparent">
                    Create Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Assessment Methodologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Qualitative Assessment</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Quantitative Assessment</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Monte Carlo Simulation</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Stress Testing</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Scenario Analysis</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Control Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium text-green-900">Firewall Protection</span>
                    <p className="text-sm text-green-700">Last tested: 2 days ago</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <span className="font-medium text-yellow-900">Portfolio Diversification</span>
                    <p className="text-sm text-yellow-700">Needs review</p>
                  </div>
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium text-red-900">Compliance Training</span>
                    <p className="text-sm text-red-700">Overdue</p>
                  </div>
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Real-time Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="font-medium text-red-900">Critical Alert</p>
                  <p className="text-sm text-red-700">Portfolio volatility exceeded threshold</p>
                  <p className="text-xs text-red-600">2 minutes ago</p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="font-medium text-yellow-900">Warning</p>
                  <p className="text-sm text-yellow-700">Liquidity ratio approaching limit</p>
                  <p className="text-xs text-yellow-600">15 minutes ago</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="font-medium text-blue-900">Information</p>
                  <p className="text-sm text-blue-700">Monthly risk report generated</p>
                  <p className="text-xs text-blue-600">1 hour ago</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Case Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">CASE-001</span>
                    <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-slate-600">Market volatility mitigation</p>
                  <p className="text-xs text-slate-500">Due: Jan 30, 2024</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">CASE-002</span>
                    <Badge className="bg-blue-100 text-blue-800">New</Badge>
                  </div>
                  <p className="text-sm text-slate-600">Cybersecurity assessment</p>
                  <p className="text-xs text-slate-500">Due: Feb 15, 2024</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">CASE-003</span>
                    <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                  </div>
                  <p className="text-sm text-slate-600">Regulatory compliance update</p>
                  <p className="text-xs text-slate-500">Completed: Jan 10, 2024</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Compliance Frameworks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {COMPLIANCE_FRAMEWORKS.map((framework, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium">{framework}</span>
                      <p className="text-sm text-slate-600">
                        {framework === "GDPR" && "Data Protection Regulation"}
                        {framework === "SOX" && "Sarbanes-Oxley Act"}
                        {framework === "Basel III" && "Banking Regulations"}
                        {framework === "SEBI Guidelines" && "Securities Market Regulations"}
                        {framework === "RBI Regulations" && "Banking Compliance"}
                        {framework === "IRDAI Norms" && "Insurance Regulations"}
                        {framework === "PMLA" && "Money Laundering Prevention"}
                        {framework === "FEMA" && "Foreign Exchange Management"}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">Risk Assessment Updated</span>
                    <span className="text-xs text-slate-500">Jan 15, 2024</span>
                  </div>
                  <p className="text-sm text-slate-600">Market risk assessment completed by Portfolio Manager</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">Control Testing</span>
                    <span className="text-xs text-slate-500">Jan 12, 2024</span>
                  </div>
                  <p className="text-sm text-slate-600">Automated control testing executed successfully</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">Policy Update</span>
                    <span className="text-xs text-slate-500">Jan 10, 2024</span>
                  </div>
                  <p className="text-sm text-slate-600">Risk management policy updated for regulatory changes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>ESG Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900">Environmental</h4>
                  <p className="text-2xl font-bold text-green-700">85%</p>
                  <p className="text-sm text-green-600">Sustainability Score</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Social</h4>
                  <p className="text-2xl font-bold text-blue-700">78%</p>
                  <p className="text-sm text-blue-600">Social Impact Score</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">Governance</h4>
                  <p className="text-2xl font-bold text-purple-700">92%</p>
                  <p className="text-sm text-purple-600">Governance Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Risk Management Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Automated Assessments</span>
                      <p className="text-sm text-slate-600">Enable automatic risk scoring</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Real-time Monitoring</span>
                      <p className="text-sm text-slate-600">Continuous risk monitoring</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Email Notifications</span>
                      <p className="text-sm text-slate-600">Risk alert notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Risk Tolerance Level</Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Additional Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Smartphone className="w-6 h-6" />
                    <span className="text-sm">Mobile Access</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Globe className="w-6 h-6" />
                    <span className="text-sm">Integration</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">User Personas</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                    <Settings className="w-6 h-6" />
                    <span className="text-sm">Customization</span>
                  </Button>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
