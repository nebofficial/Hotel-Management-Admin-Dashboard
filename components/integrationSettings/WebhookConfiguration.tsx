"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Config = {
  endpointUrl?: string;
  bookingCreated?: boolean;
  paymentCompleted?: boolean;
  reservationCancelled?: boolean;
};

type Props = {
  status: string;
  config: Config;
  onSave: (config: Config) => Promise<void>;
};

export function WebhookConfiguration({ status, config, onSave }: Props) {
  const handleChange = (patch: Partial<Config>) => {
    onSave({ ...config, ...patch });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-300 dark:border-slate-600 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Webhook Configuration
          </p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300">
            Send real-time events such as bookings and payments to external systems.
          </p>
        </div>
        <span className="text-[11px] text-slate-700 dark:text-slate-300">
          {status === "connected" ? "Active" : "Configured"}
        </span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Webhook Endpoint URL</Label>
          <Input
            className="h-9 text-xs"
            value={config.endpointUrl || ""}
            onChange={(e) => handleChange({ endpointUrl: e.target.value })}
            placeholder="https://partner-app.com/api/hms/webhooks"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Event Triggers</Label>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Booking Created</span>
              <Switch
                checked={!!config.bookingCreated}
                onCheckedChange={(v) => handleChange({ bookingCreated: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Payment Completed</span>
              <Switch
                checked={!!config.paymentCompleted}
                onCheckedChange={(v) => handleChange({ paymentCompleted: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Reservation Cancelled</span>
              <Switch
                checked={!!config.reservationCancelled}
                onCheckedChange={(v) => handleChange({ reservationCancelled: v })}
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
          Save Webhook Settings
        </Button>
      </div>
    </Card>
  );
}

