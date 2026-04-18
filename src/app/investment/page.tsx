"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useFinancial } from "@/context/financial-context";
import { calculateMetrics } from "@/lib/calculations";
import { assessInvestment } from "@/lib/investment";
import {
  TrendingUp,
  Target,
  PieChart,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lightbulb,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function InvestmentPage() {
  const { data, metrics } = useFinancial();
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (data && metrics) {
      generateInvestmentOpinion();
    }
  }, [data, metrics]);

  const generateInvestmentOpinion = async () => {
    if (!data || !metrics) return;
    
    const investment = assessInvestment(data, metrics);
    setAiLoading(true);
    
    try {
      const response = await fetch("/api/investment-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: investment.score,
          verdict: investment.verdict,
          roe: investment.roe,
          roa: investment.roa,
          margin: investment.margin,
          assetTurn: investment.assetTurn,
          metrics,
          reasons: investment.reasons,
        }),
      });
      
      const result = await response.json();
      setAiOpinion(result.opinion || null);
    } catch (err) {
      console.error("Failed to generate investment opinion:", err);
      setAiOpinion(null);
    } finally {
      setAiLoading(false);
    }
  };

  if (!data || !metrics) {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-background">
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4">
            <p className="text-xl font-medium">No data uploaded yet</p>
            <p className="text-muted-foreground">
              Upload a CSV file to see investment analysis
            </p>
            <Button asChild>
              <Link href="/upload">Upload Data</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const investment = assessInvestment(data, metrics);

  const getVerdictColor = () => {
    switch (investment.verdict) {
      case "invest":
        return "bg-green-500";
      case "watch":
        return "bg-blue-500";
      case "avoid":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getVerdictBgColor = () => {
    switch (investment.verdict) {
      case "invest":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "watch":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800";
      case "avoid":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getVerdictTextColor = () => {
    switch (investment.verdict) {
      case "invest":
        return "text-green-700 dark:text-green-300";
      case "watch":
        return "text-blue-700 dark:text-blue-300";
      case "avoid":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-gray-700";
    }
  };

  const verdictLabel = {
    invest: "INVEST",
    watch: "WATCH",
    avoid: "AVOID",
  }[investment.verdict];

  const verdictDescription = {
    invest: "Strong investment opportunity with favorable returns and manageable risk",
    watch: "Monitor closely — company has potential but needs attention to key metrics",
    avoid: "High risk relative to potential returns — not recommended at this time",
  }[investment.verdict];

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />

        <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
          <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-semibold">Investment Analysis</h1>
                <p className="text-muted-foreground">
                  Risk-adjusted investment opportunity assessment
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>

            {/* INVESTMENT VERDICT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`p-6 flex flex-col items-center space-y-3 border ${getVerdictBgColor()}`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-2xl font-bold ${getVerdictColor()}`}>
                  {verdictLabel}
                </div>
                <p className={`font-semibold text-lg ${getVerdictTextColor()}`}>
                  Investment Verdict
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  {verdictDescription}
                </p>
              </Card>

              <Card className="p-6 flex flex-col justify-between">
                <div>
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Investment Score
                  </p>
                  <p className="text-4xl font-bold mb-2">{investment.score}/100</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Overall risk-adjusted opportunity rating
                  </p>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>✓ 65+: INVEST (Strong Opportunity)</p>
                  <p>⚠ 40–64: WATCH (Monitor)</p>
                  <p>✗ &lt; 40: AVOID (High Risk)</p>
                </div>
              </Card>
            </div>

            {/* AI INVESTMENT OPINION */}
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                AI Investment Thesis
              </h2>
              
              {aiLoading ? (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Generating investment thesis with AI...
                </p>
              ) : aiOpinion ? (
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {aiOpinion}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Unable to generate AI thesis. Review metrics and factors below.
                </p>
              )}
            </Card>

            {/* ROE, ROA, MARGIN, ASSET TURNOVER */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Return on Equity
                </p>
                <p className="text-3xl font-bold">{investment.roe.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {investment.roe > 15
                    ? "Excellent"
                    : investment.roe > 8
                    ? "Good"
                    : "Below Average"}
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Return on Assets
                </p>
                <p className="text-3xl font-bold">{investment.roa.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {investment.roa > 10
                    ? "Strong"
                    : investment.roa > 4
                    ? "Acceptable"
                    : "Weak"}
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <PieChart className="w-3 h-3" />
                  Profit Margin
                </p>
                <p className="text-3xl font-bold">{investment.margin.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {investment.margin > 15
                    ? "Healthy"
                    : investment.margin > 5
                    ? "Acceptable"
                    : "Thin"}
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Asset Turnover
                </p>
                <p className="text-3xl font-bold">{investment.assetTurn.toFixed(2)}x</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Revenue per $ of assets
                </p>
              </Card>
            </div>

            {/* INVESTMENT REASONS */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Investment Analysis & Reasons
              </h2>

              <div className="space-y-3">
                {investment.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-start gap-3 ${
                      reason.positive
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {reason.positive ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">
                      {reason.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* SCORING BREAKDOWN */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Scoring Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Return on Equity (ROE)</span>
                    <span className="text-sm font-semibold">
                      {investment.roe > 15
                        ? "25/25"
                        : investment.roe > 8
                        ? "15/25"
                        : "5/25"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          (
                            (investment.roe > 15 ? 25 : investment.roe > 8 ? 15 : 5) /
                            25
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Return on Assets (ROA)</span>
                    <span className="text-sm font-semibold">
                      {investment.roa > 10
                        ? "20/20"
                        : investment.roa > 4
                        ? "12/20"
                        : "3/20"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${
                          (
                            (investment.roa > 10 ? 20 : investment.roa > 4 ? 12 : 3) /
                            20
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-semibold">
                      {investment.margin > 15
                        ? "25/25"
                        : investment.margin > 5
                        ? "15/25"
                        : investment.margin > 0
                        ? "5/25"
                        : "0/25"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          (
                            (investment.margin > 15
                              ? 25
                              : investment.margin > 5
                              ? 15
                              : investment.margin > 0
                              ? 5
                              : 0) / 25
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Liquidity</span>
                    <span className="text-sm font-semibold">
                      {metrics.liquidity > 2
                        ? "15/15"
                        : metrics.liquidity > 1
                        ? "8/15"
                        : "0/15"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{
                        width: `${
                          (
                            (metrics.liquidity > 2
                              ? 15
                              : metrics.liquidity > 1
                              ? 8
                              : 0) / 15
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Leverage</span>
                    <span className="text-sm font-semibold">
                      {metrics.leverage < 1
                        ? "15/15"
                        : metrics.leverage < 2
                        ? "8/15"
                        : "0/15"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${
                          (
                            (metrics.leverage < 1
                              ? 15
                              : metrics.leverage < 2
                              ? 8
                              : 0) / 15
                          ) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* INVESTMENT RECOMMENDATIONS */}
            <Card className="p-6 bg-muted/50">
              <h2 className="text-lg font-semibold mb-4">Investment Recommendation</h2>
              <div className="space-y-3 text-sm">
                {investment.verdict === "invest" && (
                  <div>
                    <p className="font-medium text-green-600">✓ INVEST</p>
                    <p className="text-muted-foreground mt-1">
                      This company presents a strong investment opportunity. Financial
                      metrics are healthy, returns on equity and assets are solid, and
                      leverage is manageable. Consider this as a favorable investment
                      candidate.
                    </p>
                  </div>
                )}

                {investment.verdict === "watch" && (
                  <div>
                    <p className="font-medium text-blue-600">⚠ WATCH</p>
                    <p className="text-muted-foreground mt-1">
                      This company has potential but requires closer monitoring. While
                      some metrics are positive, there are areas of concern. Consider
                      investing after improvements in key areas or gaining additional
                      information.
                    </p>
                  </div>
                )}

                {investment.verdict === "avoid" && (
                  <div>
                    <p className="font-medium text-red-600">✗ AVOID</p>
                    <p className="text-muted-foreground mt-1">
                      This company currently presents higher risk relative to potential
                      returns. Significant concerns exist around profitability, liquidity,
                      or leverage. Recommend waiting for financial improvements before
                      considering investment.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
