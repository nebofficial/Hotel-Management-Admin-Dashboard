"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FontSettings = {
  family: string;
  size: "small" | "medium" | "large";
  headingStyle: string;
  lineSpacing: number;
};

type Props = {
  value: FontSettings;
  onChange: (patch: Partial<FontSettings>) => void;
};

export function FontSettingsPanel({ value, onChange }: Props) {
  const set = (patch: Partial<FontSettings>) => onChange(patch);

  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Font Style Configuration
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Improve readability with custom typography settings.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Font Family</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={value.family}
            onChange={(e) => set({ family: e.target.value })}
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Font Size</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={value.size}
            onChange={(e) => set({ size: e.target.value as FontSettings["size"] })}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Heading Style</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={value.headingStyle}
            onChange={(e) => set({ headingStyle: e.target.value })}
          >
            <option value="regular">Regular</option>
            <option value="semibold">Semi-bold</option>
            <option value="bold">Bold</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Line Spacing</Label>
          <Input
            type="number"
            step="0.1"
            className="h-9 text-xs"
            value={value.lineSpacing}
            onChange={(e) => set({ lineSpacing: Number(e.target.value || 1.5) })}
          />
        </div>
      </div>
    </Card>
  );
}

