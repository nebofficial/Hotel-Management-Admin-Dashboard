"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  onSchedule: (payload: {
    frequency: string;
    timeOfDay: string;
    retentionDays: number;
  }) => Promise<void>;
};

export function ScheduledBackupSettings({ onSchedule }: Props) {
  const [frequency, setFrequency] = useState("Daily");
  const [timeOfDay, setTimeOfDay] = useState("02:00");
  const [retentionDays, setRetentionDays] = useState(30);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSchedule({ frequency, timeOfDay, retentionDays });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/40">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          Automatic Scheduled Backups
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Configure how often backups run automatically and how long to keep
          them.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Backup Frequency</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Backup Time</Label>
          <Input
            type="time"
            className="h-9 text-xs"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Retention (days)</Label>
          <Input
            type="number"
            className="h-9 text-xs"
            value={retentionDays}
            onChange={(e) =>
              setRetentionDays(parseInt(e.target.value || "30", 10))
            }
          />
        </div>
        <div className="sm:col-span-3 flex justify-end">
          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 text-white"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

