"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};

type Props = {
  value: BrandColors;
  onChange: (patch: Partial<BrandColors>) => void;
};

export function BrandColorSettings({ value, onChange }: Props) {
  const handle = (key: keyof BrandColors, v: string) => {
    onChange({ [key]: v });
  };

  const item = (label: string, key: keyof BrandColors) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          className="h-9 text-xs"
          value={value[key]}
          onChange={(e) => handle(key, e.target.value)}
          placeholder="#2563eb"
        />
        <input
          type="color"
          className="h-9 w-9 rounded-md border border-input bg-transparent p-0"
          value={value[key]}
          onChange={(e) => handle(key, e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/30">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          Custom Brand Colors
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Match the interface with your hotel’s brand identity.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {item("Primary Color", "primary")}
        {item("Secondary Color", "secondary")}
        {item("Accent Color", "accent")}
        {item("Background Color", "background")}
      </div>
    </Card>
  );
}

