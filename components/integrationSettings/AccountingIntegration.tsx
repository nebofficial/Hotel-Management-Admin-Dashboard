"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type Config = {
  provider?: string;
  autoInvoiceSync?: boolean;
  expenseSync?: boolean;
  revenueSync?: boolean;
};

type Props = {
  status: string;
  config: Config;
  onSave: (config: Config) => Promise<void>;
};

export function AccountingIntegration({ status, config, onSave }: Props) {
  const handleChange = (patch: Partial<Config>) => {
    onSave({ ...config, ...patch });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
            Accounting Software Integration
          </p>
          <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
            Sync invoices, expenses, and revenue reports to accounting tools.
          </p>
        </div>
        <span className="text-[11px] text-orange-900/80 dark:text-orange-100/80">
          {status === "connected" ? "Connected" : "Configured"}
        </span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Accounting Provider</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={config.provider || "QuickBooks"}
            onChange={(e) => handleChange({ provider: e.target.value })}
          >
            <option value="QuickBooks">QuickBooks</option>
            <option value="Zoho Books">Zoho Books</option>
            <option value="Xero">Xero</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sync Options</Label>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Auto Invoice Sync</span>
              <Switch
                checked={!!config.autoInvoiceSync}
                onCheckedChange={(v) => handleChange({ autoInvoiceSync: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Expense Sync</span>
              <Switch
                checked={!!config.expenseSync}
                onCheckedChange={(v) => handleChange({ expenseSync: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Revenue Report Sync</span>
              <Switch
                checked={!!config.revenueSync}
                onCheckedChange={(v) => handleChange({ revenueSync: v })}
              />
            </div>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-1"
          onClick={() => onSave(config)}
        >
          Save Accounting Settings
        </Button>
      </div>
    </Card>
  );
}

