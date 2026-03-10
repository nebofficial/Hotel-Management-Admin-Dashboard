"use client";

import { Card } from "@/components/ui/card";

type Summary = Record<
  string,
  {
    connected: number;
    disconnected: number;
    error: number;
  }
>;

type Props = {
  summary: Summary;
};

export function IntegrationStatusPanel({ summary }: Props) {
  const entries = Object.entries(summary || {});

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">Integration Status Monitoring</p>
        <p className="text-[11px] text-slate-300">
          See connected integrations, last errors, and overall health at a glance.
        </p>
      </div>
      <div className="p-4 text-xs space-y-2">
        {entries.length === 0 ? (
          <p className="text-slate-300">No integration records yet.</p>
        ) : (
          entries.map(([type, s]) => (
            <div
              key={type}
              className="flex items-center justify-between border-b border-slate-800 last:border-0 pb-1.5 last:pb-0"
            >
              <span className="capitalize text-slate-100">
                {type.replace(/_/g, " ").toLowerCase()}
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-300">Connected: {s.connected}</span>
                <span className="text-slate-300">Disconnected: {s.disconnected}</span>
                <span className="text-red-300">Error: {s.error}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

