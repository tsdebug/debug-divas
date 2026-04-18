import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const { zScore, bankruptcy, flags, metrics, data } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { analysis: "GEMINI_API_KEY not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const flagsText = flags
      .map((f: any) => `${f.severity === "danger" ? "CRITICAL" : "WARNING"}: ${f.label}`)
      .join("\n");

    const prompt = `You are a financial risk analyst. Provide a professional 3-sentence risk assessment for a bank credit committee.

Risk Data:
- Altman Z-Score: ${zScore} (>2.9 safe, 1.23-2.9 grey, <1.23 distress)
- Bankruptcy Probability: ${bankruptcy}%
- Liquidity Ratio: ${metrics.liquidity.toFixed(2)}
- Leverage Ratio: ${metrics.leverage.toFixed(2)}
- Profitability: ${(metrics.profitability * 100).toFixed(1)}%
- Debt-to-Assets: ${((data.debt / data.assets) * 100).toFixed(1)}%
${flagsText ? `- Risk Flags:\n${flagsText}` : ""}

Generate EXACTLY 3 sentences:
1. Overall risk assessment and bankruptcy probability interpretation
2. Specific factors driving the risk level (cite exact metrics)
3. Key actions needed to improve financial stability

Use formal banking language. Reference at least 2 specific numbers. Be direct and actionable.`;

    const getAnalysis = async (retries = 2): Promise<string> => {
      try {
        const result = await genAI
          .getGenerativeModel({ model: "gemini-2.0-flash" })
          .generateContent(prompt);
        return result.response.text();
      } catch (err: any) {
        if (retries > 0 && (err.message?.includes("429") || err.message?.includes("quota"))) {
          await sleep(5000);
          return getAnalysis(retries - 1);
        }
        // Fallback on any error
        return `Based on Z-Score of ${zScore}, this company shows ${
          zScore > 2.9
            ? "low bankruptcy risk"
            : zScore > 1.23
            ? "moderate financial stress"
            : "critical distress signals"
        } with ${bankruptcy}% bankruptcy probability. Key metrics: liquidity ${metrics.liquidity.toFixed(2)}, leverage ${metrics.leverage.toFixed(2)}, profitability ${(metrics.profitability * 100).toFixed(1)}%. Priority: ${
          flags.length > 0 ? "address identified risk flags immediately" : "maintain current financial discipline"
        }.`;
      }
    };

    const analysis = await getAnalysis();
    return NextResponse.json({ analysis });
  } catch (err: any) {
    console.error("Risk AI route error:", err);
    return NextResponse.json(
      { analysis: `Error: ${err.message}` },
      { status: 500 }
    );
  }
}
