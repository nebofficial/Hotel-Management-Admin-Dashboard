"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Mode = "light" | "dark" | "system";

type Props = {
  value: Mode;
  onChange: (mode: Mode) => void;
};

export function LightDarkModeToggle({ value, onChange }: Props) {
  const options: { id: Mode; label: string; description: string }[] = [
    { id: "light", label: "Light Mode", description: "Bright, clear appearance for daytime use." },
    { id: "dark", label: "Dark Mode", description: "Low-glare interface for evening shifts." },
    {
      id: "system",
      label: "Auto (System Preference)",
      description: "Match the operating system’s light/dark setting.",
    },
  ];

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-300 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Light / Dark Mode
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Improve usability for different lighting environments.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        <Label className="text-xs">Display Mode</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`text-left rounded-lg border px-3 py-2 transition hover:shadow-sm ${
                value === opt.id
                  ? "border-slate-900 bg-slate-900 text-slate-50"
                  : "border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              }`}
            >
              <div className="text-[12px] font-medium">{opt.label}</div>
              <div className="text-[11px] opacity-80">{opt.description}</div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

