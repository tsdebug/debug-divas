export function getSuggestions(data: any, metrics: any) {
    const suggestions = [];

    // Profitability
    if (metrics.profitability < 0.2) {
        suggestions.push(
            "Improve profitability by reducing operational costs or increasing pricing efficiency."
        );
    }

    // Liquidity
    if (metrics.liquidity < 1.5) {
        suggestions.push(
            "Increase liquidity by improving cash reserves or reducing short-term liabilities."
        );
    }

    // Leverage
    if (metrics.leverage > 0.6) {
        suggestions.push(
            "Reduce debt levels to lower financial risk and improve stability."
        );
    }

    // Strong case (nice touch)
    if (suggestions.length === 0) {
        suggestions.push(
            "Financials look strong. Focus on scaling operations while maintaining efficiency."
        );
    }

    return suggestions;
}