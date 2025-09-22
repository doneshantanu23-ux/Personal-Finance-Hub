export async function InvokeLLM(params: { prompt: string; [key: string]: any }) {
  try {
    const { prompt, ...options } = params
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.content || data.message || "No response received"
  } catch (error) {
    console.error("Error invoking LLM:", error)
    throw error
  }
}

export default {
  InvokeLLM,
}
