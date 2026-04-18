"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { z } from "zod";
import { calculateMetrics } from "@/lib/calculations";
import { calculateScore } from "@/lib/scoring";
import { getInsights } from "@/lib/insights";
import { getSuggestions } from "@/lib/suggestions";

// ── Zod schema ────────────────────────────────────────────────
export const FinancialRowSchema = z.object({
    revenue: z.coerce.number().positive(),
    expenses: z.coerce.number().positive(),
    netProfit: z.coerce.number(),
    assets: z.coerce.number().positive(),
    liabilities: z.coerce.number().positive(),
    equity: z.coerce.number(),
    debt: z.coerce.number(),
});

export type FinancialData = z.infer<typeof FinancialRowSchema>;

// ── Context types ─────────────────────────────────────────────
type FinancialContextType = {
    data: FinancialData | null;
    metrics: any;
    score: number | null;
    insights: any[];
    suggestions: string[];
    aiSummary: string | null;
    aiLoading: boolean;
    fileName: string | null;
    analyzedAt: string | null;
    error: string | null;
    setAnalysis: (raw: Record<string, string>, fileName: string) => void;
    generateSummary: () => Promise<void>;
    clearData: () => void;
};

const FinancialContext = createContext<FinancialContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────
export function FinancialProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<FinancialData | null>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [score, setScore] = useState<number | null>(null);
    const [insights, setInsights] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [analyzedAt, setAnalyzedAt] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("finhealth_analysis");
            if (stored) {
                const parsed = JSON.parse(stored);
                setData(parsed.data);
                setMetrics(parsed.metrics);
                setScore(parsed.score);
                setInsights(parsed.insights);
                setSuggestions(parsed.suggestions);
                setAiSummary(parsed.aiSummary ?? null);
                setFileName(parsed.fileName);
                setAnalyzedAt(parsed.analyzedAt);
            }
        } catch { }
    }, []);

    const setAnalysis = (raw: Record<string, string>, fileName: string) => {
        // Zod validation
        const result = FinancialRowSchema.safeParse(raw);
        if (!result.success) {
            setError("Invalid CSV format. Please check your column names and values.");
            return;
        }

        const cleaned = result.data;
        const m = calculateMetrics(cleaned);
        const s = calculateScore(m);
        const i = getInsights(m);
        const sg = getSuggestions(cleaned, m);
        const ts = new Date().toISOString();

        setData(cleaned);
        setMetrics(m);
        setScore(s);
        setInsights(i);
        setSuggestions(sg);
        setFileName(fileName);
        setAnalyzedAt(ts);
        setError(null);
        setAiSummary(null);

        // Persist to localStorage
        localStorage.setItem("finhealth_analysis", JSON.stringify({
            data: cleaned, metrics: m, score: s,
            insights: i, suggestions: sg, aiSummary: null, fileName, analyzedAt: ts,
        }));
    };

    const generateSummary = async () => {
        if (!data || !metrics || score === null) return;

        setAiLoading(true);
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data, metrics, score }),
            });

            const json = await res.json();
            setAiSummary(json.summary);

            localStorage.setItem("finhealth_analysis", JSON.stringify({
                data, metrics, score,
                insights, suggestions, aiSummary: json.summary,
                fileName, analyzedAt,
            }));
        } catch {
            setAiSummary("Unable to generate summary at this time.");
        } finally {
            setAiLoading(false);
        }
    };

    const clearData = () => {
        setData(null); setMetrics(null); setScore(null);
        setInsights([]); setSuggestions([]); setFileName(null);
        setAnalyzedAt(null); setError(null); setAiSummary(null); setAiLoading(false);
        localStorage.removeItem("finhealth_analysis");
    };

    return (
        <FinancialContext.Provider value={{
            data, metrics, score, insights, suggestions, aiSummary, aiLoading,
            fileName, analyzedAt, error, setAnalysis, generateSummary, clearData,
        }}>
            {children}
        </FinancialContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────
export function useFinancial() {
    const ctx = useContext(FinancialContext);
    if (!ctx) throw new Error("useFinancial must be used inside FinancialProvider");
    return ctx;
}