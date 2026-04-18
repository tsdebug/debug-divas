"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent } from "react";
import Papa from "papaparse";
import { useFinancial } from "@/context/financial-context";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadPage() {
  const { setAnalysis, error } = useFinancial();
  const router = useRouter();

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      complete: (results) => {
        const row = results.data[0];
        if (!row) return;
        setAnalysis(row, file.name);
        router.push("/dashboard");
      },
    });
  };

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
          <div className="p-6 max-w-2xl mx-auto space-y-6">

            <div>
              <h1 className="text-3xl font-semibold">Upload Financial Data</h1>
              <p className="text-muted-foreground">
                Upload a CSV file to analyze your SME's financial health
              </p>
            </div>

            {/* FORMAT GUIDE */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="font-medium">Required CSV columns</p>
                <p className="text-sm text-muted-foreground font-mono">
                  revenue, expenses, netProfit, assets, liabilities, equity, debt
                </p>
                <p className="text-xs text-muted-foreground">
                  All values must be positive numbers. netProfit and equity can be negative.
                </p>
              </CardContent>
            </Card>

            {/* UPLOAD */}
            <Card>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">Choose CSV file</p>
                  <p className="text-sm text-muted-foreground">
                    You'll be redirected to the dashboard after upload
                  </p>
                </div>

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

            {/* ERROR */}
            {error && (
              <Card className="border-red-500">
                <CardContent className="p-4">
                  <p className="text-sm text-red-500">{error}</p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}