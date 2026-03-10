"use client";

import { Card } from "@/components/ui/card";

type Props = {
  totalOpen: number;
  highPriority: number;
  recentCreated: number;
};

export function SupportTicketsWidget({
  totalOpen,
  highPriority,
  recentCreated,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/40">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Open Support Tickets
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Track active tickets and priorities.
        </p>
      </div>
      <div className="p-4 grid grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
            Total Open
          </p>
          <p className="text-lg font-bold text-violet-900 dark:text-violet-50">
            {totalOpen}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
            High Priority
          </p>
          <p className="text-lg font-bold text-violet-900 dark:text-violet-50">
            {highPriority}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
            New (24h)
          </p>
          <p className="text-lg font-bold text-violet-900 dark:text-violet-50">
            {recentCreated}
          </p>
        </div>
      </div>
    </Card>
  );
}

