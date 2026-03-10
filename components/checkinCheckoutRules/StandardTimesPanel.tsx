"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  standardCheckInTime: string;
  standardCheckOutTime: string;
  onChange: (field: string, value: string) => void;
};

export function StandardTimesPanel({
  standardCheckInTime,
  standardCheckOutTime,
  onChange,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/30">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          Standard Check-in / Check-out Times
        </p>
        <p className="text-xs text-emerald-900/70 dark:text-emerald-100/70">
          Default guest arrival and departure times.
        </p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs">Standard Check-in Time</Label>
          <Input
            type="time"
            value={standardCheckInTime || "14:00"}
            onChange={(e) => onChange("standardCheckInTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Standard Check-out Time</Label>
          <Input
            type="time"
            value={standardCheckOutTime || "11:00"}
            onChange={(e) => onChange("standardCheckOutTime", e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
