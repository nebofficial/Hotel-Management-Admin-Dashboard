"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";

type Item = {
  id: string;
  adminName: string;
  action: string;
  details: any;
  createdAt: string;
};

export function RecentConfigActivity({ items }: { items: Item[] }) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-slate-50 shadow-lg shadow-emerald-500/20">
      <div className="border-b border-emerald-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold">Recent Configuration Activity</span>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-emerald-300/80">
          Last {items.length || 0} changes
        </span>
      </div>
      <ScrollArea className="h-64 px-4 py-3">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400">No recent configuration changes recorded.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-100">{item.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Performed by <span className="font-medium">{item.adminName}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}

