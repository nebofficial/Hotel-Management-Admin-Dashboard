"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = {
  earlyCheckinFee: number | string;
  lateCheckoutFee: number | string;
  hourlyExtensionRate: number | string;
  onChange: (field: string, value: number | string) => void;
};

export function AdditionalChargesPanel(props: Props) {
  const { earlyCheckinFee, lateCheckoutFee, hourlyExtensionRate, onChange } = props;
  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-400/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Additional Charges Configuration</p>
        <p className="text-xs text-amber-900/70 dark:text-amber-100/70">Early check-in fee, late check-out fee, and hourly extension rate.</p>
      </div>
      <div className="p-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-xs">Early Check-in Fee</Label>
          <Input type="number" min={0} step={0.01} value={earlyCheckinFee ?? ""} onChange={(e) => onChange("earlyCheckinFee", e.target.value === "" ? 0 : Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Late Check-out Fee</Label>
          <Input type="number" min={0} step={0.01} value={lateCheckoutFee ?? ""} onChange={(e) => onChange("lateCheckoutFee", e.target.value === "" ? 0 : Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Hourly Extension Rate</Label>
          <Input type="number" min={0} step={0.01} value={hourlyExtensionRate ?? ""} onChange={(e) => onChange("hourlyExtensionRate", e.target.value === "" ? 0 : Number(e.target.value))} />
        </div>
      </div>
    </Card>
  );
}
