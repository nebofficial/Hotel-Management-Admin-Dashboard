"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type TaxSettings = {
  applyGST: boolean;
  applyServiceCharge: boolean;
  taxInclusive: boolean;
};

type Props = {
  value: TaxSettings;
  onChange: (patch: Partial<TaxSettings>) => void;
};

export function POSTaxSettings({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-red-400/40">
        <p className="text-sm font-semibold text-red-900 dark:text-red-50">
          Tax Application for POS Sales
        </p>
        <p className="text-[11px] text-red-900/70 dark:text-red-100/80">
          Ensure POS orders apply correct GST, VAT, and service charges.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Apply GST / VAT</Label>
          <Switch
            checked={!!value.applyGST}
            onCheckedChange={(v) => onChange({ applyGST: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Apply Service Charge</Label>
          <Switch
            checked={!!value.applyServiceCharge}
            onCheckedChange={(v) => onChange({ applyServiceCharge: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Tax Included in Menu Prices</Label>
          <Switch
            checked={!!value.taxInclusive}
            onCheckedChange={(v) => onChange({ taxInclusive: v })}
          />
        </div>
      </div>
    </Card>
  );
}

