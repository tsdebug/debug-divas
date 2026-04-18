import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const { score, verdict, roe, roa, margin, assetTurn, metrics, reasons } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { opinion: "GEMINI_API_KEY not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const reasonsText = reasons
      .map((r: any) => `${r.positive ? "✓" : "✗"} ${r.label}`)
      .join("\n");

    const prompt = `You are a venture capital investment analyst. Provide a professional 4-sentence investment thesis for an investment committee.

Investment Metrics:
- Investment Score: ${score}/100
- Verdict: ${verdict.toUpperCase()}
- ROE: ${roe.toFixed(1)}%
- ROA: ${roa.toFixed(1)}%
- Profit Margin: ${margin.toFixed(1)}%
- Asset Turnover: ${assetTurn.toFixed(2)}x
- Liquidity: ${metrics.liquidity.toFixed(2)}
- Leverage: ${metrics.leverage.toFixed(2)}

Key Factors:
${reasonsText}

Generate EXACTLY 4 sentences:
1. Investment recommendation (INVEST/WATCH/AVOID) with confidence level
2. Primary investment drivers citing specific metrics and their implications
3. Key risks or concerns that must be addressed
4. Specific conditions or milestones for investment decision

Use professional investment language. Reference at least 3 specific numbers. Be concise and decision-focused.`;

    const getOpinion = async (retries = 2): Promise<string> => {
      try {
        const result = await genAI
          .getGenerativeModel({ model: "gemini-2.0-flash" })
          .generateContent(prompt);
        return result.response.text();
      } catch (err: any) {
        if (retries > 0 && (err.message?.includes("429") || err.message?.includes("quota"))) {
          await sleep(5000);
          return getOpinion(retries - 1);
        }
        // Fallback on any error
        return `${verdict.toUpperCase()} recommendation with score of ${score}/100. Key drivers: ROE ${roe.toFixed(1)}%, margin ${margin.toFixed(1)}%, liquidity ${metrics.liquidity.toFixed(2)}, leverage ${metrics.leverage.toFixed(2)}. Assess alignment with portfolio risk tolerance. Monitor quarterly performance metrics.`;
      }
    };

    const opinion = await getOpinion();
    return NextResponse.json({ opinion });
  } catch (err: any) {
    console.error("Investment AI route error:", err);
    return NextResponse.json(
      { opinion: `Error: ${err.message}` },
      { status: 500 }
    );
  }
}
