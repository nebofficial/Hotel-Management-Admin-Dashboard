"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type BankConfig = {
  bankName: string;
  accountNumber: string;
  swiftIfsc: string;
  instructions: string;
};

type Props = {
  value: BankConfig;
  onChange: (patch: Partial<BankConfig>) => void;
};

export function BankTransferSettings({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-red-400/40">
        <p className="text-sm font-semibold text-red-900 dark:text-red-50">Bank Transfer Setup</p>
        <p className="text-[11px] text-red-900/70 dark:text-red-100/80">
          Configure bank details for corporate bookings and manual payments.
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Bank Name</Label>
          <Input
            className="h-9 text-xs"
            value={value.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Account Number</Label>
          <Input
            className="h-9 text-xs"
            value={value.accountNumber}
            onChange={(e) => onChange({ accountNumber: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">SWIFT / IFSC Code</Label>
          <Input
            className="h-9 text-xs"
            value={value.swiftIfsc}
            onChange={(e) => onChange({ swiftIfsc: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Transfer Instructions</Label>
          <Textarea
            className="min-h-[70px] text-xs"
            value={value.instructions}
            onChange={(e) => onChange({ instructions: e.target.value })}
            placeholder="Share payment reference format, timing, and proof of payment instructions."
          />
        </div>
      </div>
    </Card>
  );
}

