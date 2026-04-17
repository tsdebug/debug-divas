export function calculateMetrics(data: any) {
  const liquidity = data.assets / data.liabilities;
  const profitability = data.netProfit / data.revenue;
  const leverage = data.debt / data.equity;

  return {
    liquidity,
    profitability,
    leverage,
  };
}