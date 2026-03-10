"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  policyNotes: string;
  specialInstructions: string;
  onChange: (field: string, value: string) => void;
};

export function PolicyNotesEditor({
  policyNotes,
  specialInstructions,
  onChange,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-300 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Policy Notes for Guests
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Shown during booking or check-in.
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Guest Policy Description</Label>
          <Textarea
            rows={3}
            value={policyNotes || ""}
            onChange={(e) => onChange("policyNotes", e.target.value)}
            placeholder="e.g. Check-in from 2:00 PM; check-out by 11:00 AM. Early/late may incur charges."
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Special Instructions</Label>
          <Textarea
            rows={2}
            value={specialInstructions || ""}
            onChange={(e) => onChange("specialInstructions", e.target.value)}
            placeholder="e.g. Contact front desk for early check-in requests."
          />
        </div>
      </div>
    </Card>
  );
}
