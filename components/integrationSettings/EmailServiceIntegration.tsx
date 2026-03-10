"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Config = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  fromName?: string;
};

type Props = {
  status: string;
  config: Config;
  onSave: (config: Config) => Promise<void>;
};

export function EmailServiceIntegration({ status, config, onSave }: Props) {
  const handleChange = (patch: Partial<Config>) => {
    onSave({ ...config, ...patch });
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-purple-400/5 to-fuchsia-400/10 backdrop-blur">
      <div className="p-4 border-b border-violet-500/30 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-violet-900 dark:text-violet-50">
            Email Service Integration
          </p>
          <p className="text-[11px] text-violet-900/70 dark:text-violet-100/80">
            Configure SMTP server for confirmations, invoices, and alerts.
          </p>
        </div>
        <span className="text-[11px] text-violet-900/80 dark:text-violet-100/80">
          {status === "connected" ? "Connected" : "Configured"}
        </span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">SMTP Host</Label>
            <Input
              className="h-9 text-xs"
              value={config.host || ""}
              onChange={(e) => handleChange({ host: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">SMTP Port</Label>
            <Input
              type="number"
              className="h-9 text-xs"
              value={config.port || 587}
              onChange={(e) =>
                handleChange({ port: Number(e.target.value || 0) })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Email Username</Label>
            <Input
              className="h-9 text-xs"
              value={config.username || ""}
              onChange={(e) => handleChange({ username: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email Password</Label>
            <Input
              type="password"
              className="h-9 text-xs"
              value={config.password || ""}
              onChange={(e) => handleChange({ password: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">From Name</Label>
          <Input
            className="h-9 text-xs"
            value={config.fromName || ""}
            onChange={(e) => handleChange({ fromName: e.target.value })}
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-1"
          onClick={() => onSave(config)}
        >
          Save Email Settings
        </Button>
      </div>
    </Card>
  );
}

