export function calculateMetrics(data: any) {
  const liquidity = data.assets / data.liabilities;
  const profitability = data.netProfit / data.revenue;
  const leverage = data.equity !== 0 ? data.debt / data.equity : 999;

  return {
    liquidity,
    profitability,
    leverage,
  };
}