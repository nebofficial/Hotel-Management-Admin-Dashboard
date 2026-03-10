"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth-context";
import {
  fetchPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  togglePaymentMethodStatus,
  fetchTransactionLogs,
  configurePaymentGateway,
  updatePaymentConfirmationSettings,
} from "@/services/api/paymentMethodsApi";
import { PaymentMethodsHeader } from "./PaymentMethodsHeader";
import { PaymentMethodsTable, type PaymentMethodRow } from "./PaymentMethodsTable";
import { PaymentStatusToggle } from "./PaymentStatusToggle";
import { CashPaymentSettings } from "./CashPaymentSettings";
import { CardPaymentSettings } from "./CardPaymentSettings";
import { OnlineGatewaySettings } from "./OnlineGatewaySettings";
import { BankTransferSettings } from "./BankTransferSettings";
import { PaymentConfirmationSettings } from "./PaymentConfirmationSettings";
import { PaymentTransactionLog, type PaymentTransactionRow } from "./PaymentTransactionLog";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

type GatewayConfig = {
  provider: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
};

type BankConfig = {
  bankName: string;
  accountNumber: string;
  swiftIfsc: string;
  instructions: string;
};

export default function PaymentMethodsDashboard() {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethodRow[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cashEnabled, setCashEnabled] = useState(false);
  const [cashPolicy, setCashPolicy] = useState("");
  const [cardEnabled, setCardEnabled] = useState(false);
  const [cardProviders, setCardProviders] = useState<string[]>([]);
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig | null>(null);
  const [bankConfig, setBankConfig] = useState<BankConfig>({
    bankName: "",
    accountNumber: "",
    swiftIfsc: "",
    instructions: "",
  });
  const [confirmationMode, setConfirmationMode] = useState<"AUTO" | "MANUAL" | null>("AUTO");
  const [notifyGuest, setNotifyGuest] = useState(true);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPaymentMethods(API_BASE, user.hotelId);
      const list = (data.methods || data || []) as any[];
      const mapped: PaymentMethodRow[] = list.map((m) => ({
        id: m.id,
        name: m.name,
        type: m.type,
        active: !!m.active,
        sortOrder: m.sortOrder ?? 1,
        lastUpdatedAt: m.lastUpdatedAt || m.updatedAt || m.createdAt,
      }));
      setMethods(mapped);

      // Derive config state (cash/card/bank/gateway) from methods' config
      list.forEach((m) => {
        const cfg = m.config || {};
        if (m.type === "CASH") {
          setCashEnabled(!!m.active);
          setCashPolicy(cfg.policy || "");
        }
        if (m.type === "CARD") {
          setCardEnabled(!!m.active);
          setCardProviders(Array.isArray(cfg.providers) ? cfg.providers : []);
        }
        if (m.type === "ONLINE") {
          setGatewayConfig(cfg.gateway || null);
        }
        if (m.type === "BANK") {
          setBankConfig({
            bankName: cfg.bankName || "",
            accountNumber: cfg.accountNumber || "",
            swiftIfsc: cfg.swiftIfsc || "",
            instructions: cfg.instructions || "",
          });
        }
        if (m.confirmationMode) {
          setConfirmationMode(m.confirmationMode);
        }
      });

      const tx = await fetchTransactionLogs(API_BASE, user.hotelId, { pageSize: 10 });
      setTransactions((tx.transactions || tx || []) as PaymentTransactionRow[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load payment settings");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const overview = useMemo(() => {
    const enabled = methods.filter((m) => m.active).length;
    const online = methods.filter((m) => m.type === "ONLINE" && m.active).length;
    const today = transactions.filter(
      (t) => new Date(t.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const pending = transactions.filter((t) => t.status === "PENDING").length;
    return { enabled, online, today, pending };
  }, [methods, transactions]);

  const ensureSpecialMethod = async (
    type: "CASH" | "CARD" | "ONLINE" | "BANK",
    name: string,
    configPatch: any
  ) => {
    if (!user?.hotelId) return;
    const existing = (await fetchPaymentMethods(API_BASE, user.hotelId)).methods?.find(
      (m: any) => m.type === type
    );
    if (existing) {
      const mergedConfig = { ...(existing.config || {}), ...configPatch };
      await updatePaymentMethod(API_BASE, user.hotelId, existing.id, {
        name: existing.name || name,
        type,
        config: mergedConfig,
        active: existing.active,
        sortOrder: existing.sortOrder || 1,
      });
    } else {
      await createPaymentMethod(API_BASE, user.hotelId, {
        name,
        type,
        config: configPatch,
        active: true,
        sortOrder: 1,
      });
    }
    await load();
  };

  const handleToggleMethod = async (m: PaymentMethodRow) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const data = await togglePaymentMethodStatus(API_BASE, user.hotelId, m.id, !m.active);
      const updated = (data.method || data) as any;
      setMethods((prev) =>
        prev.map((x) =>
          x.id === updated.id
            ? {
                ...x,
                active: !!updated.active,
                lastUpdatedAt: updated.lastUpdatedAt || updated.updatedAt,
              }
            : x
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCash = async () => {
    await ensureSpecialMethod("CASH", "Cash", { policy: cashPolicy });
  };

  const handleSaveCard = async () => {
    await ensureSpecialMethod("CARD", "Card", { providers: cardProviders });
  };

  const handleSaveBank = async () => {
    await ensureSpecialMethod("BANK", "Bank Transfer", bankConfig);
  };

  const handleSaveGateway = async (config: GatewayConfig) => {
    if (!user?.hotelId) return;
    const data = await fetchPaymentMethods(API_BASE, user.hotelId);
    let online = (data.methods || []).find((m: any) => m.type === "ONLINE");
    if (!online) {
      const created = await createPaymentMethod(API_BASE, user.hotelId, {
        name: config.provider,
        type: "ONLINE",
        config: { gateway: config },
        active: true,
        sortOrder: 1,
      });
      online = created.method || created;
    } else {
      await configurePaymentGateway(API_BASE, user.hotelId, online.id, config);
    }
    setGatewayConfig(config);
    await load();
  };

  const handleSaveConfirmation = async () => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      await updatePaymentConfirmationSettings(API_BASE, user.hotelId, {
        confirmationMode,
      });
      // notifyGuest is only on client side for now; would be wired to notification preferences later.
    } finally {
      setSaving(false);
    }
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <PaymentMethodsHeader onAdd={() => {}} />
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to manage payment methods.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <PaymentMethodsHeader onAdd={() => {}} />
        <p className="text-sm text-muted-foreground">Loading payment settings...</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <PaymentMethodsHeader onAdd={async () => {
        // For now, quickly create a disabled placeholder method; full modal could be added later.
        if (!user?.hotelId) return;
        const name = prompt("Payment method name (e.g. Custom Wallet)");
        if (!name) return;
        setSaving(true);
        try {
          const created = await createPaymentMethod(API_BASE, user.hotelId, {
            name,
            type: "ONLINE",
            config: {},
            active: false,
            sortOrder: methods.length + 1,
          });
          const m = created.method || created;
          setMethods((prev) => [
            ...prev,
            {
              id: m.id,
              name: m.name,
              type: m.type,
              active: !!m.active,
              sortOrder: m.sortOrder ?? 1,
              lastUpdatedAt: m.lastUpdatedAt || m.updatedAt,
            },
          ]);
        } finally {
          setSaving(false);
        }
      }} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <UICard className="border-0 bg-gradient-to-br from-emerald-400/10 via-emerald-300/10 to-teal-400/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-emerald-900/80 font-medium">Enabled Payment Methods</p>
            <p className="text-xl font-semibold text-emerald-900">{overview.enabled}</p>
          </CardContent>
        </UICard>
        <UICard className="border-0 bg-gradient-to-br from-emerald-500/10 via-lime-400/10 to-emerald-300/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-emerald-900/80 font-medium">Online Payment Gateways</p>
            <p className="text-xl font-semibold text-emerald-900">{overview.online}</p>
          </CardContent>
        </UICard>
        <UICard className="border-0 bg-gradient-to-br from-sky-400/10 via-sky-300/10 to-indigo-300/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-sky-900/80 font-medium">Total Transactions Today</p>
            <p className="text-xl font-semibold text-sky-900">{overview.today}</p>
          </CardContent>
        </UICard>
        <UICard className="border-0 bg-gradient-to-br from-rose-400/10 via-red-400/10 to-rose-300/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-rose-900/80 font-medium">Pending Confirmations</p>
            <p className="text-xl font-semibold text-rose-900">{overview.pending}</p>
          </CardContent>
        </UICard>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)] gap-4">
        <PaymentMethodsTable
          methods={methods}
          onEdit={(m) => {
            // For now, just toggle status via dialog-less action
            alert(`Edit for "${m.name}" can be extended later; currently you can toggle or configure via panels.`);
          }}
          onToggle={handleToggleMethod}
        />

        <div className="space-y-3">
          <CashPaymentSettings
            enabled={cashEnabled}
            policy={cashPolicy}
            onChange={(p) => {
              if (p.enabled !== undefined) setCashEnabled(p.enabled);
              if (p.policy !== undefined) setCashPolicy(p.policy);
            }}
          />
          <div className="flex justify-end">
            <Button size="xs" variant="outline" onClick={handleSaveCash} disabled={saving}>
              Save Cash Settings
            </Button>
          </div>

          <CardPaymentSettings
            enabled={cardEnabled}
            providers={cardProviders}
            onChange={(p) => {
              if (p.enabled !== undefined) setCardEnabled(p.enabled);
              if (p.providers) setCardProviders(p.providers);
            }}
          />
          <div className="flex justify-end">
            <Button size="xs" variant="outline" onClick={handleSaveCard} disabled={saving}>
              Save Card Settings
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)] gap-4">
        <div className="space-y-3">
          <OnlineGatewaySettings value={gatewayConfig} onSave={handleSaveGateway} />
          <BankTransferSettings
            value={bankConfig}
            onChange={(patch) => setBankConfig((prev) => ({ ...prev, ...patch }))}
          />
          <div className="flex justify-end">
            <Button size="xs" variant="outline" onClick={handleSaveBank} disabled={saving}>
              Save Bank Settings
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <PaymentConfirmationSettings
            confirmationMode={confirmationMode}
            notifyGuest={notifyGuest}
            onChange={(p) => {
              if (p.confirmationMode !== undefined) setConfirmationMode(p.confirmationMode);
              if (p.notifyGuest !== undefined) setNotifyGuest(p.notifyGuest);
            }}
          />
          <div className="flex justify-end">
            <Button size="xs" variant="outline" onClick={handleSaveConfirmation} disabled={saving}>
              Save Confirmation Settings
            </Button>
          </div>
          <PaymentTransactionLog transactions={transactions} />
        </div>
      </section>
    </main>
  );
}

