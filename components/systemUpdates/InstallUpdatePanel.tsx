"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AvailableUpdate } from "./SystemUpdatesDashboard";

type Props = {
  updates: AvailableUpdate[];
  installingId: string | null;
  onInstall: (id: string) => Promise<void>;
};

export function InstallUpdatePanel({ updates, installingId, onInstall }: Props) {
  const hasAny = updates && updates.length > 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/15 via-emerald-400/10 to-lime-500/15 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          Install System Updates
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Install the latest available version or choose a specific update.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        {!hasAny && (
          <p className="text-[11px] text-slate-700 dark:text-slate-200">
            No pending updates are available at the moment.
          </p>
        )}

        {hasAny && (
          <div className="space-y-2">
            {updates.map((u) => (
              <div
                key={u.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-md bg-white/70 dark:bg-slate-900/60 border border-emerald-500/30 px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="text-[13px] font-semibold">
                    {u.title || `Version ${u.version}`}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {u.version} &middot; {u.type || "feature update"}
                  </p>
                  {u.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                      {u.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 text-white"
                    onClick={() => {
                      void onInstall(u.id);
                    }}
                    disabled={installingId === u.id}
                  >
                    {installingId === u.id ? "Installing..." : "Install"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

