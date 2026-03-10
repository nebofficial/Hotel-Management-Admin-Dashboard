"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Props = {
  mode: "DETAILED" | "TOTAL_ONLY";
  onChange: (mode: "DETAILED" | "TOTAL_ONLY") => void;
};

export function TaxDisplaySettings({ mode, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-red-400/40">
        <p className="text-sm font-semibold text-red-900 dark:text-red-50">Tax Display Configuration</p>
        <p className="text-[11px] text-red-900/70 dark:text-red-100/80">
          Control how taxes are shown on the invoice.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        <Label className="text-xs">Tax Display Mode</Label>
        <div className="flex flex-col gap-1 mt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="taxDisplay"
              className="h-3 w-3"
              checked={mode === "DETAILED"}
              onChange={() => onChange("DETAILED")}
            />
            <span>Show detailed tax breakdown</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="taxDisplay"
              className="h-3 w-3"
              checked={mode === "TOTAL_ONLY"}
              onChange={() => onChange("TOTAL_ONLY")}
            />
            <span>Show only total tax</span>
          </label>
        </div>
      </div>
    </Card>
  );
}

