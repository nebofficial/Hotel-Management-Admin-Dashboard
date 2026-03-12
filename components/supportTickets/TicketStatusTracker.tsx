"use client";

import { Card } from "@/components/ui/card";

type Props = {
  status: string;
};

const steps = [
  "Open",
  "In Review",
  "In Progress",
  "Waiting for User",
  "Resolved",
  "Closed",
];

export function TicketStatusTracker({ status }: Props) {
  const currentIndex = steps.findIndex((s) => s === status) ?? 0;

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-3 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
          Ticket Status
        </p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Track the current stage of this request.
        </p>
      </div>
      <div className="p-3 text-[11px] flex flex-col gap-2">
        <div className="flex justify-between items-center gap-1">
          {steps.map((step, index) => {
            const active = index <= currentIndex;
            return (
              <div key={step} className="flex-1 flex items-center gap-1">
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                    active
                      ? "bg-sky-600 text-white"
                      : "bg-sky-100 text-sky-500 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      index < currentIndex
                        ? "bg-sky-500"
                        : "bg-sky-100 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-slate-700 dark:text-slate-200">
          {steps.map((step) => (
            <span key={step} className="flex-1 text-center truncate">
              {step}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

