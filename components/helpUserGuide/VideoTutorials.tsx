"use client";

import { Card } from "@/components/ui/card";

type Tutorial = {
  id: string;
  title: string;
  module: string;
  videoUrl: string;
};

type Props = {
  tutorials: Tutorial[];
};

export function VideoTutorials({ tutorials }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
          Video Tutorials
        </p>
        <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
          Visual walkthroughs and training sessions.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {tutorials.map((t) => (
          <a
            key={t.id}
            href={t.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-orange-200/70 bg-white/80 px-3 py-2 shadow-sm hover:border-orange-500 hover:bg-orange-50 transition dark:border-orange-700/50 dark:bg-slate-900/60"
          >
            <p className="text-[12px] font-semibold text-orange-900 dark:text-orange-50">
              {t.title}
            </p>
            <p className="text-[11px] text-orange-900/80 dark:text-orange-100/80">
              Module: {t.module}
            </p>
            <p className="mt-1 text-[11px] text-orange-900/70 dark:text-orange-100/70">
              Click to open video tutorial in a new tab.
            </p>
          </a>
        ))}
      </div>
    </Card>
  );
}

