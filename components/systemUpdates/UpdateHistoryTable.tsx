"use client";

import { Card } from "@/components/ui/card";
import type { UpdateHistoryItem } from "./SystemUpdatesDashboard";

type Props = {
  items: UpdateHistoryItem[];
};

export function UpdateHistoryTable({ items }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/15 via-purple-500/10 to-fuchsia-500/15 backdrop-blur">
      <div className="p-4 border-b border-violet-500/40">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
          Update History
        </p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Review previously installed updates and security patches.
        </p>
      </div>
      <div className="p-4 text-xs">
        {items.length === 0 ? (
          <p className="text-[11px] text-slate-700 dark:text-slate-200">
            No update history is available yet.
          </p>
        ) : (
          <div className="max-h-64 overflow-auto rounded-lg border border-violet-500/30 bg-white/80 dark:bg-slate-950/40">
            <table className="min-w-full text-[11px]">
              <thead>
                <tr className="border-b border-violet-500/30 bg-violet-500/10 text-left">
                  <th className="px-3 py-2 font-medium">Version</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Installed At</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-violet-500/10 last:border-0"
                  >
                    <td className="px-3 py-1.5 align-top">
                      <div className="font-semibold text-[12px]">
                        {item.version}
                      </div>
                      {item.title && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          {item.title}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-1.5 align-top capitalize">
                      {item.type}
                    </td>
                    <td className="px-3 py-1.5 align-top">
                      {new Date(item.installedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}

