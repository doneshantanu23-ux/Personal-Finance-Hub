"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Database,
  Globe,
  Monitor,
  Sun,
  Moon,
  TrendingUp,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

interface UserSettings {
  theme: string
  currency: string
  language: string
  notifications: {
    priceAlerts: boolean
    marketUpdates: boolean
    portfolioSummary: boolean
    newsDigest: boolean
  }
  privacy: {
    dataCollection: boolean
    analytics: boolean
    marketingEmails: boolean
  }
  display: {
    compactMode: boolean
    showAnimations: boolean
    autoRefresh: boolean
    refreshInterval: number
  }
  financial: {
    defaultInvestmentAmount: number
    riskTolerance: string
    investmentGoals: string[]
  }
}

const defaultSettings: UserSettings = {
  theme: "system",
  currency: "INR",
  language: "en",
  notifications: {
    priceAlerts: true,
    marketUpdates: true,
    portfolioSummary: false,
    newsDigest: true,
  },
  privacy: {
    dataCollection: false,
    analytics: true,
    marketingEmails: false,
  },
  display: {
    compactMode: false,
    showAnimations: true,
    autoRefresh: true,
    refreshInterval: 30,
  },
  financial: {
    defaultInvestmentAmount: 10000,
    riskTolerance: "moderate",
    investmentGoals: ["retirement", "wealth-building"],
  },
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = React.useState<UserSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = React.useState(false)

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("finance-app-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  const updateSettings = (path: string, value: any) => {
    setSettings((prev) => {
      const keys = path.split(".")
      const updated = { ...prev }
      let current: any = updated

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return updated
    })
    setHasChanges(true)
  }

  const saveSettings = () => {
    localStorage.setItem("finance-app-settings", JSON.stringify(settings))
    setHasChanges(false)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem("finance-app-settings")
    setHasChanges(true)
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Customize your Finance Hub experience</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved changes
            </Badge>
          )}
          <Button onClick={saveSettings} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? "default" : "outline"}
                      onClick={() => setTheme(option.value)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce spacing and padding for more content</p>
              </div>
              <Switch
                checked={settings.display.compactMode}
                onCheckedChange={(checked) => updateSettings("display.compactMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Animations</Label>
                <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
              </div>
              <Switch
                checked={settings.display.showAnimations}
                onCheckedChange={(checked) => updateSettings("display.showAnimations", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Settings
            </CardTitle>
            <CardDescription>Set your preferred currency and language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={settings.currency} onValueChange={(value) => updateSettings("currency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(value) => updateSettings("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</Label>
                  <p className="text-sm text-muted-foreground">
                    {key === "priceAlerts" && "Get notified when prices hit your targets"}
                    {key === "marketUpdates" && "Daily market summary and trends"}
                    {key === "portfolioSummary" && "Weekly portfolio performance reports"}
                    {key === "newsDigest" && "Important financial news updates"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSettings(`notifications.${key}`, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>Control how your data is used and stored</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</Label>
                  <p className="text-sm text-muted-foreground">
                    {key === "dataCollection" && "Allow collection of usage data for improvements"}
                    {key === "analytics" && "Enable analytics to help us improve the app"}
                    {key === "marketingEmails" && "Receive promotional emails and updates"}
                  </p>
                </div>
                <Switch checked={value} onCheckedChange={(checked) => updateSettings(`privacy.${key}`, checked)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your app data and refresh settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">Automatically refresh market data</p>
              </div>
              <Switch
                checked={settings.display.autoRefresh}
                onCheckedChange={(checked) => updateSettings("display.autoRefresh", checked)}
              />
            </div>

            {settings.display.autoRefresh && (
              <div className="space-y-2">
                <Label>Refresh Interval (seconds)</Label>
                <div className="px-3">
                  <Slider
                    value={[settings.display.refreshInterval]}
                    onValueChange={([value]) => updateSettings("display.refreshInterval", value)}
                    max={300}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>10s</span>
                    <span>{settings.display.refreshInterval}s</span>
                    <span>5min</span>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetSettings}>
                Reset to Defaults
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Financial Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Preferences
            </CardTitle>
            <CardDescription>Set your investment preferences and risk tolerance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Investment Amount (₹)</Label>
              <div className="px-3">
                <Slider
                  value={[settings.financial.defaultInvestmentAmount]}
                  onValueChange={([value]) => updateSettings("financial.defaultInvestmentAmount", value)}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>₹1,000</span>
                  <span>₹{settings.financial.defaultInvestmentAmount.toLocaleString()}</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Risk Tolerance</Label>
              <Select
                value={settings.financial.riskTolerance}
                onValueChange={(value) => updateSettings("financial.riskTolerance", value)}
              >
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
