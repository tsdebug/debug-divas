"use client";

import { useState, type ChangeEvent } from "react";
import Papa, { type ParseResult } from "papaparse";

import { calculateMetrics } from "@/lib/calculations";
import { calculateScore } from "@/lib/scoring";
import { getInsights } from "@/lib/insights";
import { getSuggestions } from "@/lib/suggestions";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CleanedRow = {
  revenue: number;
  expenses: number;
  netProfit: number;
  assets: number;
  liabilities: number;
  equity: number;
  debt: number;
};

export default function Page() {
  const [data, setData] = useState<CleanedRow | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [simRevenue, setSimRevenue] = useState<number | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      complete: (results: ParseResult<Record<string, string>>) => {
        const row = results.data[0];
        if (!row) return;

        const cleaned: CleanedRow = {
          revenue: Number(row.revenue),
          expenses: Number(row.expenses),
          netProfit: Number(row.netProfit),
          assets: Number(row.assets),
          liabilities: Number(row.liabilities),
          equity: Number(row.equity),
          debt: Number(row.debt),
        };

        const m = calculateMetrics(cleaned);
        const s = calculateScore(m);
        const i = getInsights(m);
        const sg = getSuggestions(cleaned, m);

        setData(cleaned);
        setMetrics(m);
        setScore(s);
        setInsights(i);
        setSuggestions(sg);
        setSimRevenue(cleaned.revenue);
      },
    });
  };

  const getSimulatedScore = () => {
    if (!data || simRevenue === null) return null;

    const growth = simRevenue / data.revenue;
    const efficiencyGain = 0.02 * (growth - 1);

    const baseMargin = data.netProfit / data.revenue;
    const newMargin = baseMargin + efficiencyGain;

    const newProfit = simRevenue * newMargin;

    const updated = {
      ...data,
      revenue: simRevenue,
      netProfit: newProfit,
      expenses: simRevenue - newProfit,
    };

    const m = calculateMetrics(updated);
    return calculateScore(m);
  };

  const simScore = getSimulatedScore();

  const getColor = () => {
    if (score === null) return "bg-gray-400";
    if (score > 75) return "bg-green-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const growthPercent =
    simRevenue && data
      ? ((simRevenue - data.revenue) / data.revenue) * 100
      : 0;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />

        <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
          <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-semibold">AI Financial Health Analyzer</h1>
              <p className="text-muted-foreground">
                Upload your financial data and evaluate business performance
              </p>
            </div>

            {/* UPLOAD */}
            <Card>
              <CardContent className="flex justify-between items-center p-4">
                <p>Upload CSV file</p>

                <Button asChild>
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>

                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFile}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* SCORE */}
            {score !== null && (
              <Card className="p-6 flex flex-col items-center space-y-4">
                <div
                  className={`w-40 h-40 rounded-full flex items-center justify-center text-white text-4xl font-bold ${getColor()}`}
                >
                  {score}
                </div>
                <p>Financial Health Score</p>
              </Card>
            )}

            {/* METRICS */}
            {metrics && (
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-base font-medium text-foreground">Liquidity</p>
                  <p className="text-2xl font-bold tracking-tight text-green-600">
                    {metrics.liquidity.toFixed(2)}
                  </p>
                </Card>

                <Card className="p-4 text-center">
                  <p className="text-base font-medium text-foreground">Profitability</p>
                  <p className="text-2xl font-bold tracking-tight text-blue-600">
                    {(metrics.profitability * 100).toFixed(1)}%
                  </p>
                </Card>

                <Card className="p-4 text-center">
                  <p className="text-base font-medium text-foreground">Leverage</p>
                  <p className="text-2xl font-bold tracking-tight text-red-600">
                    {metrics.leverage.toFixed(2)}
                  </p>
                </Card>
              </div>
            )}

            {/* INSIGHTS */}
            {insights.length > 0 && (
              <Card className="p-6 space-y-2">
                <p className="font-semibold">Insights</p>
                {insights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${
                        item.type === "positive"
                          ? "bg-green-500"
                          : item.type === "negative"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <p>{item.label}</p>
                  </div>
                ))}
              </Card>
            )}

            {/* SIMULATOR */}
            {data && simRevenue !== null && (
              <Card className="p-6 space-y-4">
                <p className="font-semibold">What-if Simulator</p>

                <input
                  type="range"
                  min={data.revenue * 0.7}
                  max={data.revenue * 1.8}
                  step={1000}
                  value={simRevenue}
                  onChange={(e) => setSimRevenue(Number(e.target.value))}
                  className="w-full"
                />

                <div className="flex justify-between text-sm">
                  <span>{Math.round(data.revenue * 0.7)}</span>
                  <span>{Math.round(data.revenue * 1.8)}</span>
                </div>

                <p>
                  Revenue: <span className="font-semibold text-lg text-orange-500">{simRevenue}</span> | Score: <span className={`font-bold text-lg ${simScore && score && simScore > score ? "text-green-600 "
                    : simScore && score && simScore < score ? "text-red-600"
                      : "text-blue-600"
                    }`}>{simScore}</span>
                </p>

                <p className="text-sm text-muted-foreground">Growth: {growthPercent.toFixed(1)}%</p>
              </Card>
            )}

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <Card className="p-6 space-y-2">
                <p className="font-semibold">Suggestions</p>
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="h-2 w-2 mt-1 rounded-full bg-primary" />
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