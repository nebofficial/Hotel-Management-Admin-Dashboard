"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type ButtonSettings = {
  shape: "rounded" | "square";
  shadow: boolean;
  variants: string[];
};

type Props = {
  value: ButtonSettings;
  onChange: (patch: Partial<ButtonSettings>) => void;
};

export function ButtonStyleSettings({ value, onChange }: Props) {
  const toggleVariant = (v: string) => {
    const set = new Set(value.variants || []);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    onChange({ variants: Array.from(set) });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-amber-400/10 via-orange-400/5 to-red-400/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">
          Button Style Settings
        </p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Control button shapes, shadows, and visual variants.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Button Shape</Label>
          <div className="flex gap-2">
            {["rounded", "square"].map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => onChange({ shape: shape as ButtonSettings["shape"] })}
                className={`px-3 py-1.5 rounded-full border text-[11px] capitalize ${
                  value.shape === shape
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <Label className="text-xs">Shadow Effects</Label>
          <Switch
            checked={!!value.shadow}
            onCheckedChange={(v) => onChange({ shadow: v })}
          />
        </div>
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs">Button Variants</Label>
          <div className="flex flex-wrap gap-2">
            {["solid", "outline", "ghost"].map((v) => {
              const active = value.variants?.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleVariant(v)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] capitalize ${
                    active
                      ? "border-amber-500 bg-amber-500 text-amber-50"
                      : "border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

