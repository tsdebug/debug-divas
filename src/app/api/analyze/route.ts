import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { data, metrics, score } = await req.json();

    const prompt = `
You are a senior CFO analyzing an SME's financial health. 
Based on the following data, write a 3-4 sentence professional financial summary.
Be specific, use the numbers, and end with one clear priority action.

Financial Data:
- Revenue: ${data.revenue}
- Expenses: ${data.expenses}  
- Net Profit: ${data.netProfit}
- Assets: ${data.assets}
- Liabilities: ${data.liabilities}
- Equity: ${data.equity}
- Debt: ${data.debt}

Computed Metrics:
- Liquidity Ratio: ${metrics.liquidity.toFixed(2)}
- Profit Margin: ${(metrics.profitability * 100).toFixed(1)}%
- Leverage Ratio: ${metrics.leverage.toFixed(2)}
- Overall Health Score: ${score}/100

Respond in 3-4 sentences only. No bullet points. No headers. Plain paragraph.
`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return NextResponse.json({ summary: text });
    } catch (apiError: any) {
      // Fallback mock summary when API quota exceeded
      if (apiError.status === 429 || apiError.status === 404) {
        const mockSummary = `Based on your current financials, your company shows a ${(metrics.profitability * 100).toFixed(1)}% profit margin with $${data.revenue.toLocaleString()} in revenue. Your liquidity ratio of ${metrics.liquidity.toFixed(2)} indicates ${metrics.liquidity > 1.5 ? "strong short-term financial health" : "potential cash flow concerns"}. With a health score of ${score}/100, focus on ${metrics.leverage > 1 ? "reducing debt obligations" : "maintaining operational efficiency"} as your immediate priority.`;
        return NextResponse.json({ summary: mockSummary });
      }
      throw apiError;
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}