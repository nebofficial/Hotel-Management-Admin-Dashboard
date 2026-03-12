"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Period = "today" | "weekly" | "monthly" | "custom";

type Props = {
  period: Period;
  startDate?: string;
  endDate?: string;
  onChange: (v: { period: Period; startDate?: string; endDate?: string }) => void;
  onApply: () => void;
};

export function KPIFilters({ period, startDate, endDate, onChange, onApply }: Props) {
  const [localPeriod, setLocalPeriod] = useState<Period>(period);
  const [localStart, setLocalStart] = useState(startDate || "");
  const [localEnd, setLocalEnd] = useState(endDate || "");

  useEffect(() => {
    setLocalPeriod(period);
    setLocalStart(startDate || "");
    setLocalEnd(endDate || "");
  }, [period, startDate, endDate]);

  const apply = () => {
    onChange({
      period: localPeriod,
      startDate: localPeriod === "custom" && localStart ? localStart : undefined,
      endDate: localPeriod === "custom" && localEnd ? localEnd : undefined,
    });
    onApply();
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/80 text-slate-50 px-3 py-2.5 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-[11px]">
        <span className="font-semibold uppercase tracking-wide text-slate-200">
          Filters
        </span>
        <span className="text-slate-400">Period</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {(["today", "weekly", "monthly", "custom"] as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setLocalPeriod(p)}
            className={`px-2.5 py-1 rounded-full border text-[11px] ${
              localPeriod === p
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-50"
                : "border-slate-600 bg-slate-900/40 text-slate-200 hover:border-emerald-400/70"
            }`}
          >
            {p === "today"
              ? "Today"
              : p === "weekly"
              ? "Last 7 days"
              : p === "monthly"
              ? "This month"
              : "Custom"}
          </button>
        ))}
      </div>
      {localPeriod === "custom" && (
        <div className="flex items-center gap-1.5 text-[11px]">
          <input
            type="date"
            value={localStart}
            onChange={(e) => setLocalStart(e.target.value)}
            className="h-7 rounded-md border border-slate-600 bg-slate-950/40 px-2 text-[11px]"
          />
          <span className="text-slate-300">to</span>
          <input
            type="date"
            value={localEnd}
            onChange={(e) => setLocalEnd(e.target.value)}
            className="h-7 rounded-md border border-slate-600 bg-slate-950/40 px-2 text-[11px]"
          />
        </div>
      )}
      <div className="ml-auto">
        <Button
          size="sm"
          className="h-7 px-3 text-[11px] bg-emerald-500 hover:bg-emerald-400 text-white"
          onClick={apply}
        >
          Apply
        </Button>
      </div>
    </Card>
  );
}

