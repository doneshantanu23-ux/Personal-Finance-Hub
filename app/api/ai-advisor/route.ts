import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful AI financial advisor. You provide personalized financial advice, investment guidance, and help users make informed financial decisions. 

Key areas you can help with:
- Investment strategies and portfolio management
- Tax planning and optimization
- Budgeting and expense management
- Retirement planning
- Insurance recommendations
- Debt management
- Financial goal setting
- Market analysis and trends
- Risk assessment

Always provide practical, actionable advice while emphasizing the importance of consulting with qualified financial professionals for major financial decisions.`,
  })

  return result.toDataStreamResponse()
}
