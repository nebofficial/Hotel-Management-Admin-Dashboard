"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type GatewayConfig = {
  provider: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
};

type Props = {
  value: GatewayConfig | null;
  onSave: (config: GatewayConfig) => Promise<void>;
};

const PROVIDERS = ["Stripe", "PayPal", "Razorpay", "Paystack"];

export function OnlineGatewaySettings({ value, onSave }: Props) {
  const [draft, setDraft] = useState<GatewayConfig>(
    value || { provider: "Stripe", apiKey: "", secretKey: "", webhookUrl: "" }
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await onSave(draft);
      setMessage("Gateway configuration saved (test stubbed).");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
          Online Payment Gateway Configuration
        </p>
        <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
          Connect Stripe, PayPal, Razorpay, Paystack or other providers.
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Label className="text-xs">Gateway Provider</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={draft.provider}
            onChange={(e) => setDraft((d) => ({ ...d, provider: e.target.value }))}
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">API Key</Label>
          <Input
            className="h-9 text-xs"
            value={draft.apiKey}
            onChange={(e) => setDraft((d) => ({ ...d, apiKey: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Secret Key</Label>
          <Input
            className="h-9 text-xs"
            type="password"
            value={draft.secretKey}
            onChange={(e) => setDraft((d) => ({ ...d, secretKey: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Webhook URL</Label>
          <Input
            className="h-9 text-xs"
            value={draft.webhookUrl}
            onChange={(e) => setDraft((d) => ({ ...d, webhookUrl: e.target.value }))}
          />
        </div>
        {message && <p className="text-[11px] text-muted-foreground">{message}</p>}
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save & Test Connection"}
        </Button>
      </div>
    </Card>
  );
}

