export function calculateScore(metrics: any) {
  const liquidityScore = Math.min(metrics.liquidity * 40, 100);
  const profitabilityScore = Math.min(metrics.profitability * 200, 100);
  const leverageScore = Math.max(100 - metrics.leverage * 50, 0);

  const finalScore =
    liquidityScore * 0.3 +
    profitabilityScore * 0.4 +
    leverageScore * 0.3;

  return Math.round(finalScore);
}