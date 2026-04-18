import type { FinancialData } from "@/context/financial-context";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type RiskResult = {
  level:      RiskLevel;
  zScore:     number;
  flags:      { label: string; severity: "warning" | "danger" }[];
  bankruptcy: number; // 0–100 probability estimate
};

export function assessRisk(data: FinancialData, metrics: any): RiskResult {
  const flags: RiskResult["flags"] = [];

  // ── Altman Z-Score (private firm variant) ─────────────────
  // Z = 0.717*X1 + 0.847*X2 + 3.107*X3 + 0.420*X4 + 0.998*X5
  const workingCapital = data.assets - data.liabilities;
  const X1 = workingCapital / data.assets;                        // working capital / total assets
  const X2 = data.equity / data.assets;                          // retained earnings proxy
  const X3 = data.netProfit / data.assets;                       // EBIT / total assets
  const X4 = data.equity / (data.debt || 1);                     // equity / total debt
  const X5 = data.revenue / data.assets;                         // revenue / total assets

  const zScore = parseFloat(
    (0.717*X1 + 0.847*X2 + 3.107*X3 + 0.420*X4 + 0.998*X5).toFixed(2)
  );

  // ── Danger flags ──────────────────────────────────────────
  if (metrics.liquidity < 1.0)
    flags.push({ label: "Liquidity ratio below 1 — cannot cover short-term obligations", severity: "danger" });
  else if (metrics.liquidity < 1.5)
    flags.push({ label: "Liquidity ratio is tight — monitor cash flow closely", severity: "warning" });

  if (metrics.leverage > 3)
    flags.push({ label: "Debt-to-equity exceeds 3x — highly leveraged", severity: "danger" });
  else if (metrics.leverage > 2)
    flags.push({ label: "Leverage ratio elevated — increased financial risk", severity: "warning" });

  if (metrics.profitability < 0)
    flags.push({ label: "Negative profit margin — business is loss-making", severity: "danger" });
  else if (metrics.profitability < 0.05)
    flags.push({ label: "Profit margin below 5% — very thin buffer", severity: "warning" });

  if (data.debt > data.equity)
    flags.push({ label: "Total debt exceeds equity — liabilities-heavy structure", severity: "warning" });

  if (data.liabilities > data.assets)
    flags.push({ label: "Liabilities exceed assets — technically insolvent", severity: "danger" });

  // ── Risk level from Z-Score ───────────────────────────────
  // Altman private firm: >2.9 safe, 1.23–2.9 grey, <1.23 distress
  let level: RiskLevel;
  let bankruptcy: number;

  if (zScore > 2.9) {
    level = "low";
    bankruptcy = Math.max(5, Math.round(20 - zScore * 3));
  } else if (zScore > 1.23) {
    level = flags.some(f => f.severity === "danger") ? "high" : "moderate";
    bankruptcy = Math.round(40 - zScore * 5);
  } else {
    level = flags.some(f => f.severity === "danger") ? "critical" : "high";
    bankruptcy = Math.min(95, Math.round(70 - zScore * 10));
  }

  return { level, zScore, flags, bankruptcy };
}