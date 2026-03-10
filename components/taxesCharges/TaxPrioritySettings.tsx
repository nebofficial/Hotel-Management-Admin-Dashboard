"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  value: number | string;
  onChange: (value: number | string) => void;
};

export function TaxPrioritySettings({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">Tax Priority (1 = highest)</Label>
      <Input
        type="number"
        min={1}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        className="h-9 text-xs max-w-[120px]"
      />
    </div>
  );
}

