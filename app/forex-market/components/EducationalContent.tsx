import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookCopy, HelpCircle, ShieldCheck, Scale, BarChart, AlertTriangle } from "lucide-react"

const educationalTopics = [
  {
    title: "What is Forex Trading?",
    icon: BookCopy,
    content: `Forex, short for foreign exchange, is the global market where currencies are traded. It's the largest financial market in the world. When you trade forex, you are always buying one currency while simultaneously selling another. For example, in the EUR/USD pair, if you 'buy' or go 'long', you are betting that the Euro will increase in value relative to the US Dollar.`,
  },
  {
    title: "Understanding Leverage",
    icon: BarChart,
    content: `Leverage allows you to control a large position with a small amount of capital. For example, with 100:1 leverage, you can control a $100,000 position with just $1,000. While it can magnify profits, it can also magnify losses just as quickly. It's a powerful tool that must be used with extreme caution. High leverage is a primary reason many new traders lose money.`,
  },
  {
    title: "Key Terminology: Pips, Lots, and Spreads",
    icon: HelpCircle,
    content: `*   **Pip (Percentage in Point):** The smallest price move that a given exchange rate can make. For most pairs, it's the fourth decimal place (e.g., 0.0001).
*   **Lot:** The size of your trade. A standard lot is 100,000 units of the base currency. A mini lot is 10,000 units, and a micro lot is 1,000 units.
*   **Spread:** The difference between the buy (ask) and sell (bid) price of a currency pair. This is essentially the broker's commission for the trade.`,
  },
  {
    title: "Legal Forex Trading in India",
    icon: ShieldCheck,
    content: `In India, forex trading is legal but heavily regulated by the Reserve Bank of India (RBI) and the Securities and Exchange Board of India (SEBI).
*   **Allowed:** You can trade currency pairs that include the Indian Rupee (INR), like USD/INR, EUR/INR, GBP/INR, and JPY/INR, on SEBI-regulated exchanges (like NSE, BSE).
*   **Not Allowed (Illegal):** Trading non-INR pairs (like EUR/USD, GBP/JPY) or using international, unregulated brokers for leveraged forex trading is illegal for resident Indians and violates the FEMA (Foreign Exchange Management Act).
*   **Platforms:** Use only SEBI-registered brokers like Zerodha, Upstox, etc., that offer currency derivatives on Indian exchanges.`,
  },
  {
    title: "How to Start Trading (The Right Way)",
    icon: Scale,
    content: `1.  **Education:** Learn everything you can. Understand the market, technical analysis, fundamental analysis, and trading psychology.
2.  **Trading Plan:** Create a detailed plan with rules for entry, exit, risk management, and position sizing.
3.  **Risk Management:** Never risk more than 1-2% of your trading capital on a single trade. Always use a Stop Loss order to define your maximum acceptable loss.
4.  **Demo Trading:** Practice on a demo account with virtual money until you are consistently profitable for a few months.
5.  **Live Trading:** Start with a small amount of real money on a regulated Indian platform.`,
  },
  {
    title: "The Importance of Risk Management",
    icon: AlertTriangle,
    content: `Risk management is the single most important factor for survival in forex trading. It involves:
*   **Stop Loss:** An order placed to close a trade automatically when it reaches a certain loss level.
*   **Take Profit:** An order to close a trade automatically when it reaches a certain profit level.
*   **Position Sizing:** Calculating the correct lot size based on your stop loss distance and the percentage of your account you're willing to risk.
*   **Risk-to-Reward Ratio:** Ensuring your potential profit on a trade is significantly higher than your potential loss (e.g., 1:2 or 1:3).`,
  },
]

export default function EducationalContent() {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookCopy className="w-6 h-6 text-indigo-600" />
          Forex Trading Knowledge Base
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-slate-600">
          Understanding the fundamentals is crucial for success in the forex market. Use this guide to learn key
          concepts.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {educationalTopics.map((topic, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <topic.icon className="w-5 h-5 text-indigo-500" />
                  {topic.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose max-w-none text-slate-700 px-4 py-2">
                <p dangerouslySetInnerHTML={{ __html: topic.content.replace(/\*/g, "•").replace(/\n/g, "<br/>") }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
