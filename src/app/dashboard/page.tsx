"use client";

import { useState } from "react";
import Link from "next/link";
import { useFinancial } from "@/context/financial-context";
import { calculateMetrics } from "@/lib/calculations";
import { calculateScore } from "@/lib/scoring";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line,
} from "recharts";

export default function DashboardPage() {
  const {
    data,
    metrics,
    score,
    insights,
    suggestions,
    fileName,
    analyzedAt,
    aiSummary,
    aiLoading,
    generateSummary,
  } = useFinancial();
  const [simRevenue, setSimRevenue] = useState<number | null>(data?.revenue ?? null);
  

  // Keep simRevenue in sync when new data loads
  if (data && simRevenue === null) setSimRevenue(data.revenue);

  // ── Simulated score ───────────────────────────────────────
  const getSimulatedScore = () => {
    if (!data || simRevenue === null) return null;
    const growth = simRevenue / data.revenue;
    const efficiencyGain = 0.02 * (growth - 1);
    const baseMargin = data.netProfit / data.revenue;
    const newMargin = baseMargin + efficiencyGain;
    const newProfit = simRevenue * newMargin;
    const updated = { ...data, revenue: simRevenue, netProfit: newProfit, expenses: simRevenue - newProfit };
    return calculateScore(calculateMetrics(updated));
  };

  const simScore = getSimulatedScore();
  const growthPercent = simRevenue && data ? ((simRevenue - data.revenue) / data.revenue) * 100 : 0;

  const getScoreColor = () => {
    if (score === null) return "bg-gray-400";
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // ── No data state ─────────────────────────────────────────
  if (!data || !metrics || score === null) {
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
            <p className="text-muted-foreground">Upload a CSV file to see your financial analysis</p>
            <Button asChild>
              <Link href="/upload">Upload Data</Link>
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // ── Chart data ────────────────────────────────────────────
  const barData = [
    { name: "Revenue",   value: data.revenue },
    { name: "Expenses",  value: data.expenses },
    { name: "Net Profit",value: data.netProfit },
    { name: "Assets",    value: data.assets },
    { name: "Debt",      value: data.debt },
  ];

  const radarData = [
    { metric: "Liquidity",      value: Math.min(metrics.liquidity * 33, 100) },
    { metric: "Profitability",  value: Math.min(metrics.profitability * 200, 100) },
    { metric: "Leverage",       value: Math.max(100 - metrics.leverage * 50, 0) },
  ];

  // Line chart — simulate score across revenue range
  const lineData = Array.from({ length: 11 }, (_, i) => {
    const rev = data.revenue * (0.7 + i * 0.11);
    const growth = rev / data.revenue;
    const efficiencyGain = 0.02 * (growth - 1);
    const newMargin = (data.netProfit / data.revenue) + efficiencyGain;
    const updated = { ...data, revenue: rev, netProfit: rev * newMargin, expenses: rev - rev * newMargin };
    const s = calculateScore(calculateMetrics(updated));
    return { revenue: Math.round(rev), score: s };
  });

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
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">
                  {fileName && `Analyzing: ${fileName}`}
                  {analyzedAt && ` · ${new Date(analyzedAt).toLocaleString()}`}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/upload">Upload New</Link>
              </Button>
            </div>

            {/* SCORE + RADAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Card className="p-6 flex flex-col items-center space-y-3">
                <div className={`w-36 h-36 rounded-full flex items-center justify-center text-white text-4xl font-bold ${getScoreColor()}`}>
                  {score}
                </div>
                <p className="font-medium">Financial Health Score</p>
                <p className="text-sm text-muted-foreground">
                  {score >= 75 ? "Healthy — strong financial position"
                    : score >= 50 ? "Moderate — monitor key metrics"
                    : "At Risk — immediate attention needed"}
                </p>
              </Card>

              <Card className="p-4">
                <p className="font-medium mb-2">Health Radar</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

            </div>

            {/* AI SUMMARY */}
            <Card className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">AI Financial Summary</p>
                  <p className="text-sm text-muted-foreground">
                    CFO-style analysis powered by Gemini
                  </p>
                </div>
                <Button
                  onClick={generateSummary}
                  disabled={aiLoading}
                  variant="outline"
                  size="sm"
                >
                  {aiLoading ? "Analyzing..." : aiSummary ? "Regenerate" : "Generate Analysis"}
                </Button>
              </div>

              {aiSummary && (
                <p className="text-sm leading-relaxed text-foreground border-l-2 border-primary pl-4">
                  {aiSummary}
                </p>
              )}

              {!aiSummary && !aiLoading && (
                <p className="text-sm text-muted-foreground">
                  Click "Generate Analysis" to get an AI-powered financial summary
                </p>
              )}

              {aiLoading && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Generating CFO analysis...
                </p>
              )}
            </Card>

            {/* METRICS */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-base font-medium">Liquidity</p>
                <p className="text-2xl font-bold text-green-600">{metrics.liquidity.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">assets / liabilities</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-base font-medium">Profitability</p>
                <p className="text-2xl font-bold text-blue-600">{(metrics.profitability * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">net profit / revenue</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-base font-medium">Leverage</p>
                <p className="text-2xl font-bold text-red-600">{metrics.leverage.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">debt / equity</p>
              </Card>
            </div>

            {/* BAR CHART */}
            <Card className="p-4">
              <p className="font-medium mb-4">Financial Overview</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* INSIGHTS */}
            {insights.length > 0 && (
              <Card className="p-6 space-y-3">
                <p className="font-semibold">Insights</p>
                {insights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                      item.type === "positive" ? "bg-green-500"
                        : item.type === "negative" ? "bg-red-500"
                        : "bg-yellow-500"
                    }`} />
                    <p>{item.label}</p>
                  </div>
                ))}
              </Card>
            )}

            {/* SIMULATOR + LINE CHART */}
            <Card className="p-6 space-y-4">
              <div>
                <p className="font-semibold">What-if Simulator</p>
                <p className="text-sm text-muted-foreground">Adjust revenue to see score impact</p>
              </div>

              <input
                type="range"
                min={data.revenue * 0.7}
                max={data.revenue * 1.8}
                step={1000}
                value={simRevenue ?? data.revenue}
                onChange={(e) => setSimRevenue(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.round(data.revenue * 0.7)}</span>
                <span>{Math.round(data.revenue * 1.8)}</span>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm">
                  Revenue: <span className="font-semibold text-orange-500">{simRevenue}</span>
                </p>
                <p className="text-sm">
                  Score:{" "}
                  <span className={`font-bold ${
                    simScore && simScore > score ? "text-green-600"
                      : simScore && simScore < score ? "text-red-600"
                      : "text-blue-600"
                  }`}>{simScore}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Growth: {growthPercent.toFixed(1)}%
                </p>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={lineData}>
                  <XAxis dataKey="revenue" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <Card className="p-6 space-y-3">
                <p className="font-semibold">Improvement Suggestions</p>
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="h-2 w-2 mt-1 rounded-full bg-primary flex-shrink-0" />
                    <p>{s}</p>
                  </div>
                ))}
              </Card>
            )}

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}