"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { testIntegration as testApi } from "@/services/api/integrationSettingsApi";
import { useAuth } from "@/app/auth-context";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export type IntegrationRecord = {
  id?: string;
  type: string;
  provider: string;
  name?: string;
  enabled: boolean;
  status?: string;
  config?: any;
  lastSyncedAt?: string | null;
  lastError?: string | null;
};

type Props = {
  record?: IntegrationRecord | null;
  onConnectOrUpdate: (payload: {
    provider: string;
    name?: string;
    enabled: boolean;
    config: any;
    id?: string;
  }) => Promise<void>;
  onRecordUpdate: (rec: IntegrationRecord) => void;
};

export function PaymentGatewayIntegration({
  record,
  onConnectOrUpdate,
  onRecordUpdate,
}: Props) {
  const { user } = useAuth();
  const [provider, setProvider] = useState(record?.provider || "Stripe");
  const [apiKey, setApiKey] = useState(record?.config?.apiKey || "");
  const [secretKey, setSecretKey] = useState(record?.config?.secretKey || "");
  const [webhookUrl, setWebhookUrl] = useState(record?.config?.webhookUrl || "");
  const [enabled, setEnabled] = useState(record?.enabled ?? false);
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSave = async () => {
    setConnecting(true);
    setTestResult(null);
    try {
      await onConnectOrUpdate({
        id: record?.id,
        provider,
        name: `${provider} Gateway`,
        enabled,
        config: { apiKey, secretKey, webhookUrl },
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleTest = async () => {
    if (!user?.hotelId || !record?.id) return;
    setTesting(true);
    setTestResult(null);
    try {
      const data = await testApi(API_BASE, user.hotelId, record.id);
      if (data?.result?.message) {
        setTestResult(data.result.message);
      }
      if (data?.item) {
        onRecordUpdate(data.item);
      }
    } catch (e: any) {
      setTestResult(e?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  const status = record?.status || "disconnected";

  return (
    <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-teal-400/10 backdrop-blur">
      <div className="p-4 border-b border-emerald-500/30 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-50">
            Payment Gateway Integration
          </p>
          <p className="text-[11px] text-emerald-900/70 dark:text-emerald-100/80">
            Connect Stripe, Razorpay, PayPal and other gateways.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className={
              status === "connected"
                ? "text-emerald-700 dark:text-emerald-300"
                : status === "error"
                ? "text-red-600 dark:text-red-300"
                : "text-slate-500 dark:text-slate-300"
            }
          >
            {status === "connected"
              ? "Connected"
              : status === "error"
              ? "Error"
              : "Disconnected"}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
        </div>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Gateway Provider</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="Stripe">Stripe</option>
            <option value="Razorpay">Razorpay</option>
            <option value="PayPal">PayPal</option>
            <option value="Paystack">Paystack</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">API Key</Label>
          <Input
            className="h-9 text-xs"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="pk_live_..."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Secret Key</Label>
          <Input
            type="password"
            className="h-9 text-xs"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="sk_live_..."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Webhook URL</Label>
          <Input
            className="h-9 text-xs"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-hotel.com/api/webhooks/payments"
          />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Enable Gateway</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={connecting}
              onClick={handleSave}
            >
              {connecting ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={testing || !record?.id}
              onClick={handleTest}
            >
              {testing ? "Testing..." : "Test"}
            </Button>
          </div>
        </div>
        {testResult && (
          <p className="text-[11px] text-emerald-900/80 dark:text-emerald-100/80">
            {testResult}
          </p>
        )}
      </div>
    </Card>
  );
}

