"use client";

import { Card } from "@/components/ui/card";

type Tutorial = {
  id: string;
  title: string;
  module: string;
  steps: string[];
};

type Props = {
  tutorials: Tutorial[];
};

export function StepByStepTutorials({ tutorials }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/40">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Step-by-Step Tutorials
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Walkthroughs for the most common workflows.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        {tutorials.map((t) => (
          <div
            key={t.id}
            className="rounded-md border border-violet-200/70 bg-white/70 px-3 py-2 dark:border-violet-700/50 dark:bg-slate-900/60"
          >
            <p className="text-[12px] font-semibold text-violet-900 dark:text-violet-50">
              {t.title}
            </p>
            <p className="text-[11px] text-violet-900/80 dark:text-violet-100/80 mb-1">
              Module: {t.module}
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-violet-900/80 dark:text-violet-100/80">
              {t.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Card>
  );
}

