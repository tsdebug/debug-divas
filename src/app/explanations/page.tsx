import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExplanationsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Score Explanations</h1>
        <p className="text-muted-foreground mt-2">
          Understand how our AI-powered scoring system works and the methodologies behind each metric.
        </p>
      </div>

      <Tabs defaultValue="zscore" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zscore">Altman Z-Score</TabsTrigger>
          <TabsTrigger value="investment">Investment Score</TabsTrigger>
          <TabsTrigger value="ml">ML Model</TabsTrigger>
        </TabsList>

        <TabsContent value="zscore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Altman Z-Score Methodology</CardTitle>
              <CardDescription>
                Bankruptcy prediction model using five key financial ratios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="font-mono text-sm mb-2">
                  Z = 1.2X₁ + 1.4X₂ + 3.3X₃ + 0.6X₄ + 1.0X₅
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <Badge className="mb-1">X₁</Badge>
                    <p><strong>Working Capital / Total Assets</strong> - Measures short-term liquidity</p>
                  </div>
                  <div>
                    <Badge className="mb-1">X₂</Badge>
                    <p><strong>Retained Earnings / Total Assets</strong> - Indicates profitability history</p>
                  </div>
                  <div>
                    <Badge className="mb-1">X₃</Badge>
                    <p><strong>EBIT / Total Assets</strong> - Operating efficiency (most important)</p>
                  </div>
                  <div>
                    <Badge className="mb-1">X₄</Badge>
                    <p><strong>Market Value of Equity / Total Liabilities</strong> - Financial leverage</p>
                  </div>
                  <div>
                    <Badge className="mb-1">X₅</Badge>
                    <p><strong>Sales / Total Assets</strong> - Asset utilization efficiency</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Risk Classification</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950 rounded">
                    <span>Z &lt; 1.81</span>
                    <Badge variant="destructive">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                    <span>1.81 ≤ Z ≤ 2.99</span>
                    <Badge variant="secondary">Medium Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded">
                    <span>Z &gt; 2.99</span>
                    <Badge variant="default">Low Risk</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <strong>Note:</strong> Originally developed by Edward Altman in 1968 for manufacturing companies. This implementation is adapted for SME analysis with adjusted thresholds.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Attractiveness Score</CardTitle>
              <CardDescription>
                5-factor model evaluating investment potential
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📊</span> Profitability (25%)
                  </h3>
                  <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                    <p><strong>ROE (Return on Equity)</strong> - Profit generated per dollar of shareholder equity</p>
                    <p className="text-xs">Higher ROE indicates better capital efficiency</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">💰</span> Asset Quality (20%)
                  </h3>
                  <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                    <p><strong>ROA (Return on Assets)</strong> - How effectively company uses its assets</p>
                    <p className="text-xs">Measures operational efficiency and asset utilization</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">📈</span> Margin Analysis (20%)
                  </h3>
                  <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Net Profit Margin</strong> - Percentage of revenue that becomes profit</p>
                    <p className="text-xs">Indicates pricing power and cost control</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚙️</span> Efficiency (20%)
                  </h3>
                  <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Asset Turnover</strong> - Revenue generated per dollar of assets</p>
                    <p className="text-xs">Measures how productive the asset base is</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span> Financial Health (15%)
                  </h3>
                  <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                    <p><strong>Debt Ratio</strong> - Proportion of debt vs. equity</p>
                    <p className="text-xs">Lower ratios indicate reduced financial risk</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <strong>Final Score:</strong> Weighted combination of all factors, normalized to 0-100 scale. Higher scores indicate better investment potential.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machine Learning Model</CardTitle>
              <CardDescription>
                Random Forest classifier for bankruptcy prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Model Architecture</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
                    <p className="text-sm"><strong>Algorithm:</strong> Random Forest Classifier</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
                    <p className="text-sm"><strong>Number of Trees:</strong> 200 decision trees</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
                    <p className="text-sm"><strong>Training Data:</strong> 6,819 companies from Chinese bankruptcy dataset</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded">
                    <p className="text-sm"><strong>Features:</strong> 10 key financial metrics (selected from 96 original features)</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Model Performance</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded">
                    <span className="text-sm">Overall Accuracy</span>
                    <Badge>94.43%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <span className="text-sm">Precision (Healthy Companies)</span>
                    <Badge>98%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded">
                    <span className="text-sm">Recall (Bankrupt Detection)</span>
                    <Badge>52%</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Top 5 Most Important Features</h3>
                <div className="space-y-2">
                  {[
                    { name: "Retained Earnings Ratio", importance: 20.5 },
                    { name: "Net Income Ratio", importance: 17.5 },
                    { name: "Net Worth Ratio", importance: 16.2 },
                    { name: "Debt Ratio", importance: 14.8 },
                    { name: "Return on Assets", importance: 9.6 },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="flex-1">{i + 1}. {feature.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${feature.importance * 5}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12">{feature.importance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  <strong>How It Works:</strong> The model ensembles multiple decision trees, each trained on random subsets of data. Predictions are made by averaging results across all trees, reducing overfitting and improving generalization.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Combined Approach</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            FinHealth AI combines <strong>traditional financial analysis</strong> with <strong>machine learning</strong> for robust risk assessment:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Altman Z-Score:</strong> Provides interpretable, theory-backed bankruptcy risk assessment</li>
            <li><strong>Investment Score:</strong> Evaluates growth and profitability potential for VC/PE investors</li>
            <li><strong>ML Model:</strong> Captures complex patterns in financial data for enhanced predictions</li>
            <li><strong>AI Explanations:</strong> Google Gemini generates human-readable insights for each analysis</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
