"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Config = {
  bookingCom?: boolean;
  agoda?: boolean;
  expedia?: boolean;
  airbnb?: boolean;
  availabilitySync?: boolean;
  bookingImport?: boolean;
  priceSync?: boolean;
};

type Props = {
  status: string;
  config: Config;
  onSave: (config: Config) => Promise<void>;
};

export function OTAIntegration({ status, config, onSave }: Props) {
  const handleToggle = (key: keyof Config, value: boolean) => {
    onSave({ ...config, [key]: value });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-400/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/30 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">OTA Integration</p>
          <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
            Connect Booking.com, Agoda, Expedia, Airbnb and sync availability.
          </p>
        </div>
        <span className="text-[11px] text-sky-900/80 dark:text-sky-100/80">
          {status === "connected" ? "Connected" : "Configured"}
        </span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Connected OTAs</Label>
          <div className="grid grid-cols-2 gap-2">
            {["bookingCom", "agoda", "expedia", "airbnb"].map((key) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-[11px]">
                  {key === "bookingCom"
                    ? "Booking.com"
                    : key === "agoda"
                    ? "Agoda"
                    : key === "expedia"
                    ? "Expedia"
                    : "Airbnb"}
                </span>
                <Switch
                  checked={!!config[key as keyof Config]}
                  onCheckedChange={(v) => handleToggle(key as keyof Config, v)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sync Options</Label>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Room Availability Sync</span>
              <Switch
                checked={!!config.availabilitySync}
                onCheckedChange={(v) => handleToggle("availabilitySync", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Booking Import</span>
              <Switch
                checked={!!config.bookingImport}
                onCheckedChange={(v) => handleToggle("bookingImport", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Price Synchronization</span>
              <Switch
                checked={!!config.priceSync}
                onCheckedChange={(v) => handleToggle("priceSync", v)}
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
          Save OTA Settings
        </Button>
      </div>
    </Card>
  );
}

