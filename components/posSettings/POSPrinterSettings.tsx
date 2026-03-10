"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type PrinterConfig = {
  device: string;
  type: string;
  autoPrint: boolean;
};

type Props = {
  value: PrinterConfig;
  onChange: (patch: Partial<PrinterConfig>) => void;
};

export function POSPrinterSettings({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-500/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/30">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">POS Printer Configuration</p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Set up receipt printers for POS orders.
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Printer Device Name</Label>
          <Input
            className="h-9 text-xs"
            value={value.device}
            onChange={(e) => onChange({ device: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Receipt Printer Type</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={value.type}
            onChange={(e) => onChange({ type: e.target.value })}
          >
            <option value="THERMAL_80MM">Thermal 80mm</option>
            <option value="THERMAL_58MM">Thermal 58mm</option>
            <option value="A4">A4 Printer</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Auto Print Receipt</Label>
          <Switch
            checked={value.autoPrint}
            onCheckedChange={(v) => onChange({ autoPrint: v })}
          />
        </div>
      </div>
    </Card>
  );
}

