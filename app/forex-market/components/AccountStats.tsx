import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, BarChart3, Percent } from "lucide-react"

export default function AccountStats({ positions }) {
  const closedPositions = positions.filter((p) => p.status === "closed")

  const totalPnL = closedPositions.reduce((sum, p) => sum + (p.pnl_inr || 0), 0)
  const winningTrades = closedPositions.filter((p) => (p.pnl_inr || 0) > 0)
  const losingTrades = closedPositions.filter((p) => (p.pnl_inr || 0) < 0)
  const winRate = closedPositions.length > 0 ? (winningTrades.length / closedPositions.length) * 100 : 0

  const avgWin =
    winningTrades.length > 0 ? winningTrades.reduce((sum, p) => sum + p.pnl_inr, 0) / winningTrades.length : 0
  const avgLoss =
    losingTrades.length > 0 ? losingTrades.reduce((sum, p) => sum + Math.abs(p.pnl_inr), 0) / losingTrades.length : 0
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="glass-card border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div
            className={`p-3 rounded-2xl ${color.includes("emerald") ? "bg-emerald-100" : color.includes("red") ? "bg-red-100" : "bg-blue-100"}`}
          >
            <Icon
              className={`w-6 h-6 ${color.includes("emerald") ? "text-emerald-600" : color.includes("red") ? "text-red-600" : "text-blue-600"}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total P&L"
          value={`₹${totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          icon={totalPnL >= 0 ? TrendingUp : TrendingDown}
          color={totalPnL >= 0 ? "text-emerald-600" : "text-red-600"}
        />

        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon={Percent}
          color="text-blue-600"
          subtitle={`${winningTrades.length}W / ${losingTrades.length}L`}
        />

        <StatCard title="Total Trades" value={closedPositions.length} icon={BarChart3} color="text-blue-600" />

        <StatCard
          title="Average Win"
          value={`₹${avgWin.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          color="text-emerald-600"
        />

        <StatCard
          title="Average Loss"
          value={`₹${avgLoss.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          icon={TrendingDown}
          color="text-red-600"
        />

        <StatCard
          title="Profit Factor"
          value={profitFactor.toFixed(2)}
          icon={Target}
          color={profitFactor > 1 ? "text-emerald-600" : "text-red-600"}
          subtitle={profitFactor > 1 ? "Profitable" : "Needs Improvement"}
        />
      </div>

      {closedPositions.length === 0 && (
        <Card className="glass-card border-0 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Trading History</h3>
          <p className="text-slate-600">Start trading to see your performance statistics here.</p>
        </Card>
      )}
    </div>
  )
}
