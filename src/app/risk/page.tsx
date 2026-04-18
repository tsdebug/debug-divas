"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useFinancial } from "@/context/financial-context";
import { calculateMetrics } from "@/lib/calculations";
import { assessRisk } from "@/lib/risk";
import { AlertCircle, TrendingDown, Activity, Shield, Zap } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RiskPage() {
  const { data, metrics } = useFinancial();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (data && metrics) {
      generateRiskAnalysis();
    }
  }, [data, metrics]);

  const generateRiskAnalysis = async () => {
    if (!data || !metrics) return;
    
    const risk = assessRisk(data, metrics);
    setAiLoading(true);
    
    try {
      const response = await fetch("/api/risk-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zScore: risk.zScore,
          bankruptcy: risk.bankruptcy,
          flags: risk.flags,
          metrics,
          data,
        }),
      });
      
      const result = await response.json();
      setAiAnalysis(result.analysis || null);
    } catch (err) {
      console.error("Failed to generate risk analysis:", err);
      setAiAnalysis(null);
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
              Upload a CSV file to see your risk assessment
            </p>
            <Button asChild>
              <Link href="/upload">Upload Data</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const risk = assessRisk(data, metrics);

  const getRiskColor = () => {
    switch (risk.level) {
      case "low":
        return "bg-green-500";
      case "moderate":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskBgColor = () => {
    switch (risk.level) {
      case "low":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "moderate":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
      case "high":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800";
      case "critical":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getRiskTextColor = () => {
    switch (risk.level) {
      case "low":
        return "text-green-700 dark:text-green-300";
      case "moderate":
        return "text-yellow-700 dark:text-yellow-300";
      case "high":
        return "text-orange-700 dark:text-orange-300";
      case "critical":
        return "text-red-700 dark:text-red-300";
      default:
        return "text-gray-700";
    }
  };

  const riskLabel = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    critical: "Critical Risk",
  }[risk.level];

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
                <h1 className="text-3xl font-semibold">Risk Assessment</h1>
                <p className="text-muted-foreground">
                  Bankruptcy probability and financial risk analysis
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>

            {/* AI RISK INTERPRETATION */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                AI Risk Interpretation
              </h2>
              
              {aiLoading ? (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Analyzing risk factors with AI...
                </p>
              ) : aiAnalysis ? (
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {aiAnalysis}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Unable to generate AI analysis. Using standard risk assessment.
                </p>
              )}
            </Card>

            {/* RISK LEVEL + Z-SCORE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className={`p-6 flex flex-col items-center space-y-3 border ${getRiskBgColor()}`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getRiskColor()}`}>
                  {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                </div>
                <p className={`font-semibold text-lg ${getRiskTextColor()}`}>
                  {riskLabel}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  {risk.level === "low" && "Company has low financial distress probability"}
                  {risk.level === "moderate" && "Monitor key financial metrics closely"}
                  {risk.level === "high" && "Significant financial stress indicators present"}
                  {risk.level === "critical" && "Severe financial distress — immediate action required"}
                </p>
              </Card>

              <Card className="p-6 flex flex-col justify-between">
                <div>
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Altman Z-Score
                  </p>
                  <p className="text-4xl font-bold mb-2">{risk.zScore}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Financial health metric (higher is better)
                  </p>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>✓ &gt; 2.9: Safe Zone</p>
                  <p>⚠ 1.23–2.9: Grey Zone</p>
                  <p>✗ &lt; 1.23: Distress Zone</p>
                </div>
              </Card>
            </div>

            {/* BANKRUPTCY PROBABILITY */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Bankruptcy Probability
                </h2>
                <p className="text-3xl font-bold">{risk.bankruptcy}%</p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    risk.bankruptcy < 20
                      ? "bg-green-500"
                      : risk.bankruptcy < 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${risk.bankruptcy}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Estimated probability of financial distress within 2 years based on
                Altman Z-Score methodology
              </p>
            </Card>

            {/* RISK FLAGS */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Risk Indicators
              </h2>

              {risk.flags.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No critical or warning flags detected — financial position is stable
                </p>
              ) : (
                <div className="space-y-3">
                  {risk.flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-start gap-3 ${
                        flag.severity === "danger"
                          ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                          : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          flag.severity === "danger"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {flag.severity === "danger" ? "!" : "⚠"}
                      </div>
                      <p className="text-sm leading-relaxed">
                        {flag.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* KEY METRICS */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Key Financial Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Liquidity Ratio</p>
                  <p className="text-2xl font-bold">{metrics.liquidity.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.liquidity > 2
                      ? "Strong"
                      : metrics.liquidity > 1
                      ? "Adequate"
                      : "Weak"}
                  </p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Leverage Ratio</p>
                  <p className="text-2xl font-bold">{metrics.leverage.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.leverage < 1
                      ? "Conservative"
                      : metrics.leverage < 2
                      ? "Moderate"
                      : "High"}
                  </p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Profitability</p>
                  <p className="text-2xl font-bold">
                    {(metrics.profitability * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.profitability > 0.15
                      ? "Strong"
                      : metrics.profitability > 0.05
                      ? "Moderate"
                      : "Weak"}
                  </p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Debt/Assets Ratio</p>
                  <p className="text-2xl font-bold">
                    {((data.debt / data.assets) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(data.debt / data.assets) < 0.3 ? "Low" : "Elevated"}
                  </p>
                </div>
              </div>
            </Card>

            {/* INTERPRETATION GUIDE */}
            <Card className="p-6 bg-muted/50">
              <h2 className="text-lg font-semibold mb-4">Risk Assessment Guide</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-green-600">Low Risk</p>
                  <p className="text-muted-foreground">
                    Strong financial position. Company is well-positioned to meet obligations.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-yellow-600">Moderate Risk</p>
                  <p className="text-muted-foreground">
                    Financial position is acceptable but requires monitoring of key metrics.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-orange-600">High Risk</p>
                  <p className="text-muted-foreground">
                    Company shows signs of financial stress. Close monitoring and corrective actions recommended.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-red-600">Critical Risk</p>
                  <p className="text-muted-foreground">
                    Severe financial distress. Immediate intervention required to avoid insolvency.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
