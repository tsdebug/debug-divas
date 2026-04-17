export function getInsights(metrics: any) {
    const insights = [];

    // Profitability
    if (metrics.profitability > 0.25) {
        insights.push({
            label: "High profit margin indicates strong operational efficiency",
            type: "positive",
        });
    } else if (metrics.profitability > 0.1) {
        insights.push({
            label: "Moderate profitability, room for margin improvement",
            type: "neutral",
        });
    } else {
        insights.push({
            label: "Low profitability may impact long-term sustainability",
            type: "negative",
        });
    }

    // Liquidity
    if (metrics.liquidity > 2) {
        insights.push({
            label: "Strong liquidity ensures short-term obligations are covered",
            type: "positive",
        });
    } else if (metrics.liquidity > 1) {
        insights.push({
            label: "Adequate liquidity but could be optimized",
            type: "neutral",
        });
    } else {
        insights.push({
            label: "Low liquidity indicates potential cash flow risk",
            type: "negative",
        });
    }

    // Leverage
    if (metrics.leverage < 0.5) {
        insights.push({
            label: "Low debt levels reduce financial risk",
            type: "positive",
        });
    } else if (metrics.leverage < 1) {
        insights.push({
            label: "Moderate debt levels, monitor closely",
            type: "neutral",
        });
    } else {
        insights.push({
            label: "High leverage increases financial vulnerability",
            type: "negative",
        });
    }

    return insights;
}