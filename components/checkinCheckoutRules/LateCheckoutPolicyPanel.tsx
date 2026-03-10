"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  allowLateCheckout: boolean;
  latestCheckoutTime: string;
  lateCheckoutFeeType: string;
  lateCheckoutFee: number | string;
  onChange: (field: string, value: string | number | boolean) => void;
};

export function LateCheckoutPolicyPanel(props: Props) {
  const { allowLateCheckout, latestCheckoutTime, lateCheckoutFeeType, lateCheckoutFee, onChange } = props;
  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-500/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30">
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Late Check-out Policy</p>
        <p className="text-xs text-violet-900/70 dark:text-violet-100/70">Allow and charge for extended departure.</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Allow Late Checkout</Label>
          <Switch checked={!!allowLateCheckout} onCheckedChange={(v) => onChange("allowLateCheckout", v)} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Latest Checkout Time</Label>
          <Input type="time" value={latestCheckoutTime || ""} onChange={(e) => onChange("latestCheckoutTime", e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Charge Type</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={lateCheckoutFeeType || "fixed"} onChange={(e) => onChange("lateCheckoutFeeType", e.target.value)}>
              <option value="fixed">Fixed amount</option>
              <option value="percentage">Percentage</option>
              <option value="hourly">Hourly rate</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Additional Charge</Label>
            <Input type="number" min={0} step={0.01} value={lateCheckoutFee ?? ""} onChange={(e) => onChange("lateCheckoutFee", e.target.value === "" ? 0 : Number(e.target.value))} />
          </div>
        </div>
      </div>
    </Card>
  );
}
