"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  autoCheckoutAfterMinutes: number | string;
  sendCheckoutReminder: boolean;
  onChange: (field: string, value: number | string | boolean) => void;
};

export function AutoCheckoutSettings(props: Props) {
  const { autoCheckoutAfterMinutes, sendCheckoutReminder, onChange } = props;
  return (
    <Card className="border-0 bg-gradient-to-br from-rose-500/10 via-red-400/5 to-orange-500/10 backdrop-blur">
      <div className="p-4 border-b border-rose-500/40">
        <p className="text-sm font-semibold text-rose-900 dark:text-rose-100">Automatic Checkout Settings</p>
        <p className="text-xs text-rose-900/70 dark:text-rose-100/70">Auto checkout after time limit and reminder notifications.</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Auto Checkout After (minutes, 0 = disabled)</Label>
          <Input type="number" min={0} value={autoCheckoutAfterMinutes ?? ""} onChange={(e) => onChange("autoCheckoutAfterMinutes", e.target.value === "" ? 0 : Number(e.target.value))} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Send Checkout Reminder Notifications</Label>
          <Switch checked={!!sendCheckoutReminder} onCheckedChange={(v) => onChange("sendCheckoutReminder", v)} />
        </div>
      </div>
    </Card>
  );
}
