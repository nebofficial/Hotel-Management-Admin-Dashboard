"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SidebarLayout = {
  variant: "collapsible" | "compact" | "icon-only";
  position: "fixed" | "floating";
};

type Props = {
  value: SidebarLayout;
  onChange: (patch: Partial<SidebarLayout>) => void;
};

export function SidebarLayoutOptions({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-cyan-400/10 via-sky-400/5 to-blue-500/10 backdrop-blur">
      <div className="p-4 border-b border-cyan-400/40">
        <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-50">
          Sidebar Layout Options
        </p>
        <p className="text-[11px] text-cyan-900/70 dark:text-cyan-100/80">
          Customize how the main navigation sidebar behaves.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Layout Variant</Label>
          <div className="flex flex-wrap gap-2">
            {["collapsible", "compact", "icon-only"].map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() =>
                  onChange({ variant: variant as SidebarLayout["variant"] })
                }
                className={`px-3 py-1.5 rounded-full border text-[11px] capitalize ${
                  value.variant === variant
                    ? "border-cyan-500 bg-cyan-500 text-cyan-50"
                    : "border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700"
                }`}
              >
                {variant.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sidebar Position</Label>
          <div className="flex gap-2">
            {["fixed", "floating"].map((position) => (
              <button
                key={position}
                type="button"
                onClick={() =>
                  onChange({ position: position as SidebarLayout["position"] })
                }
                className={`px-3 py-1.5 rounded-full border text-[11px] capitalize ${
                  value.position === position
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700"
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

