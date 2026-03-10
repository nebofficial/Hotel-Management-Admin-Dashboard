"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = {
  enabled: boolean;
  providers: string[];
  onChange: (patch: { enabled?: boolean; providers?: string[] }) => void;
};

const ALL_PROVIDERS = ["Visa", "Mastercard", "RuPay", "Amex"];

export function CardPaymentSettings({ enabled, providers, onChange }: Props) {
  const toggleProvider = (p: string) => {
    const set = new Set(providers || []);
    if (set.has(p)) set.delete(p);
    else set.add(p);
    onChange({ providers: Array.from(set) });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-300/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">Credit / Debit Card Setup</p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Choose supported card providers and enable card payments.
        </p>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Enable Card Payments</Label>
          <Switch checked={enabled} onCheckedChange={(v) => onChange({ enabled: v })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Card Provider Support</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {ALL_PROVIDERS.map((p) => {
              const active = providers?.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProvider(p)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border ${
                    active
                      ? "border-amber-500 bg-amber-500/20 text-amber-900"
                      : "border-amber-200 text-amber-800/80 hover:bg-amber-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

