"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Props = {
  value: string;
  onChange: (themeName: string) => void;
};

export function ThemeSelection({ value, onChange }: Props) {
  const options: { id: string; label: string; description: string }[] = [
    { id: "default", label: "Default Theme", description: "Balanced colors for general use." },
    { id: "corporate", label: "Corporate Theme", description: "Clean, minimal look for business hotels." },
    { id: "modern", label: "Modern Theme", description: "Bold, colorful interface with gradients." },
    { id: "minimal", label: "Minimal Theme", description: "Simple, low-distraction interface." },
  ];

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/30">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">Theme Selection</p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Choose a predefined visual theme for your dashboard.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        <Label className="text-xs">Theme</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`text-left rounded-lg border px-3 py-2 transition shadow-sm hover:shadow ${
                value === opt.id
                  ? "border-sky-500 bg-sky-500/10"
                  : "border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700"
              }`}
            >
              <div className="text-[12px] font-medium">{opt.label}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                {opt.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

