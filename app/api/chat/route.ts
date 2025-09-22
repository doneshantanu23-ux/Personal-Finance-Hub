import { streamText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, response_json_schema, add_context_from_internet, ...options } = body

    const systemPrompt = `You are a helpful AI financial advisor. You provide personalized financial advice, investment guidance, and help users make informed financial decisions. 

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

Always provide practical, actionable advice while emphasizing the importance of consulting with qualified financial professionals for major financial decisions.

${add_context_from_internet ? "Use current market data and recent financial news when providing advice." : ""}
${response_json_schema ? "Respond with valid JSON that matches the requested schema." : ""}`

    if (response_json_schema) {
      // Convert JSON schema to Zod schema for structured output
      const zodSchema = convertJsonSchemaToZod(response_json_schema)

      const result = await generateObject({
        model: openai("gpt-4o"),
        messages,
        system: systemPrompt,
        schema: zodSchema,
        ...options,
      })

      return Response.json(result.object)
    } else {
      // For regular chat, use streaming
      const result = streamText({
        model: openai("gpt-4o"),
        messages,
        system: systemPrompt,
        ...options,
      })

      return result.toDataStreamResponse()
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to process request", details: error.message }, { status: 500 })
  }
}

function convertJsonSchemaToZod(jsonSchema: any): z.ZodSchema {
  // For complex schemas, create a flexible object schema
  // This handles the real estate data structures
  if (jsonSchema.type === "object" && jsonSchema.properties) {
    const shape: Record<string, z.ZodSchema> = {}

    for (const [key, value] of Object.entries(jsonSchema.properties)) {
      const prop = value as any
      if (prop.type === "array") {
        if (prop.items?.type === "object") {
          // Handle array of objects
          shape[key] = z.array(z.record(z.any())).optional()
        } else {
          shape[key] = z.array(z.string()).optional()
        }
      } else if (prop.type === "object") {
        shape[key] = z.record(z.any()).optional()
      } else if (prop.type === "string") {
        shape[key] = z.string().optional()
      } else if (prop.type === "number") {
        shape[key] = z.number().optional()
      } else {
        shape[key] = z.any().optional()
      }
    }

    return z.object(shape)
  }

  // Fallback for simple schemas
  return z.record(z.any())
}
