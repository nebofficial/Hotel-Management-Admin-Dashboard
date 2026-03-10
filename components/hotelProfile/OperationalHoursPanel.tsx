"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  specialHolidayHours: string;
  onChange: (value: string) => void;
};

export function OperationalHoursPanel({ specialHolidayHours, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 text-slate-50">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">Operational Hours – Special Days</p>
        <p className="text-xs text-slate-300">
          Document exceptions such as holidays, maintenance days, or special events.
        </p>
      </div>
      <div className="p-4 space-y-2">
        <Label className="text-xs text-slate-200">Special Holiday Hours</Label>
        <Textarea
          value={specialHolidayHours}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="e.g. Christmas Eve: 10:00–18:00, New Year’s Day: Closed"
          className="bg-slate-900/70 border-slate-700 text-slate-50"
        />
      </div>
    </Card>
  );
}

