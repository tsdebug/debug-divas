"use client";

import { useState, type ChangeEvent } from "react";
import Papa, { type ParseResult } from "papaparse";
import { calculateMetrics } from "@/lib/calculations";
import { calculateScore } from "@/lib/scoring";
import { getInsights } from "@/lib/insights";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CleanedRow = {
    revenue: number;
    expenses: number;
    netProfit: number;
    assets: number;
    liabilities: number;
    equity: number;
    debt: number;
};

export default function UploadPage() {
    const [data, setData] = useState<CleanedRow | null>(null); // parse data
    const [score, setScore] = useState<number | null>(null); // score
    const [metrics, setMetrics] = useState<any>(null); // metrics
    const [insights, setInsights] = useState<any[]>([]); // insights
    const [simRevenue, setSimRevenue] = useState<number | null>(null); // simulated revenue for "what-if" analysis

    const getSimulatedScore = () => {
        if (!data || simRevenue === null) return null;

        const growth = simRevenue / data.revenue;

        // Efficiency improves slightly with growth
        const efficiencyGain = 0.02 * (growth - 1);
        // e.g. 10% growth → 0.2% better margin

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
                const r = cleaned.revenue;

                setData(cleaned);
                setMetrics(m);
                setScore(s);
                setInsights(i);
                setSimRevenue(r);
            },
        });
    };

    const growthPercent =
        simRevenue && data
            ? ((simRevenue - data.revenue) / data.revenue) * 100
            : 0;

    const getColor = () => {
        if (!score) return "bg-gray-400";
        if (score > 75) return "bg-green-500";
        if (score > 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 px-4 py-10 md:px-8">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* HEADER */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold tracking-tight">
                        AI Financial Health Analyzer
                    </h1>
                    <p className="text-muted-foreground">
                        Upload your financial data and instantly evaluate business performance
                    </p>
                </div>
                {/* FILE UPLOAD */}
                <Card className="border-border/60 shadow-sm">
                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <p className="text-base font-medium">CSV file</p>
                            <p className="text-sm text-muted-foreground">
                                Upload a `.csv` file with financial data
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button asChild size="lg">
                                <label htmlFor="csv-upload" className="cursor-pointer">
                                    Choose file
                                </label>
                            </Button>

                            <input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFile}
                                className="hidden"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* SCORE (IMPROVED) */}
                {score !== null && (
                    <Card className="p-6 flex flex-col items-center space-y-4 shadow-sm">
                        <div
                            className={`w-40 h-40 rounded-full flex items-center justify-center text-white text-4xl font-bold ${getColor()}`}
                        >
                            {score}
                        </div>

                        <div className="text-center">
                            <p className="text-lg font-medium">Financial Health Score</p>
                            <p className="text-sm text-muted-foreground">
                                Overall financial stability rating
                            </p>
                        </div>
                    </Card>
                )}

                {/* METRICS */}
                {metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 text-center">
                            <p className="text-base font-medium text-foreground">
                                Liquidity
                            </p>
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

                {insights.length > 0 && (
                    <Card className="p-6">
                        <div>
                            <p className="text-lg font-semibold">
                                Score Breakdown
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Key factors influencing this score
                            </p>
                        </div>

                        <div className="space-y-3">
                            {insights.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className={`mt-1 h-2 w-2 rounded-full ${item.type === "positive"
                                            ? "bg-green-500"
                                            : item.type === "negative"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                            }`}
                                    />

                                    <p className="text-sm leading-relaxed text-foreground">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {data && simRevenue !== null && (
                    <Card className="p-6 space-y-1">
                        <div>
                            <p className="text-lg font-semibold">What-if Simulator</p>
                            <p className="text-sm text-muted-foreground">
                                Adjust revenue to see how your score changes
                            </p>
                        </div>

                        {/* Slider */}
                        <input
                            type="range"
                            min={data.revenue * 0.7}
                            max={data.revenue * 1.8}
                            step={1000}
                            value={simRevenue}
                            onChange={(e) => setSimRevenue(Number(e.target.value))}
                            className="w-full"
                        />

                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{Math.round(data.revenue * 0.5)}</span>
                            <span>{Math.round(data.revenue * 1.5)}</span>
                        </div>

                        {/* Values */}
                        <div className="flex justify-between items-center font-xl font-medium">
                            <p className="text-sm">
                                Simulated Revenue:{" "}
                                <span className="font-semibold text-red-500">{simRevenue}</span>
                            </p>

                            <p className="text-sm">
                                New Score:{" "}
                                <span className="font-bold text-blue-600">
                                    {getSimulatedScore()}
                                </span>
                            </p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Growth: {growthPercent.toFixed(1)}%
                        </p>

                        <p className="text-sm">
                            {growthPercent > 0
                                ? "Growth improves profitability and asset strength"
                                : "Decline increases financial pressure"}
                        </p>
                    </Card>
                )}

                {/* CLEAN DATA VIEW */}
                {data && (
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                            Parsed Data
                        </p>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </Card>
                )}
            </div>
        </div>
    );
}