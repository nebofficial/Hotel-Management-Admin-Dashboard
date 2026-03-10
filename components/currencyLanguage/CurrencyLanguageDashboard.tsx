"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/auth-context";
import { useLanguage } from "@/app/language-context";
import { fetchCurrencySettings, updateCurrencySettings } from "@/services/api/currencyLanguageApi";
import { CurrencySettingsPanel } from "./CurrencySettingsPanel";
import { ExchangeRateManager, type ExchangeRateItem } from "./ExchangeRateManager";
import { LanguageSelector } from "./LanguageSelector";
import { MultiLanguageSupport } from "./MultiLanguageSupport";
import { DateFormatSettings } from "./DateFormatSettings";
import { TimezoneSettings } from "./TimezoneSettings";
import { NumberFormatSettings } from "./NumberFormatSettings";
import { SaveSettingsButton } from "./SaveSettingsButton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export type CurrencyLanguageState = {
  currency: string;
  currencySymbol: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  decimalPrecision: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  currencyRounding: string;
  exchangeRates: ExchangeRateItem[];
  enabledLanguages: string[];
  defaultLanguage: string;
  autoTimeSync: boolean;
};

const defaultState: CurrencyLanguageState = {
  currency: "NRP",
  currencySymbol: "₹",
  language: "English",
  timezone: "UTC+0",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "HH:mm",
  decimalPrecision: 2,
  thousandsSeparator: ",",
  decimalSeparator: ".",
  currencyRounding: "nearest",
  exchangeRates: [],
  enabledLanguages: ["en"],
  defaultLanguage: "en",
  autoTimeSync: true,
};

function toState(settings: Record<string, unknown> | null): CurrencyLanguageState {
  if (!settings) return { ...defaultState };
  let exchangeRates: ExchangeRateItem[] = [];
  if (Array.isArray(settings.exchangeRates)) {
    exchangeRates = settings.exchangeRates.map((r: Record<string, unknown>) => ({
      pair: (r.pair as string) || (r.from && r.to ? `${r.from}_${r.to}` : "USD_EUR"),
      rate: Number(r.rate) || 0,
      lastUpdated: (r.lastUpdated as string) || "",
    }));
  }
  return {
    currency: (settings.currency as string) ?? defaultState.currency,
    currencySymbol: (settings.currencySymbol as string) ?? defaultState.currencySymbol,
    language: (settings.language as string) ?? defaultState.language,
    timezone: (settings.timezone as string) ?? defaultState.timezone,
    dateFormat: (settings.dateFormat as string) ?? defaultState.dateFormat,
    timeFormat: (settings.timeFormat as string) ?? defaultState.timeFormat,
    decimalPrecision: (settings.decimalPrecision as number) ?? defaultState.decimalPrecision,
    thousandsSeparator: (settings.thousandsSeparator as string) ?? defaultState.thousandsSeparator,
    decimalSeparator: (settings.decimalSeparator as string) ?? defaultState.decimalSeparator,
    currencyRounding: (settings.currencyRounding as string) ?? defaultState.currencyRounding,
    exchangeRates,
    enabledLanguages: Array.isArray(settings.enabledLanguages) ? settings.enabledLanguages : defaultState.enabledLanguages,
    defaultLanguage: (settings.defaultLanguage as string) ?? defaultState.defaultLanguage,
    autoTimeSync: (settings.autoTimeSync as boolean) ?? defaultState.autoTimeSync,
  };
}

export default function CurrencyLanguageDashboard() {
  const { user } = useAuth();
  const { refreshLanguage, t } = useLanguage();
  const [state, setState] = useState<CurrencyLanguageState>(defaultState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<CurrencyLanguageState | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrencySettings(API_BASE, user.hotelId);
      const settings = data.settings ?? data;
      const next = toState(settings);
      setState(next);
      setInitialState(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = useCallback(
    (field: keyof CurrencyLanguageState, value: string | number | boolean | string[] | ExchangeRateItem[]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSave = async () => {
    if (!user?.hotelId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        currency: state.currency,
        currencySymbol: state.currencySymbol,
        language: state.language,
        timezone: state.timezone,
        dateFormat: state.dateFormat,
        timeFormat: state.timeFormat,
        decimalPrecision: state.decimalPrecision,
        thousandsSeparator: state.thousandsSeparator,
        decimalSeparator: state.decimalSeparator,
        currencyRounding: state.currencyRounding,
        exchangeRates: state.exchangeRates,
        enabledLanguages: state.enabledLanguages,
        defaultLanguage: state.defaultLanguage,
        autoTimeSync: state.autoTimeSync,
      };
      const data = await updateCurrencySettings(API_BASE, user.hotelId, payload);
      const settings = data.settings ?? data;
      const next = toState(settings);
      setState(next);
      setInitialState(next);
      // Apply selected language immediately so the entire app (sidebar, navbar, etc.) updates
      const savedLanguage = (settings as { language?: string }).language || state.language;
      if (typeof window !== "undefined" && savedLanguage) {
        window.dispatchEvent(new CustomEvent("language-changed", { detail: { languageName: savedLanguage } }));
      }
      await refreshLanguage();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
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
        <h1 className="text-lg font-semibold">{t("currency_language.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("currency_language.state.signin")}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <h1 className="text-lg font-semibold">{t("currency_language.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("currency_language.state.loading")}</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("currency_language.title")}</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t("currency_language.subtitle")}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CurrencySettingsPanel
          currency={state.currency}
          currencySymbol={state.currencySymbol}
          decimalPrecision={state.decimalPrecision}
          onChange={handleChange}
        />
        <ExchangeRateManager exchangeRates={state.exchangeRates} onChange={(r) => handleChange("exchangeRates", r)} />
        <LanguageSelector language={state.language} onChange={handleChange} />
        <MultiLanguageSupport
          enabledLanguages={state.enabledLanguages}
          defaultLanguage={state.defaultLanguage}
          onChange={handleChange}
        />
        <DateFormatSettings dateFormat={state.dateFormat} onChange={handleChange} />
        <TimezoneSettings
          timezone={state.timezone}
          autoTimeSync={state.autoTimeSync}
          onChange={handleChange}
        />
      </div>

      <NumberFormatSettings
        thousandsSeparator={state.thousandsSeparator}
        decimalSeparator={state.decimalSeparator}
        currencyRounding={state.currencyRounding}
        onChange={handleChange}
      />

      <div className="rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-slate-100 shadow-lg">
        <p className="text-sm font-semibold mb-2">{t("currency_language.save.title")}</p>
        <SaveSettingsButton saving={saving} onSave={handleSave} onReset={handleReset} />
      </div>
    </main>
  );
}
