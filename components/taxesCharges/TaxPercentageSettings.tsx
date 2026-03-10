"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  value: number | string;
  onChange: (value: number | string) => void;
};

export function TaxPercentageSettings({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Tax Percentage (%)</Label>
      <Input
        type="number"
        step={0.01}
        min={0}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="h-9 text-xs"
      />
    </div>
  );
}

