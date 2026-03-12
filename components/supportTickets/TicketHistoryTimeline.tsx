"use client";

import { Card } from "@/components/ui/card";

type HistoryItem = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

type Props = {
  history: HistoryItem[];
};

export function TicketHistoryTimeline({ history }: Props) {
  const items = [...history].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-3 border-b border-slate-700">
        <p className="text-sm font-semibold">Support Response History</p>
        <p className="text-[11px] text-slate-300">
          Complete record of ticket creation, status changes, and activity.
        </p>
      </div>
      <div className="p-3 text-[11px] max-h-48 overflow-auto space-y-2">
        {items.map((h) => (
          <div key={h.id} className="flex gap-2">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div className="flex-1 w-px bg-slate-600" />
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-50">{h.message}</p>
              <p className="text-slate-300">
                {new Date(h.createdAt).toLocaleString()} · {h.type}
              </p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-slate-300">No history entries yet.</p>
        )}
      </div>
    </Card>
  );
}

