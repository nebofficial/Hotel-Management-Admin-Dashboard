"use client";

import { Card } from "@/components/ui/card";

type Module = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  modules: Module[];
};

export function ModuleUserManuals({ modules }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          Module-wise User Manuals
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Detailed guides for each major module in the system.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {modules.map((m) => (
          <div
            key={m.id}
            className="rounded-md border border-emerald-200/70 bg-white/70 px-3 py-2 dark:border-emerald-700/50 dark:bg-slate-900/60"
          >
            <p className="text-[12px] font-semibold text-emerald-900 dark:text-emerald-50">
              {m.name}
            </p>
            <p className="text-[11px] text-emerald-900/80 dark:text-emerald-100/80">
              {m.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

