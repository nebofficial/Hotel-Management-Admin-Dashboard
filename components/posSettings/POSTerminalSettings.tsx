"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  terminalName: string;
  location: string;
  autoLogin: boolean;
  onChange: (patch: { terminalName?: string; location?: string; autoLogin?: boolean }) => void;
};

export function POSTerminalSettings({ terminalName, location, autoLogin, onChange }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-mint-300/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/30">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
          POS Terminal Settings
        </p>
        <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
          Control default POS terminal behaviour.
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Default POS Terminal Name</Label>
          <Input
            className="h-9 text-xs"
            value={terminalName}
            onChange={(e) => onChange({ terminalName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Terminal Location</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={location}
            onChange={(e) => onChange({ location: e.target.value })}
          >
            <option value="RESTAURANT">Restaurant</option>
            <option value="BAR">Bar</option>
            <option value="ROOM_SERVICE">Room Service</option>
            <option value="CAFE">Cafe</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Auto Login</Label>
          <Switch
            checked={autoLogin}
            onCheckedChange={(v) => onChange({ autoLogin: v })}
          />
        </div>
      </div>
    </Card>
  );
}

