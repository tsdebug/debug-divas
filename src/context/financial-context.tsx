"use client";

import {
  createContext, useContext, useState,
  useEffect, type ReactNode,
} from "react";
import { z } from "zod";
import { calculateMetrics } from "@/lib/calculations";
import { calculateScore }   from "@/lib/scoring";
import { getInsights }      from "@/lib/insights";
import { getSuggestions }   from "@/lib/suggestions";

export const FinancialRowSchema = z.object({
  revenue:     z.coerce.number().positive(),
  expenses:    z.coerce.number().positive(),
  netProfit:   z.coerce.number(),
  assets:      z.coerce.number().positive(),
  liabilities: z.coerce.number().positive(),
  equity:      z.coerce.number(),
  debt:        z.coerce.number(),
});

export type FinancialData = z.infer<typeof FinancialRowSchema>;

type FinancialContextType = {
  data:             FinancialData | null;
  metrics:          any;
  score:            number | null;
  insights:         any[];
  suggestions:      string[];
  fileName:         string | null;
  analyzedAt:       string | null;
  error:            string | null;
  aiSummary:        string | null;
  aiLoading:        boolean;
  mlResult:         any;
  setAnalysis:      (raw: Record<string, string>, fileName: string) => void;
  clearData:        () => void;
  generateSummary:  () => Promise<void>;
};

const FinancialContext = createContext<FinancialContextType | null>(null);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [data,        setData]        = useState<FinancialData | null>(null);
  const [metrics,     setMetrics]     = useState<any>(null);
  const [score,       setScore]       = useState<number | null>(null);
  const [insights,    setInsights]    = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fileName,    setFileName]    = useState<string | null>(null);
  const [analyzedAt,  setAnalyzedAt]  = useState<string | null>(null);
  const [error,       setError]       = useState<string | null>(null);
  const [aiSummary,   setAiSummary]   = useState<string | null>(null);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [mlResult,    setMlResult]    = useState<any>(null);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("finhealth_analysis");
      if (stored) {
        const p = JSON.parse(stored);
        setData(p.data);
        setMetrics(p.metrics);
        setScore(p.score);
        setInsights(p.insights);
        setSuggestions(p.suggestions);
        setFileName(p.fileName);
        setAnalyzedAt(p.analyzedAt);
        setAiSummary(p.aiSummary ?? null);
        setMlResult(p.mlResult ?? null);
      }
    } catch {}
  }, []);

  const setAnalysis = (raw: Record<string, string>, fileName: string) => {
    const result = FinancialRowSchema.safeParse(raw);
    if (!result.success) {
      setError("Invalid CSV format. Please check your column names and values.");
      return;
    }

    const cleaned = result.data;
    const m  = calculateMetrics(cleaned);
    const s  = calculateScore(m);
    const i  = getInsights(m);
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
    setMlResult(null);

    localStorage.setItem("finhealth_analysis", JSON.stringify({
      data: cleaned, metrics: m, score: s,
      insights: i, suggestions: sg,
      fileName, analyzedAt: ts,
      aiSummary: null, mlResult: null,
    }));
  };

  const generateSummary = async () => {
    if (!data || !metrics || score === null) return;
    setAiLoading(true);
    try {
      const res  = await fetch("/api/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ data, metrics, score }),
      });
      const json = await res.json();
      setAiSummary(json.summary);
      setMlResult(json.ml);

      // Persist AI results to localStorage
      const stored = localStorage.getItem("finhealth_analysis");
      if (stored) {
        const p = JSON.parse(stored);
        localStorage.setItem("finhealth_analysis", JSON.stringify({
          ...p,
          aiSummary: json.summary,
          mlResult:  json.ml,
        }));
      }
    } catch {
      setAiSummary("Unable to generate summary at this time.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearData = () => {
    setData(null);       setMetrics(null);    setScore(null);
    setInsights([]);     setSuggestions([]);  setFileName(null);
    setAnalyzedAt(null); setError(null);      setAiSummary(null);
    setMlResult(null);
    localStorage.removeItem("finhealth_analysis");
  };

  return (
    <FinancialContext.Provider value={{
      data, metrics, score, insights, suggestions,
      fileName, analyzedAt, error,
      aiSummary, aiLoading, mlResult,
      setAnalysis, clearData, generateSummary,
    }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error("useFinancial must be used inside FinancialProvider");
  return ctx;
}