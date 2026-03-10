"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Config = {
  provider?: string;
  apiKey?: string;
  senderId?: string;
  deliveryReports?: boolean;
};

type Props = {
  status: string;
  config: Config;
  onSave: (config: Config) => Promise<void>;
};

export function SMSGatewayIntegration({ status, config, onSave }: Props) {
  const handleChange = (patch: Partial<Config>) => {
    onSave({ ...config, ...patch });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-300/10 backdrop-blur">
      <div className="p-4 border-b border-amber-400/40 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">
            SMS Gateway Integration
          </p>
          <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
            Send SMS alerts for bookings, check-ins, OTPs and more.
          </p>
        </div>
        <span className="text-[11px] text-amber-900/80 dark:text-amber-100/80">
          {status === "connected" ? "Connected" : "Configured"}
        </span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">SMS Provider</Label>
          <Input
            className="h-9 text-xs"
            value={config.provider || ""}
            onChange={(e) => handleChange({ provider: e.target.value })}
            placeholder="Twilio, Textlocal, etc."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">API Key</Label>
          <Input
            className="h-9 text-xs"
            value={config.apiKey || ""}
            onChange={(e) => handleChange({ apiKey: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sender ID</Label>
          <Input
            className="h-9 text-xs"
            value={config.senderId || ""}
            onChange={(e) => handleChange({ senderId: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Delivery Reports</Label>
            <Switch
              checked={!!config.deliveryReports}
              onCheckedChange={(v) => handleChange({ deliveryReports: v })}
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSave(config)}
          >
            Save SMS Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}

