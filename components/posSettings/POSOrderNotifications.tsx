"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Settings = {
  kitchenAlerts: boolean;
  soundAlerts: boolean;
  screenPopups: boolean;
};

type Props = {
  value: Settings;
  onChange: (patch: Partial<Settings>) => void;
};

export function POSOrderNotifications({ value, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-300/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
          Order Notification Settings
        </p>
        <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
          Notify kitchen and service staff about new and updated orders.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Kitchen Order Notifications</Label>
            <p className="text-[11px] text-orange-900/80 dark:text-orange-100/70">
              Send tickets to kitchen screen/printer for new orders.
            </p>
          </div>
          <Switch
            checked={!!value.kitchenAlerts}
            onCheckedChange={(v) => onChange({ kitchenAlerts: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Sound Alerts</Label>
            <p className="text-[11px] text-orange-900/80 dark:text-orange-100/70">
              Play a sound when a new order arrives.
            </p>
          </div>
          <Switch
            checked={!!value.soundAlerts}
            onCheckedChange={(v) => onChange({ soundAlerts: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs">Screen Pop-up Alerts</Label>
            <p className="text-[11px] text-orange-900/80 dark:text-orange-100/70">
              Show toast / pop-up notifications on POS terminals.
            </p>
          </div>
          <Switch
            checked={!!value.screenPopups}
            onCheckedChange={(v) => onChange({ screenPopups: v })}
          />
        </div>
      </div>
    </Card>
  );
}

