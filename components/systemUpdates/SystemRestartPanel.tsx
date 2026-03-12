"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RestartState = {
  mode?: string;
  scheduledFor?: string;
  message?: string;
  acknowledgedAt?: string;
} | null;

type Props = {
  restartState: RestartState;
  onRestartNow: () => Promise<void>;
  onScheduleRestart: (isoTime: string) => Promise<void>;
};

export function SystemRestartPanel({
  restartState,
  onRestartNow,
  onScheduleRestart,
}: Props) {
  const [time, setTime] = useState("");
  const [working, setWorking] = useState(false);

  const schedule = async () => {
    if (!time) return;
    setWorking(true);
    try {
      const now = new Date();
      const [hours, minutes] = time.split(":").map((v) => parseInt(v, 10));
      const scheduled = new Date(now);
      scheduled.setHours(hours || 0, minutes || 0, 0, 0);
      await onScheduleRestart(scheduled.toISOString());
    } finally {
      setWorking(false);
    }
  };

  const restartNow = async () => {
    setWorking(true);
    try {
      await onRestartNow();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/20 via-amber-500/15 to-red-500/20 backdrop-blur">
      <div className="p-4 border-b border-orange-500/50">
        <p className="text-sm font-semibold text-orange-50">
          System Restart After Update
        </p>
        <p className="text-[11px] text-orange-100/90">
          Restart immediately or schedule a restart window after applying
          updates.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs text-orange-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-medium">Immediate restart</p>
            <p className="text-[11px] text-orange-100/90">
              Use when it is safe to restart the application without impacting
              active users.
            </p>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-400 text-white"
              onClick={() => {
                void restartNow();
              }}
              disabled={working}
            >
              Restart now
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-medium">Schedule restart</p>
            <p className="text-[11px] text-orange-100/90">
              Choose a time window, for example during low traffic hours.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-7 w-full rounded-md border border-orange-300/70 bg-orange-900/40 px-2 text-[11px] text-orange-50 placeholder:text-orange-100/70"
              />
              <Button
                size="sm"
                variant="outline"
                className="border-orange-200/80 text-orange-50 hover:bg-orange-500/40 hover:text-white"
                onClick={() => {
                  void schedule();
                }}
                disabled={working || !time}
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>

        {restartState && (
          <div className="mt-2 rounded-md bg-orange-900/50 border border-orange-400/70 px-3 py-2 text-[11px]">
            <p className="font-semibold mb-0.5">Last restart action</p>
            {restartState.message && <p>{restartState.message}</p>}
            {restartState.scheduledFor && (
              <p className="mt-0.5 text-orange-100/90">
                Scheduled for{" "}
                {new Date(restartState.scheduledFor).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

