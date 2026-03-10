"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  enabled: boolean;
  policy: string;
  onChange: (patch: { enabled?: boolean; policy?: string }) => void;
};

export function CashPaymentSettings({ enabled, policy, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-500/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">Cash Payment Configuration</p>
        <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
          Control when and how cash payments are accepted.
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Enable Cash Payment</Label>
          <Switch checked={enabled} onCheckedChange={(v) => onChange({ enabled: v })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Cash Handling Policy</Label>
          <Textarea
            className="min-h-[70px] text-xs"
            value={policy}
            onChange={(e) => onChange({ policy: e.target.value })}
            placeholder="Describe how front-desk staff should handle cash, change, and receipts."
          />
        </div>
      </div>
    </Card>
  );
}

