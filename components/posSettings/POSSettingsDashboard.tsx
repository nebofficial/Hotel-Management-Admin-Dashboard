"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth-context";
import { fetchPOSSettings, updatePOSSettings } from "@/services/api/posSettingsApi";
import { POSSettingsHeader } from "./POSSettingsHeader";
import { POSTerminalSettings } from "./POSTerminalSettings";
import { POSPrinterSettings } from "./POSPrinterSettings";
import { POSTableManagement } from "./POSTableManagement";
import { POSMenuCategories } from "./POSMenuCategories";
import { POSOrderNotifications } from "./POSOrderNotifications";
import { POSTaxSettings } from "./POSTaxSettings";
import { POSReceiptFormat } from "./POSReceiptFormat";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

type POSState = {
  defaultTerminalName: string;
  terminalLocation: string;
  autoLoginEnabled: boolean;
  printerConfig: { device: string; type: string; autoPrint: boolean };
  tableLayout: { tables: { id: string; name: string; capacity: number; zone: string }[] };
  menuCategories: { id: string; name: string; sortOrder: number }[];
  orderNotifications: { kitchenAlerts: boolean; soundAlerts: boolean; screenPopups: boolean };
  taxSettings: { applyGST: boolean; applyServiceCharge: boolean; taxInclusive: boolean };
  receiptFormat: {
    header: string;
    showOrderDetails: boolean;
    showTaxBreakdown: boolean;
    footerMessage: string;
  };
};

export default function POSSettingsDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState<POSState | null>(null);
  const [initialState, setInitialState] = useState<POSState | null>(null);
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
      const data = await fetchPOSSettings(API_BASE, user.hotelId);
      const s = data.settings || data || {};
      const next: POSState = {
        defaultTerminalName: s.defaultTerminalName || "Main POS",
        terminalLocation: s.terminalLocation || "RESTAURANT",
        autoLoginEnabled: !!s.autoLoginEnabled,
        printerConfig: {
          device: s.printerConfig?.device || "Default Printer",
          type: s.printerConfig?.type || "THERMAL_80MM",
          autoPrint: s.printerConfig?.autoPrint !== false,
        },
        tableLayout: {
          tables: Array.isArray(s.tableLayout?.tables) ? s.tableLayout.tables : [],
        },
        menuCategories: Array.isArray(s.menuCategories) ? s.menuCategories : [],
        orderNotifications: {
          kitchenAlerts: s.orderNotifications?.kitchenAlerts !== false,
          soundAlerts: s.orderNotifications?.soundAlerts !== false,
          screenPopups: s.orderNotifications?.screenPopups !== false,
        },
        taxSettings: {
          applyGST: s.taxSettings?.applyGST !== false,
          applyServiceCharge: s.taxSettings?.applyServiceCharge !== false,
          taxInclusive: !!s.taxSettings?.taxInclusive,
        },
        receiptFormat: {
          header: s.receiptFormat?.header || "Thank you for dining with us!",
          showOrderDetails: s.receiptFormat?.showOrderDetails !== false,
          showTaxBreakdown: s.receiptFormat?.showTaxBreakdown !== false,
          footerMessage: s.receiptFormat?.footerMessage || "Powered by HMS POS",
        },
      };
      setState(next);
      setInitialState(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load POS settings");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePatch = (patch: Partial<POSState>) => {
    setState((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleSave = async () => {
    if (!user?.hotelId || !state) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        defaultTerminalName: state.defaultTerminalName,
        terminalLocation: state.terminalLocation,
        autoLoginEnabled: state.autoLoginEnabled,
        printerConfig: state.printerConfig,
        tableLayout: state.tableLayout,
        menuCategories: state.menuCategories,
        orderNotifications: state.orderNotifications,
        taxSettings: state.taxSettings,
        receiptFormat: state.receiptFormat,
      };
      const data = await updatePOSSettings(API_BASE, user.hotelId, payload);
      const s = data.settings || data || payload;
      const next = { ...state, ...s };
      setState(next);
      setInitialState(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save POS settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialState) setState({ ...initialState });
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <POSSettingsHeader onSave={() => {}} onReset={() => {}} saving={false} />
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to manage POS settings.
        </p>
      </main>
    );
  }

  if (loading || !state) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <POSSettingsHeader onSave={() => {}} onReset={() => {}} saving={false} />
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading POS settings..." : "No POS settings found."}
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <POSSettingsHeader onSave={handleSave} onReset={handleReset} saving={saving} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)] gap-4">
        <div className="space-y-3">
          <POSTerminalSettings
            terminalName={state.defaultTerminalName}
            location={state.terminalLocation}
            autoLogin={state.autoLoginEnabled}
            onChange={(patch) =>
              handlePatch({
                defaultTerminalName: patch.terminalName ?? state.defaultTerminalName,
                terminalLocation: patch.location ?? state.terminalLocation,
                autoLoginEnabled:
                  patch.autoLogin !== undefined ? patch.autoLogin : state.autoLoginEnabled,
              })
            }
          />
          <POSPrinterSettings
            value={state.printerConfig}
            onChange={(patch) => handlePatch({ printerConfig: { ...state.printerConfig, ...patch } })}
          />
          <POSTableManagement
            value={state.tableLayout}
            onChange={(layout) => handlePatch({ tableLayout: layout })}
          />
        </div>

        <div className="space-y-3">
          <POSMenuCategories
            value={state.menuCategories}
            onChange={(cats) => handlePatch({ menuCategories: cats })}
          />
          <POSOrderNotifications
            value={state.orderNotifications}
            onChange={(patch) =>
              handlePatch({ orderNotifications: { ...state.orderNotifications, ...patch } })
            }
          />
          <POSTaxSettings
            value={state.taxSettings}
            onChange={(patch) =>
              handlePatch({ taxSettings: { ...state.taxSettings, ...patch } })
            }
          />
          <POSReceiptFormat
            value={state.receiptFormat}
            onChange={(patch) =>
              handlePatch({ receiptFormat: { ...state.receiptFormat, ...patch } })
            }
          />
        </div>
      </section>
    </main>
  );
}

