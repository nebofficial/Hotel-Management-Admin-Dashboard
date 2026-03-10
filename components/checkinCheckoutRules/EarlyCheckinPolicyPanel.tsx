"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  allowEarlyCheckin: boolean;
  earliestCheckinTime: string;
  earlyCheckinFeeType: string;
  earlyCheckinFee: number | string;
  onChange: (field: string, value: string | number | boolean) => void;
};

export function EarlyCheckinPolicyPanel(props: Props) {
  const { allowEarlyCheckin, earliestCheckinTime, earlyCheckinFeeType, earlyCheckinFee, onChange } = props;
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/30">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">Early Check-in Policy</p>
        <p className="text-xs text-sky-900/70 dark:text-sky-100/70">Allow and charge for early arrival.</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Allow Early Check-in</Label>
          <Switch checked={!!allowEarlyCheckin} onCheckedChange={(v) => onChange("allowEarlyCheckin", v)} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Earliest Check-in Time</Label>
          <Input type="time" value={earliestCheckinTime || ""} onChange={(e) => onChange("earliestCheckinTime", e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Charge Type</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={earlyCheckinFeeType || "fixed"} onChange={(e) => onChange("earlyCheckinFeeType", e.target.value)}>
              <option value="fixed">Fixed amount</option>
              <option value="percentage">Percentage</option>
              <option value="hourly">Hourly rate</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Additional Charge</Label>
            <Input type="number" min={0} step={0.01} value={earlyCheckinFee ?? ""} onChange={(e) => onChange("earlyCheckinFee", e.target.value === "" ? 0 : Number(e.target.value))} />
          </div>
        </div>
      </div>
    </Card>
  );
}
