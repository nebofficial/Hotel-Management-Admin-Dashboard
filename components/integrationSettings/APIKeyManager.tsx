"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Config = {
  currentKey?: string;
  createdAt?: string;
  scopes?: string[];
};

type Props = {
  status: string;
  config: Config;
  onGenerate: () => Promise<void>;
  onRevoke: () => Promise<void>;
};

export function APIKeyManager({ status, config, onGenerate, onRevoke }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-amber-500/10 backdrop-blur">
      <div className="p-4 border-b border-red-500/40 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-red-900 dark:text-red-50">
            API Key Management
          </p>
          <p className="text-[11px] text-red-900/70 dark:text-red-100/80">
            Generate secure API keys for third-party applications.
          </p>
        </div>
        <span className="text-[11px] text-red-900/80 dark:text-red-100/80">
          {status === "connected" ? "Active" : "No active key"}
        </span>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Current API Key</Label>
          <div className="rounded-md bg-slate-900 text-slate-100 px-3 py-2 text-[11px] font-mono break-all min-h-[38px]">
            {config.currentKey ? "••••••••••••••••••••••" : "No key generated yet"}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Button type="button" size="sm" className="bg-red-600 text-white" onClick={onGenerate}>
            Generate New Key
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!config.currentKey}
            onClick={onRevoke}
          >
            Revoke Key
          </Button>
        </div>
        {config.createdAt && (
          <p className="text-[11px] text-red-900/80 dark:text-red-100/80">
            Created at: {new Date(config.createdAt).toLocaleString()}
          </p>
        )}
      </div>
    </Card>
  );
}

