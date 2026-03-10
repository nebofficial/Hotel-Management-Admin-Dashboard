"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  gracePeriodMinutes: number | string;
  chargeAfterGracePeriod: boolean;
  onChange: (field: string, value: number | string | boolean) => void;
};

export function GracePeriodSettings({
  gracePeriodMinutes,
  chargeAfterGracePeriod,
  onChange,
}: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-rose-500/10 backdrop-blur">
      <div className="p-4 border-b border-orange-500/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
          Grace Period Settings
        </p>
        <p className="text-xs text-orange-900/70 dark:text-orange-100/70">
          Grace period duration and whether to charge after it.
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Grace Period (minutes)</Label>
          <Input
            type="number"
            min={0}
            value={gracePeriodMinutes ?? ""}
            onChange={(e) =>
              onChange("gracePeriodMinutes", e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Charge After Grace Period</Label>
          <Switch
            checked={!!chargeAfterGracePeriod}
            onCheckedChange={(v) => onChange("chargeAfterGracePeriod", v)}
          />
        </div>
      </div>
    </Card>
  );
}
