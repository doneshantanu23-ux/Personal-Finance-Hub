"use client"

import { useState, useEffect } from "react"
import { RealEstate } from "@/entities/RealEstate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  TrendingUp,
  TrendingDown,
  MapPin,
  Building,
  IndianRupee,
  BarChart3,
  Newspaper,
  Gem,
  Plus,
  RefreshCw,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts"
import { format } from "date-fns"

const MAJOR_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
]

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899"]

export default function IndianRealEstate() {
  const [properties, setProperties] = useState([])
  const [marketData, setMarketData] = useState(null)
  const [priceAnalysis, setPriceAnalysis] = useState(null)
  const [realEstateNews, setRealEstateNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [formData, setFormData] = useState({
    property_name: "",
    location: "",
    property_type: "",
    area_sqft: "",
    purchase_price: "",
    current_value: "",
    purchase_date: format(new Date(), "yyyy-MM-dd"),
    rental_income: "",
    maintenance_cost: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load user's real estate properties
      const propertyData = await RealEstate.list("-created_date")
      setProperties(propertyData)

      // Load market analysis
      await loadMarketAnalysis()
      await loadRealEstateNews()
    } catch (error) {
      console.error("Error loading real estate data:", error)
    }
    setIsLoading(false)
  }

  const loadMarketAnalysis = async () => {
    try {
      const mockMarketData = {
        city_prices: [
          { city: "Mumbai", avg_price_per_sqft: 18500, yoy_growth: 8.2, market_sentiment: "Strong" },
          { city: "Delhi", avg_price_per_sqft: 12800, yoy_growth: 6.5, market_sentiment: "Stable" },
          { city: "Bangalore", avg_price_per_sqft: 9200, yoy_growth: 12.3, market_sentiment: "Very Strong" },
          { city: "Hyderabad", avg_price_per_sqft: 6800, yoy_growth: 15.1, market_sentiment: "Excellent" },
          { city: "Chennai", avg_price_per_sqft: 7500, yoy_growth: 9.8, market_sentiment: "Strong" },
          { city: "Pune", avg_price_per_sqft: 8900, yoy_growth: 11.2, market_sentiment: "Strong" },
          { city: "Kolkata", avg_price_per_sqft: 5200, yoy_growth: 4.3, market_sentiment: "Moderate" },
          { city: "Ahmedabad", avg_price_per_sqft: 4800, yoy_growth: 7.9, market_sentiment: "Good" },
        ],
        market_trends: {
          overall_growth: 9.2,
          best_performing_city: "Hyderabad",
          emerging_locations: [
            "Noida Extension",
            "Gurgaon Sector 82-89",
            "Whitefield Bangalore",
            "HITEC City Hyderabad",
            "OMR Chennai",
          ],
        },
        predictions: {
          next_12_months: "Expected moderate growth of 8-12% across major cities with IT hubs leading the growth",
          key_factors: [
            "Infrastructure development and metro connectivity",
            "IT sector expansion and job creation",
            "Government policies like RERA implementation",
            "Interest rate stability",
            "Urban migration trends",
          ],
          investment_advice:
            "Focus on emerging IT corridors and areas with upcoming metro connectivity for best returns",
        },
      }

      setMarketData(mockMarketData)

      const mockPredictionData = {
        price_predictions: [
          { city: "Mumbai", predicted_growth_2025: 7.5, predicted_growth_2026: 6.8, confidence_level: "High" },
          { city: "Delhi", predicted_growth_2025: 6.2, predicted_growth_2026: 5.9, confidence_level: "High" },
          {
            city: "Bangalore",
            predicted_growth_2025: 11.8,
            predicted_growth_2026: 10.5,
            confidence_level: "Very High",
          },
          {
            city: "Hyderabad",
            predicted_growth_2025: 13.2,
            predicted_growth_2026: 11.9,
            confidence_level: "Very High",
          },
          { city: "Chennai", predicted_growth_2025: 8.9, predicted_growth_2026: 8.1, confidence_level: "High" },
          { city: "Pune", predicted_growth_2025: 10.1, predicted_growth_2026: 9.3, confidence_level: "High" },
        ],
        growth_drivers: [
          "Expansion of IT and tech parks in tier-2 cities",
          "Government's Smart Cities Mission implementation",
          "Improved transportation infrastructure and metro projects",
          "Rising disposable income and urbanization",
          "Foreign investment in real estate sector",
          "Development of satellite towns and peripheral areas",
        ],
        risk_factors: [
          "Interest rate fluctuations affecting home loan demand",
          "Regulatory changes and policy uncertainties",
          "Economic slowdown impacting job market",
          "Oversupply in certain micro-markets",
          "Environmental clearance delays for new projects",
          "Global economic conditions affecting FDI",
        ],
        investment_strategies:
          "Diversify across multiple cities with focus on emerging IT hubs. Consider properties near upcoming metro stations and in areas with planned infrastructure development. For long-term investors, tier-2 cities offer better growth potential. Rental yield focused investors should target established commercial areas with good connectivity.",
      }

      setPriceAnalysis(mockPredictionData)
    } catch (error) {
      console.error("Error loading market analysis:", error)
    }
  }

  const loadRealEstateNews = async () => {
    try {
      const mockNewsData = [
        {
          headline: "RERA Implementation Shows 40% Improvement in Project Delivery Timelines",
          summary:
            "Real Estate Regulatory Authority has significantly improved project completion rates across major cities. Developers are now more accountable with transparent project timelines and better buyer protection.",
          source: "Economic Times",
          category: "Regulation",
          impact: "positive",
        },
        {
          headline: "Mumbai Metro Line 3 to Boost Property Values by 25-30% in Connecting Areas",
          summary:
            "The upcoming Colaba-Bandra-SEEPZ metro line is expected to significantly increase property values along its route. Areas like BKC, Worli, and Lower Parel are seeing increased investor interest.",
          source: "Mumbai Mirror",
          category: "Infrastructure",
          impact: "positive",
        },
        {
          headline: "Bangalore IT Corridor Expansion Drives 15% Price Appreciation",
          summary:
            "New IT parks in Whitefield and Electronic City Phase 2 have led to substantial price increases. Rental yields in these areas have improved to 3-4% annually.",
          source: "Bangalore Times",
          category: "Market Update",
          impact: "positive",
        },
        {
          headline: "Home Loan Interest Rates Expected to Remain Stable at 8.5-9%",
          summary:
            "RBI's monetary policy stance suggests stable interest rates for the next 6-8 months. This provides certainty for home buyers and supports continued demand in the residential segment.",
          source: "Business Standard",
          category: "Finance",
          impact: "positive",
        },
        {
          headline: "Hyderabad Emerges as Top Investment Destination with 18% Annual Growth",
          summary:
            "HITEC City and Gachibowli areas continue to attract major IT companies. New infrastructure projects and metro connectivity are driving unprecedented growth in property values.",
          source: "Deccan Chronicle",
          category: "Investment",
          impact: "positive",
        },
        {
          headline: "Green Building Certification Becomes Mandatory for Projects Above 20,000 sq ft",
          summary:
            "New environmental regulations require IGBC or LEED certification for large residential and commercial projects. This may increase construction costs but improve long-term sustainability.",
          source: "Hindu Business Line",
          category: "Regulation",
          impact: "neutral",
        },
        {
          headline: "Affordable Housing Segment Sees 25% Growth in Sales Volume",
          summary:
            "Government incentives under PMAY and reduced GST rates have boosted affordable housing sales. Tier-2 and tier-3 cities are leading this growth with improved financing options.",
          source: "Financial Express",
          category: "Market Update",
          impact: "positive",
        },
        {
          headline: "Commercial Real Estate Recovery: Office Space Absorption Up 30%",
          summary:
            "Post-pandemic recovery in commercial real estate shows strong momentum. Hybrid work models are driving demand for flexible office spaces and co-working facilities.",
          source: "Mint",
          category: "Commercial",
          impact: "positive",
        },
      ]

      setRealEstateNews(mockNewsData)
    } catch (error) {
      console.error("Error loading real estate news:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await RealEstate.create({
      ...formData,
      area_sqft: Number.parseFloat(formData.area_sqft),
      purchase_price: Number.parseFloat(formData.purchase_price),
      current_value: Number.parseFloat(formData.current_value) || Number.parseFloat(formData.purchase_price),
      rental_income: Number.parseFloat(formData.rental_income) || 0,
      maintenance_cost: Number.parseFloat(formData.maintenance_cost) || 0,
    })
    setFormData({
      property_name: "",
      location: "",
      property_type: "",
      area_sqft: "",
      purchase_price: "",
      current_value: "",
      purchase_date: format(new Date(), "yyyy-MM-dd"),
      rental_income: "",
      maintenance_cost: "",
    })
    setShowForm(false)
    loadData()
  }

  const calculatePortfolioValue = () => {
    return properties.reduce((sum, prop) => sum + (prop.current_value || prop.purchase_price), 0)
  }

  const calculateTotalInvestment = () => {
    return properties.reduce((sum, prop) => sum + prop.purchase_price, 0)
  }

  const calculateMonthlyRental = () => {
    return properties.reduce((sum, prop) => sum + (prop.rental_income || 0), 0)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-600">Loading Indian real estate data...</p>
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
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-slate-800" />
            </div>
            Indian Real Estate
          </h1>
          <p className="text-slate-600 mt-2">Track property investments and market trends across India</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} disabled={isLoading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-600" />
              Add New Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="property_name">Property Name</Label>
                  <Input
                    id="property_name"
                    value={formData.property_name}
                    onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                    placeholder="e.g., My Mumbai Apartment"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAJOR_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area_sqft">Area (sq ft)</Label>
                  <Input
                    id="area_sqft"
                    type="number"
                    value={formData.area_sqft}
                    onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                    placeholder="1200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price (₹)</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    placeholder="5000000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_value">Current Value (₹)</Label>
                  <Input
                    id="current_value"
                    type="number"
                    value={formData.current_value}
                    onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                    placeholder="5500000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rental_income">Monthly Rent (₹)</Label>
                  <Input
                    id="rental_income"
                    type="number"
                    value={formData.rental_income}
                    onChange={(e) => setFormData({ ...formData, rental_income: e.target.value })}
                    placeholder="25000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Add Property
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Market Analysis
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Gem className="w-4 h-4" />
            Price Predictions
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Real Estate News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-slate-700">Portfolio Value</h3>
                </div>
                <p className="text-2xl font-bold text-emerald-700">
                  ₹{calculatePortfolioValue().toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-700">Total Investment</h3>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{calculateTotalInvestment().toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-slate-700">Total Gain</h3>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{(calculatePortfolioValue() - calculateTotalInvestment()).toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-slate-700">Monthly Rental</h3>
                </div>
                <p className="text-2xl font-bold text-orange-700">
                  ₹{calculateMonthlyRental().toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Properties List */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Your Properties</CardTitle>
            </CardHeader>
            <CardContent>
              {properties.length > 0 ? (
                <div className="space-y-4">
                  {properties.map((property) => {
                    const gain = (property.current_value || property.purchase_price) - property.purchase_price
                    const gainPercent = (gain / property.purchase_price) * 100
                    return (
                      <div
                        key={property.id}
                        className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{property.property_name}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {property.location}
                              </span>
                              <span>{property.property_type}</span>
                              <span>{property.area_sqft} sq ft</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-slate-600">
                                Purchase: ₹{property.purchase_price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-sm text-slate-600">
                                Current: ₹{(property.current_value || property.purchase_price).toLocaleString("en-IN")}
                              </span>
                              {property.rental_income > 0 && (
                                <span className="text-sm text-emerald-600">
                                  Rent: ₹{property.rental_income.toLocaleString("en-IN")}/month
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`${gain >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                            >
                              {gain >= 0 ? "+" : ""}₹{gain.toLocaleString("en-IN")} ({gainPercent.toFixed(1)}%)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Properties Yet</h3>
                  <p className="text-slate-600 mb-6">
                    Start building your real estate portfolio by adding your first property.
                  </p>
                  <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {marketData && (
            <>
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>City-wise Real Estate Prices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketData.city_prices}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="city" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          formatter={(value) => [`₹${value.toLocaleString("en-IN")}/sq ft`, "Price"]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="avg_price_per_sqft" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Market Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <p className="text-sm text-emerald-600 font-medium">Overall Growth</p>
                      <p className="text-2xl font-bold text-emerald-700">{marketData.market_trends?.overall_growth}%</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Best Performing City</h4>
                      <p className="text-slate-700">{marketData.market_trends?.best_performing_city}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Emerging Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {marketData.market_trends?.emerging_locations?.map((location, index) => (
                          <Badge key={index} variant="outline">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>City Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {marketData.city_prices?.map((city, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                            <span className="font-medium text-slate-900">{city.city}</span>
                            <p className="text-sm text-slate-600">
                              ₹{city.avg_price_per_sqft?.toLocaleString("en-IN")}/sq ft
                            </p>
                          </div>
                          <Badge
                            className={`${city.yoy_growth >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                          >
                            {city.yoy_growth >= 0 ? "+" : ""}
                            {city.yoy_growth}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {priceAnalysis && (
            <>
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-600" />
                    Price Predictions (2025-2026)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {priceAnalysis.price_predictions?.map((prediction, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-900">{prediction.city}</h3>
                            <p className="text-sm text-slate-600">Confidence: {prediction.confidence_level}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-4">
                              <div>
                                <p className="text-xs text-slate-500">2025</p>
                                <p className="font-semibold text-emerald-600">+{prediction.predicted_growth_2025}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">2026</p>
                                <p className="font-semibold text-blue-600">+{prediction.predicted_growth_2026}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Growth Drivers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {priceAnalysis.growth_drivers?.map((driver, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {priceAnalysis.risk_factors?.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Investment Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{priceAnalysis.investment_strategies}</p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {realEstateNews.map((news, index) => (
              <Card key={index} className="glass-card border-0 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {news.source}
                    </Badge>
                    <Badge
                      className={`text-xs ${
                        news.impact === "positive"
                          ? "bg-emerald-100 text-emerald-800"
                          : news.impact === "negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {news.impact}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{news.headline}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-3">{news.summary}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {news.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
