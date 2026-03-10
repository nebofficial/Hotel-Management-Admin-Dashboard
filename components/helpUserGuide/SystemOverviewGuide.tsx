"use client";

import { Card } from "@/components/ui/card";

type Section = {
  id: string;
  title: string;
  summary: string;
};

type Props = {
  sections: Section[];
};

export function SystemOverviewGuide({ sections }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
          System Overview Guide
        </p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          High-level explanation of system features and navigation.
        </p>
      </div>
      <div className="p-4 space-y-2 text-xs">
        {sections.map((s) => (
          <div
            key={s.id}
            className="rounded-md border border-sky-200/60 bg-white/70 px-3 py-2 dark:border-sky-700/50 dark:bg-slate-900/60"
          >
            <p className="text-[12px] font-semibold text-sky-900 dark:text-sky-50">
              {s.title}
            </p>
            <p className="text-[11px] text-sky-800/80 dark:text-sky-100/80">
              {s.summary}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

