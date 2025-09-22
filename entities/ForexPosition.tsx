export class ForexPosition {
  id: string
  pair: string
  type: "buy" | "sell"
  amount: number
  openPrice: number
  currentPrice: number
  openTime: Date
  status: "open" | "closed"
  profit?: number
  loss?: number

  constructor(data: any) {
    this.id = data.id || Date.now().toString()
    this.pair = data.pair
    this.type = data.type
    this.amount = data.amount
    this.openPrice = data.openPrice
    this.currentPrice = data.currentPrice || data.openPrice
    this.openTime = new Date(data.openTime || Date.now())
    this.status = data.status || "open"
    this.profit = data.profit
    this.loss = data.loss
  }

  static async create(data: any): Promise<ForexPosition> {
    const position = new ForexPosition(data)
    // In a real app, this would save to a database
    return position
  }

  static async list(orderBy?: string, limit?: number): Promise<ForexPosition[]> {
    // In a real app, this would fetch from a database
    return []
  }

  static async findById(id: string): Promise<ForexPosition | null> {
    // In a real app, this would fetch from a database
    return null
  }

  async update(data: any): Promise<ForexPosition> {
    Object.assign(this, data)
    // In a real app, this would update the database
    return this
  }

  async delete(): Promise<void> {
    // In a real app, this would delete from the database
  }

  calculatePnL(): number {
    const priceDiff = this.type === "buy" ? this.currentPrice - this.openPrice : this.openPrice - this.currentPrice
    return priceDiff * this.amount
  }
}

export default ForexPosition
