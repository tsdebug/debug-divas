import { assessRisk } from "./risk";
import { assessInvestment } from "./investment";

export function calculateMetrics(data: any) {
  const liquidity = data.assets / data.liabilities;
  const profitability = data.netProfit / data.revenue;
  const leverage = data.equity !== 0 ? data.debt / data.equity : 999;

  // Calculate risk metrics including Z-Score
  const basicMetrics = { liquidity, profitability, leverage };
  const riskResult = assessRisk(data, basicMetrics);
  const investmentResult = assessInvestment(data, basicMetrics);

  return {
    liquidity,
    profitability,
    leverage,
    zScore: riskResult.zScore,
    investmentScore: investmentResult.score,
    riskLevel: riskResult.level,
    bankruptcy: riskResult.bankruptcy,
  };
}