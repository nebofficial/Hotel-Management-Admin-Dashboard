"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type ReceiptFormat = {
  header: string;
  showOrderDetails: boolean;
  showTaxBreakdown: boolean;
  footerMessage: string;
};

type Props = {
  value: ReceiptFormat;
  onChange: (patch: Partial<ReceiptFormat>) => void;
};

export function POSReceiptFormat({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-300 dark:border-slate-600">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">POS Receipt Format</p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Control how POS receipts look for guests.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Receipt Header</Label>
          <Input
            className="h-9 text-xs"
            value={value.header}
            onChange={(e) => onChange({ header: e.target.value })}
            placeholder="Hotel Name / Logo"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Order Details</Label>
          <Switch
            checked={!!value.showOrderDetails}
            onCheckedChange={(v) => onChange({ showOrderDetails: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Tax Breakdown</Label>
          <Switch
            checked={!!value.showTaxBreakdown}
            onCheckedChange={(v) => onChange({ showTaxBreakdown: v })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Footer Message</Label>
          <Textarea
            className="min-h-[70px] text-xs"
            value={value.footerMessage}
            onChange={(e) => onChange({ footerMessage: e.target.value })}
            placeholder="Thank you message, payment instructions, or terms."
          />
        </div>
      </div>
    </Card>
  );
}

