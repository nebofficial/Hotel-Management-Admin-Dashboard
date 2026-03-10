"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = {
  confirmationMode: "AUTO" | "MANUAL" | null;
  notifyGuest: boolean;
  onChange: (patch: { confirmationMode?: "AUTO" | "MANUAL" | null; notifyGuest?: boolean }) => void;
};

export function PaymentConfirmationSettings({ confirmationMode, notifyGuest, onChange }: Props) {
  const isAuto = confirmationMode !== "MANUAL";

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-800/90 via-slate-800 to-slate-900 text-slate-100">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">Payment Confirmation Settings</p>
        <p className="text-[11px] text-slate-200/80">
          Control how payments are verified and when guests receive notifications.
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-xs">Automatic Confirmation</Label>
            <p className="text-[11px] text-slate-300/80">
              When enabled, successful gateway responses confirm payments automatically.
            </p>
          </div>
          <Switch
            checked={isAuto}
            onCheckedChange={(v) => onChange({ confirmationMode: v ? "AUTO" : "MANUAL" })}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label className="text-xs">Notify Guest</Label>
            <p className="text-[11px] text-slate-300/80">
              Send an email / SMS confirmation when payment status changes.
            </p>
          </div>
          <Switch
            checked={notifyGuest}
            onCheckedChange={(v) => onChange({ notifyGuest: v })}
          />
        </div>
      </div>
    </Card>
  );
}

