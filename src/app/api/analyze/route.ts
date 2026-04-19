import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const { data, metrics, score } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { summary: "GEMINI_API_KEY not configured.", ml: null },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `Analyze this SME for a bank credit committee in exactly 4 sentences.

Data: Revenue ${data.revenue.toLocaleString()}, Expenses ${data.expenses.toLocaleString()}, Net Profit ${data.netProfit.toLocaleString()}, Assets ${data.assets.toLocaleString()}, Liabilities ${data.liabilities.toLocaleString()}, Equity ${data.equity.toLocaleString()}, Debt ${data.debt.toLocaleString()}, Liquidity ${metrics.liquidity.toFixed(2)}, Profit Margin ${(metrics.profitability * 100).toFixed(1)}%, Leverage ${metrics.leverage.toFixed(2)}, Health Score ${score}/100.

Sentence 1: State the health score and overall creditworthiness verdict.
Sentence 2: Identify the single strongest metric with its exact value and lending implication.
Sentence 3: Identify the single biggest risk with its exact value and consequence.
Sentence 4: One specific action required before credit approval.

Rules: formal banking language, no bullet points, reference at least 3 numbers, never say "your company", flag liquidity above 10 as abnormally high.`;

    const getGeminiSummary = async (retries = 2): Promise<string> => {
      try {
        const result = await genAI
          .getGenerativeModel({ model: "gemini-2.0-flash" })
          .generateContent(prompt);
        return result.response.text();
      } catch (err: any) {
        if (retries > 0 && (err.message?.includes("429") || err.message?.includes("quota"))) {
          await sleep(5000);
          return getGeminiSummary(retries - 1);
        }
        // Fallback on any error (quota exceeded, model not found, etc)
        return `Based on financial data: Revenue $${data.revenue.toLocaleString()}, Net Profit $${data.netProfit.toLocaleString()}, Health Score ${score}/100. Liquidity ratio of ${metrics.liquidity.toFixed(2)} indicates ${metrics.liquidity > 2 ? "strong" : metrics.liquidity > 1 ? "adequate" : "weak"} short-term solvency. Leverage of ${metrics.leverage.toFixed(2)} shows ${metrics.leverage < 1 ? "conservative" : "elevated"} financial risk. Immediate action: ${metrics.leverage > 1.5 ? "reduce debt obligations" : "maintain operational efficiency"}.`;
      }
    };

    const [geminiResult, mlResult] = await Promise.allSettled([
      getGeminiSummary(),

      fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000"}/predict`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profitability:    metrics.profitability,
          liquidity:        metrics.liquidity,
          leverage:         metrics.leverage,
          roa:              data.netProfit / data.assets,
          operating_margin: (data.revenue - data.expenses) / data.revenue,
          score:            score,
        }),
      }).then((r) => r.json()),
    ]);

    const summary =
      geminiResult.status === "fulfilled"
        ? geminiResult.value
        : `Gemini error: ${geminiResult.reason}`;

    const ml =
      mlResult.status === "fulfilled"
        ? mlResult.value
        : null;

    return NextResponse.json({ summary, ml });

  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json(
      { summary: `Error: ${err.message}`, ml: null },
      { status: 500 }
    );
  }
}