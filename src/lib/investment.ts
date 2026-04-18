import type { FinancialData } from "@/context/financial-context";

export type Verdict = "invest" | "watch" | "avoid";

export type InvestmentResult = {
  score:       number; // 0–100
  verdict:     Verdict;
  roe:         number; // return on equity %
  roa:         number; // return on assets %
  margin:      number; // net profit margin %
  assetTurn:   number; // revenue / assets
  reasons:     { label: string; positive: boolean }[];
};

export function assessInvestment(data: FinancialData, metrics: any): InvestmentResult {
  const reasons: InvestmentResult["reasons"] = [];

  const roe = data.equity > 0 ? (data.netProfit / data.equity) * 100 : 0;
  const roa = data.assets > 0 ? (data.netProfit / data.assets) * 100 : 0;
  const margin = (metrics.profitability * 100);
  const assetTurn = parseFloat((data.revenue / data.assets).toFixed(2));

  let score = 0;

  // ── ROE (weight: 25) ──────────────────────────────────────
  if (roe > 15) {
    score += 25;
    reasons.push({ label: `Strong ROE of ${roe.toFixed(1)}% — good returns on shareholder equity`, positive: true });
  } else if (roe > 8) {
    score += 15;
    reasons.push({ label: `Moderate ROE of ${roe.toFixed(1)}%`, positive: true });
  } else {
    score += 5;
    reasons.push({ label: `Low ROE of ${roe.toFixed(1)}% — weak returns on equity`, positive: false });
  }

  // ── ROA (weight: 20) ──────────────────────────────────────
  if (roa > 10) {
    score += 20;
    reasons.push({ label: `High ROA of ${roa.toFixed(1)}% — assets used efficiently`, positive: true });
  } else if (roa > 4) {
    score += 12;
    reasons.push({ label: `Acceptable ROA of ${roa.toFixed(1)}%`, positive: true });
  } else {
    score += 3;
    reasons.push({ label: `Low ROA of ${roa.toFixed(1)}% — assets underperforming`, positive: false });
  }

  // ── Profit margin (weight: 25) ────────────────────────────
  if (margin > 15) {
    score += 25;
    reasons.push({ label: `Healthy profit margin of ${margin.toFixed(1)}%`, positive: true });
  } else if (margin > 5) {
    score += 15;
    reasons.push({ label: `Acceptable margin of ${margin.toFixed(1)}%`, positive: true });
  } else if (margin > 0) {
    score += 5;
    reasons.push({ label: `Thin margin of ${margin.toFixed(1)}% — vulnerable to cost increases`, positive: false });
  } else {
    reasons.push({ label: `Negative margin — company is unprofitable`, positive: false });
  }

  // ── Liquidity (weight: 15) ────────────────────────────────
  if (metrics.liquidity > 2) {
    score += 15;
    reasons.push({ label: `Strong liquidity ratio of ${metrics.liquidity.toFixed(2)}`, positive: true });
  } else if (metrics.liquidity > 1) {
    score += 8;
    reasons.push({ label: `Adequate liquidity of ${metrics.liquidity.toFixed(2)}`, positive: true });
  } else {
    reasons.push({ label: `Liquidity below 1 — short-term solvency risk`, positive: false });
  }

  // ── Leverage (weight: 15) ─────────────────────────────────
  if (metrics.leverage < 1) {
    score += 15;
    reasons.push({ label: `Low leverage of ${metrics.leverage.toFixed(2)} — conservatively financed`, positive: true });
  } else if (metrics.leverage < 2) {
    score += 8;
    reasons.push({ label: `Moderate leverage of ${metrics.leverage.toFixed(2)}`, positive: true });
  } else {
    reasons.push({ label: `High leverage of ${metrics.leverage.toFixed(2)} — debt-heavy`, positive: false });
  }

  // ── Verdict ───────────────────────────────────────────────
  let verdict: Verdict;
  if (score >= 65)      verdict = "invest";
  else if (score >= 40) verdict = "watch";
  else                  verdict = "avoid";

  return {
    score,
    verdict,
    roe: parseFloat(roe.toFixed(2)),
    roa: parseFloat(roa.toFixed(2)),
    margin: parseFloat(margin.toFixed(2)),
    assetTurn,
    reasons,
  };
}