"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VersionInfo } from "./SystemUpdatesDashboard";

type Props = {
  current: VersionInfo | null;
  latest: VersionInfo | null;
  hasUpdate: boolean;
  checking: boolean;
  onCheck: () => Promise<void>;
};

export function CheckUpdatesPanel({
  current,
  latest,
  hasUpdate,
  checking,
  onCheck,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/15 via-sky-400/10 to-indigo-500/20 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
          Check for System Updates
        </p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Compare the installed version with the latest available release.
        </p>
      </div>
      <div className="p-4 flex flex-col gap-3 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-medium text-sky-900/80 dark:text-sky-100">
              Installed version
            </p>
            <p className="text-[13px] font-semibold">
              {current?.version ?? "Unknown"}
            </p>
            {current?.build && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Build {current.build}
              </p>
            )}
          </div>
          <div>
            <p className="text-[11px] font-medium text-sky-900/80 dark:text-sky-100">
              Latest version
            </p>
            <p className="text-[13px] font-semibold">
              {latest?.version ?? "Up to date"}
            </p>
            {latest?.releasedAt && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Released {new Date(latest.releasedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px]">
            {hasUpdate ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-200 border border-amber-500/40">
                New update available
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-500/40">
                System is up to date
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="bg-sky-600 text-white"
            onClick={() => {
              void onCheck();
            }}
            disabled={checking}
          >
            {checking ? "Checking..." : "Check Updates"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

