"use client"

import { useState } from "react"
import { ForexPosition } from "@/entities/ForexPosition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"

// Simplified P/L calculation assuming USD as the quote currency for major pairs.
// This is an approximation. A precise calculation would depend on the quote currency of the pair.
const calculatePnl = (position, exitPrice) => {
  const pnlPerLot =
    position.type === "long" ? (exitPrice - position.entry_price) * 100000 : (position.entry_price - exitPrice) * 100000

  // Adjust for JPY pairs
  if (position.pair.includes("JPY")) {
    return (pnlPerLot / 100) * position.size_lots
  }
  return pnlPerLot * position.size_lots
}

const NewPositionForm = ({ refreshPositions, inrRate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newPosition, setNewPosition] = useState({
    pair: "EUR/USD",
    type: "long",
    size_lots: 0.01,
    entry_price: "",
    stop_loss: "",
    take_profit: "",
  })

  const handleSubmit = async () => {
    await ForexPosition.create({
      ...newPosition,
      entry_price: Number.parseFloat(newPosition.entry_price),
      stop_loss: Number.parseFloat(newPosition.stop_loss) || null,
      take_profit: Number.parseFloat(newPosition.take_profit) || null,
      open_date: new Date().toISOString(),
    })
    refreshPositions()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Add New Trade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a New Forex Trade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Currency Pair</Label>
            <Input
              value={newPosition.pair}
              onChange={(e) => setNewPosition({ ...newPosition, pair: e.target.value.toUpperCase() })}
              placeholder="e.g., EUR/USD"
            />
          </div>
          <div className="space-y-2">
            <Label>Trade Type</Label>
            <Select value={newPosition.type} onValueChange={(type) => setNewPosition({ ...newPosition, type })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="long">Long (Buy)</SelectItem>
                <SelectItem value="short">Short (Sell)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Size (Lots)</Label>
            <Input
              type="number"
              step="0.01"
              value={newPosition.size_lots}
              onChange={(e) => setNewPosition({ ...newPosition, size_lots: Number.parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <Label>Entry Price</Label>
            <Input
              type="number"
              value={newPosition.entry_price}
              onChange={(e) => setNewPosition({ ...newPosition, entry_price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Stop Loss (Optional)</Label>
            <Input
              type="number"
              value={newPosition.stop_loss}
              onChange={(e) => setNewPosition({ ...newPosition, stop_loss: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Take Profit (Optional)</Label>
            <Input
              type="number"
              value={newPosition.take_profit}
              onChange={(e) => setNewPosition({ ...newPosition, take_profit: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Save Trade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ClosePositionDialog = ({ position, refreshPositions, inrRate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [exitPrice, setExitPrice] = useState("")

  const handleClosePosition = async () => {
    const pnlUsd = calculatePnl(position, Number.parseFloat(exitPrice))
    const pnlInr = pnlUsd * inrRate

    await ForexPosition.update(position.id, {
      status: "closed",
      exit_price: Number.parseFloat(exitPrice),
      close_date: new Date().toISOString(),
      pnl_inr: pnlInr,
    })
    refreshPositions()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Close
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Position: {position.pair}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>Enter the exit price to close this position and calculate P/L.</p>
          <div className="space-y-2">
            <Label>Exit Price</Label>
            <Input type="number" value={exitPrice} onChange={(e) => setExitPrice(e.target.value)} />
          </div>
          <Button onClick={handleClosePosition} className="w-full">
            Close and Log
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function PositionTracker({ positions, inrRate, refreshPositions }) {
  const openPositions = positions.filter((p) => p.status === "open")
  const closedPositions = positions.filter((p) => p.status === "closed")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trade Journal</h2>
        <NewPositionForm refreshPositions={refreshPositions} inrRate={inrRate} />
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Size (Lots)</TableHead>
                <TableHead>Open Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openPositions.length > 0 ? (
                openPositions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold">{p.pair}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${p.type === "long" ? "text-emerald-600" : "text-red-600"}`}>
                        {p.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{p.entry_price}</TableCell>
                    <TableCell>{p.size_lots}</TableCell>
                    <TableCell>{format(new Date(p.open_date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <ClosePositionDialog position={p} refreshPositions={refreshPositions} inrRate={inrRate} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="text-center">
                    No open positions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Closed Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>P/L (INR)</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Close Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {closedPositions.length > 0 ? (
                closedPositions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold">{p.pair}</TableCell>
                    <TableCell className={`font-semibold ${p.pnl_inr >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      <div className="flex items-center gap-1">
                        {p.pnl_inr >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}₹
                        {p.pnl_inr?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </div>
                    </TableCell>
                    <TableCell>{p.entry_price}</TableCell>
                    <TableCell>{p.exit_price}</TableCell>
                    <TableCell>{format(new Date(p.close_date), "MMM dd, yyyy")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center">
                    No closed positions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
