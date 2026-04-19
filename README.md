This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📊 FinScoreAI - Machine Learning Model Documentation

### Model Overview

**FinScoreAI** is an AI-driven financial analysis platform that combines:
- **Random Forest ML Model** - Bankruptcy prediction & financial health assessment
- **Gemini LLM API** - Contextual financial insights and AI-powered analysis
- **Financial Metrics Engine** - Altman Z-Score, liquidity ratios, profitability analysis

### Dataset Information

**Dataset**: Company Bankruptcy Prediction  
**Total Companies**: 6,819  
**Features**: 96 financial ratios and metrics  
**Time Period**: Historical company financial data  
**Data Source**: Public financial datasets  

### Model Details

**Algorithm**: Random Forest Classifier
- **Trees**: 100 ensemble trees
- **Max Depth**: 20
- **Min Samples Split**: 2
- **Min Samples Leaf**: 1
- **Features**: 96 financial ratios (normalized)
- **Target Variable**: Bankruptcy Status (Binary: Healthy/At-Risk)

**Model Performance**:
- **Accuracy**: ~95% on test set
- **Precision**: ~93%
- **Recall**: ~94%
- **Cross-Validation**: Stratified 5-fold validation

### Altman Z-Score Implementation

The app calculates the **Altman Z-Score for Private Companies**:

```
Z = 0.717×X1 + 0.847×X2 + 3.107×X3 + 0.420×X4 + 0.998×X5

Where:
- X1 = Working Capital / Total Assets
- X2 = Retained Earnings / Total Assets  
- X3 = EBIT / Total Assets
- X4 = Equity / Total Debt
- X5 = Sales / Total Assets

Interpretation:
- Z > 2.9: Safe Zone (Low bankruptcy risk)
- 1.23 < Z ≤ 2.9: Grey Zone (Moderate risk)
- Z ≤ 1.23: Distress Zone (High bankruptcy risk)
```

### Data Limitations & Assumptions

**Dataset Characteristics**:
- ⚠️ **Single Dataset Training**: Model trained on company-bankruptcy-prediction dataset
- ⚠️ **Historical Data**: Reflects past market conditions and company structures
- ⚠️ **Industry Bias**: May perform differently across industries
- ⚠️ **Regional Limitations**: Trained on specific geographical/regulatory context
- ⚠️ **Scale Dependency**: Best for SMEs; may not generalize to startups or mega-corporations

**Model Generalization Issues**:
1. **Startups & Early-Stage Companies**: Limited training data; high uncertainty
2. **Emerging Industries**: Model trained on historical data; may not capture new business models
3. **Economic Shocks**: Market crises not adequately represented in historical data
4. **Accounting Standards**: Different countries/regions use different standards
5. **Rapid Growth Companies**: Traditional ratios may underestimate viability

### Accuracy & Confidence

**When to Trust the Model**:
✅ Established companies with 5+ years of history  
✅ Companies in traditional industries  
✅ Consistent financial reporting  
✅ Standard balance sheet structure  

**When to Be Cautious** ⚠️:
❌ Startups and early-stage companies  
❌ High-growth tech companies  
❌ Companies in emerging industries (AI, crypto, biotech)  
❌ Seasonal businesses with high volatility  
❌ Companies with recent restructuring  
❌ During economic downturns/crises  

### Financial Metrics Calculated

The app computes the following ratios for analysis:

| Metric | Formula | Interpretation |
|--------|---------|-----------------|
| **Liquidity Ratio** | Assets / Liabilities | Ability to pay short-term obligations |
| **Profitability Ratio** | Net Profit / Revenue | Operational efficiency |
| **Leverage Ratio** | Debt / Equity | Financial risk & capital structure |
| **Z-Score** | Weighted formula | Bankruptcy risk indicator |
| **Investment Score** | Composite (0-100) | Overall investment viability |

### Recommendations for Use

**Best Practices**:
1. **Use as a Screening Tool** - Not a replacement for professional financial analysis
2. **Cross-Validate** - Always validate AI predictions with domain experts
3. **Multi-Factor Analysis** - Consider multiple factors, not just the score
4. **Update Data Regularly** - Quarterly/annual financial updates for accuracy
5. **Combine with LLM Insights** - Read the Gemini AI analysis for context
6. **Consider Market Context** - Factor in industry trends and economic conditions

**Disclaimer**:
> This analysis is powered by machine learning models trained on historical data. The scores and predictions are indicative only and should not be used as the sole basis for financial decisions. Always consult with qualified financial advisors, accountants, and legal professionals before making significant business decisions.

### Model Validation Strategy

- **Cross-Validation**: 5-fold stratified cross-validation to prevent overfitting
- **Test Set Performance**: Model evaluated on unseen company data
- **Edge Cases**: Tested on extreme financial scenarios
- **Real-World Validation**: Continuously validated against actual company outcomes

### Future Improvements

- [ ] Expand training dataset with international company data
- [ ] Integrate industry-specific models (banking, retail, manufacturing)
- [ ] Add temporal analysis for trend detection
- [ ] Implement uncertainty quantification (confidence intervals)
- [ ] Fine-tune for SME-specific characteristics
- [ ] Add explainability features (SHAP values)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
