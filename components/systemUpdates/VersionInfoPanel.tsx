"use client";

import { Card } from "@/components/ui/card";
import type { VersionInfo } from "./SystemUpdatesDashboard";

type Props = {
  current: VersionInfo | null;
  latest: VersionInfo | null;
};

export function VersionInfoPanel({ current, latest }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-teal-500/15 via-cyan-500/10 to-emerald-500/15 backdrop-blur">
      <div className="p-4 border-b border-teal-500/40">
        <p className="text-sm font-semibold text-teal-900 dark:text-teal-50">
          Version Information
        </p>
        <p className="text-[11px] text-teal-900/70 dark:text-teal-100/80">
          View the current system version, build number, and release details.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-[11px] font-medium text-teal-900/80 dark:text-teal-100">
            Current version
          </p>
          <p className="text-[13px] font-semibold">
            {current?.version ?? "Unknown"}
          </p>
          {current?.build && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Build {current.build}
            </p>
          )}
          {current?.releasedAt && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Released{" "}
              {new Date(current.releasedAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </p>
          )}
        </div>
        <div>
          <p className="text-[11px] font-medium text-teal-900/80 dark:text-teal-100">
            Latest known version
          </p>
          <p className="text-[13px] font-semibold">
            {latest?.version ?? current?.version ?? "Unknown"}
          </p>
          {latest?.releasedAt && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Released{" "}
              {new Date(latest.releasedAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

