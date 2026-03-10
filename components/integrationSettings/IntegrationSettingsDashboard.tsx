"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth-context";
import {
  fetchIntegrations,
  connectIntegration,
  updateIntegration,
  disconnectIntegration,
} from "@/services/api/integrationSettingsApi";
import { IntegrationSettingsHeader } from "./IntegrationSettingsHeader";
import { PaymentGatewayIntegration, IntegrationRecord } from "./PaymentGatewayIntegration";
import { OTAIntegration } from "./OTAIntegration";
import { EmailServiceIntegration } from "./EmailServiceIntegration";
import { SMSGatewayIntegration } from "./SMSGatewayIntegration";
import { AccountingIntegration } from "./AccountingIntegration";
import { APIKeyManager } from "./APIKeyManager";
import { WebhookConfiguration } from "./WebhookConfiguration";
import { IntegrationStatusPanel } from "./IntegrationStatusPanel";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

type IntegrationSummary = Record<
  string,
  { connected: number; disconnected: number; error: number }
>;

export default function IntegrationSettingsDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<IntegrationRecord[]>([]);
  const [summary, setSummary] = useState<IntegrationSummary>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIntegrations(API_BASE, user.hotelId);
      setItems(data.items || []);
      setSummary(data.summary || {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load integrations");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const upsertItem = (rec: IntegrationRecord) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === rec.id);
      if (idx === -1) return [...prev, rec];
      const cloned = prev.slice();
      cloned[idx] = rec;
      return cloned;
    });
  };

  const byType = useMemo(() => {
    const map: Record<string, IntegrationRecord[]> = {};
    for (const item of items) {
      if (!map[item.type]) map[item.type] = [];
      map[item.type].push(item);
    }
    return map;
  }, [items]);

  const paymentGateway = byType.PAYMENT_GATEWAY?.[0];
  const otaIntegration = byType.OTA?.[0];
  const emailIntegration = byType.EMAIL?.[0];
  const smsIntegration = byType.SMS?.[0];
  const accountingIntegration = byType.ACCOUNTING?.[0];
  const apiKeyIntegration = byType.API_KEY?.[0];
  const webhookIntegration = byType.WEBHOOK?.[0];

  const ensureConnected = async (type: string, payload: any, existing?: IntegrationRecord) => {
    if (!user?.hotelId) return;
    setSaving(true);
    setError(null);
    try {
      let res;
      if (existing?.id) {
        res = await updateIntegration(API_BASE, user.hotelId, existing.id, {
          name: payload.name,
          enabled: payload.enabled,
          config: payload.config,
          status: payload.enabled ? "connected" : "disconnected",
        });
      } else {
        res = await connectIntegration(API_BASE, user.hotelId, {
          type,
          provider: payload.provider || payload.name || type,
          name: payload.name,
          enabled: payload.enabled,
          config: payload.config,
        });
      }
      if (res?.item) {
        upsertItem(res.item);
        // reload summary lazily
        load();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save integration");
    } finally {
      setSaving(false);
    }
  };

  const handleApiKeyGenerate = async () => {
    await ensureConnected(
      "API_KEY",
      {
        name: "Public API",
        provider: "HMS",
        enabled: true,
        config: {
          currentKey: "generated-key-placeholder",
          createdAt: new Date().toISOString(),
        },
      },
      apiKeyIntegration || undefined
    );
  };

  const handleApiKeyRevoke = async () => {
    if (!user?.hotelId || !apiKeyIntegration?.id) return;
    setSaving(true);
    setError(null);
    try {
      const res = await disconnectIntegration(API_BASE, user.hotelId, apiKeyIntegration.id);
      if (res?.item) {
        upsertItem(res.item);
        load();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to revoke key");
    } finally {
      setSaving(false);
    }
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <IntegrationSettingsHeader saving={false} onRefresh={() => {}} />
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to manage integration settings.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <IntegrationSettingsHeader saving={false} onRefresh={() => {}} />
        <p className="text-sm text-muted-foreground">Loading integration settings...</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <IntegrationSettingsHeader saving={saving} onRefresh={load} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)] gap-4">
        <div className="space-y-3">
          <PaymentGatewayIntegration
            record={paymentGateway}
            onConnectOrUpdate={(payload) =>
              ensureConnected(
                "PAYMENT_GATEWAY",
                payload,
                paymentGateway || undefined
              )
            }
            onRecordUpdate={upsertItem}
          />
          <OTAIntegration
            status={otaIntegration?.status || "disconnected"}
            config={otaIntegration?.config || {}}
            onSave={(config) =>
              ensureConnected(
                "OTA",
                { name: "OTA Connections", provider: "OTA", enabled: true, config },
                otaIntegration || undefined
              )
            }
          />
          <EmailServiceIntegration
            status={emailIntegration?.status || "disconnected"}
            config={emailIntegration?.config || {}}
            onSave={(config) =>
              ensureConnected(
                "EMAIL",
                { name: "SMTP", provider: "SMTP", enabled: true, config },
                emailIntegration || undefined
              )
            }
          />
          <SMSGatewayIntegration
            status={smsIntegration?.status || "disconnected"}
            config={smsIntegration?.config || {}}
            onSave={(config) =>
              ensureConnected(
                "SMS",
                { name: "SMS Gateway", provider: "SMS", enabled: true, config },
                smsIntegration || undefined
              )
            }
          />
        </div>

        <div className="space-y-3">
          <AccountingIntegration
            status={accountingIntegration?.status || "disconnected"}
            config={accountingIntegration?.config || {}}
            onSave={(config) =>
              ensureConnected(
                "ACCOUNTING",
                {
                  name: "Accounting Bridge",
                  provider: config.provider || "QuickBooks",
                  enabled: true,
                  config,
                },
                accountingIntegration || undefined
              )
            }
          />
          <APIKeyManager
            status={apiKeyIntegration?.status || "disconnected"}
            config={apiKeyIntegration?.config || {}}
            onGenerate={handleApiKeyGenerate}
            onRevoke={handleApiKeyRevoke}
          />
          <WebhookConfiguration
            status={webhookIntegration?.status || "disconnected"}
            config={webhookIntegration?.config || {}}
            onSave={(config) =>
              ensureConnected(
                "WEBHOOK",
                {
                  name: "Webhooks",
                  provider: "Webhooks",
                  enabled: true,
                  config,
                },
                webhookIntegration || undefined
              )
            }
          />
          <IntegrationStatusPanel summary={summary} />
        </div>
      </section>
    </main>
  );
}

