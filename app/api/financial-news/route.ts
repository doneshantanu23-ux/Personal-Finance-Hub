export async function GET() {
  try {
    // Using the new API key provided
    const apiKey = "GgtzU5I4EaYKVAlZDZbSRKtCvT4mACBy"
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=finance OR stocks OR economy OR market&sortBy=publishedAt&apiKey=${apiKey}&pageSize=20`,
    )

    const data = await response.json()

    if (data.articles) {
      const articles = data.articles.map((article: any, index: number) => ({
        id: index.toString(),
        title: article.title,
        description: article.description || "",
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
        category: categorizeArticle(article.title + " " + article.description),
        image: article.urlToImage,
      }))

      return Response.json({ articles })
    } else {
      return generateMockNewsResponse()
    }
  } catch (error) {
    console.error("News API error:", error)
    return generateMockNewsResponse()
  }
}

function categorizeArticle(text: string): string {
  const lowerText = text.toLowerCase()

  if (lowerText.includes("bitcoin") || lowerText.includes("crypto") || lowerText.includes("ethereum")) {
    return "crypto"
  } else if (lowerText.includes("stock") || lowerText.includes("share") || lowerText.includes("equity")) {
    return "stocks"
  } else if (lowerText.includes("earnings") || lowerText.includes("revenue") || lowerText.includes("profit")) {
    return "earnings"
  } else if (lowerText.includes("fed") || lowerText.includes("inflation") || lowerText.includes("gdp")) {
    return "economy"
  } else if (lowerText.includes("market") || lowerText.includes("trading") || lowerText.includes("index")) {
    return "markets"
  }

  return "markets"
}

function generateMockNewsResponse() {
  const mockArticles = [
    {
      id: "1",
      title: "Federal Reserve Signals Potential Rate Cuts in 2024",
      description:
        "The Federal Reserve hints at possible interest rate reductions as inflation shows signs of cooling.",
      url: "#",
      source: "Financial Times",
      publishedAt: new Date().toISOString(),
      category: "economy",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Tech Stocks Rally on AI Breakthrough Announcements",
      description: "Major technology companies see significant gains following AI announcements.",
      url: "#",
      source: "MarketWatch",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      category: "stocks",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return Response.json({ articles: mockArticles })
}
