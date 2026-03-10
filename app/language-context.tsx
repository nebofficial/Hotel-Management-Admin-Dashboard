"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useAuth } from "@/app/auth-context";
import { fetchCurrencySettings } from "@/services/api/currencyLanguageApi";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import hi from "@/locales/hi.json";
import ne from "@/locales/ne.json";
import bho from "@/locales/bho.json";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

// API returns language name (e.g. "English"); map to locale code
const LANGUAGE_NAME_TO_LOCALE: Record<string, string> = {
  English: "en",
  Arabic: "ar",
  Spanish: "es",
  French: "fr",
  Hindi: "hi",
  Chinese: "zh",
  Nepali: "ne",
  Bhojpuri: "bho",
};

const messages: Record<string, Record<string, string>> = {
  en: en as Record<string, string>,
  ar: ar as Record<string, string>,
  es: es as Record<string, string>,
  fr: fr as Record<string, string>,
  hi: hi as Record<string, string>,
  zh: en as Record<string, string>,
  ne: ne as Record<string, string>,
  bho: bho as Record<string, string>,
};

const RTL_LOCALES = new Set(["ar"]);

type LanguageContextType = {
  locale: string;
  languageName: string;
  isRtl: boolean;
  t: (key: string) => string;
  loading: boolean;
  refreshLanguage: () => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [locale, setLocale] = useState<string>("en");
  const [languageName, setLanguageName] = useState<string>("English");
  const [loading, setLoading] = useState(true);

  const loadLanguage = useCallback(async (hotelId: string) => {
    try {
      const data = await fetchCurrencySettings(API_BASE, hotelId);
      const settings = data.settings ?? data;
      const name = (settings.language as string) || "English";
      const code = LANGUAGE_NAME_TO_LOCALE[name] || "en";
      setLanguageName(name);
      setLocale(code);
      if (typeof document !== "undefined") {
        document.documentElement.lang = code;
        document.documentElement.dir = RTL_LOCALES.has(code) ? "rtl" : "ltr";
      }
    } catch {
      setLocale("en");
      setLanguageName("English");
      if (typeof document !== "undefined") {
        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
      }
    }
  }, []);

  const refreshLanguage = useCallback(async () => {
    if (user?.hotelId) await loadLanguage(user.hotelId);
  }, [user?.hotelId, loadLanguage]);

  useEffect(() => {
    if (!user?.hotelId) {
      setLocale("en");
      setLanguageName("English");
      setLoading(false);
      if (typeof document !== "undefined") {
        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
      }
      return;
    }
    setLoading(true);
    loadLanguage(user.hotelId).finally(() => setLoading(false));
  }, [user?.hotelId, loadLanguage]);

  // Apply locale from language name (e.g. after save on Settings page) so UI updates immediately
  const applyLanguageByName = useCallback((name: string) => {
    const code = LANGUAGE_NAME_TO_LOCALE[name] || "en";
    setLanguageName(name);
    setLocale(code);
    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
      document.documentElement.dir = RTL_LOCALES.has(code) ? "rtl" : "ltr";
    }
  }, []);

  // When user saves language in Settings, apply immediately and/or refetch
  useEffect(() => {
    const onLanguageChange = (e: CustomEvent<{ languageName?: string; hotelId?: string }>) => {
      const d = e.detail;
      if (d?.languageName) {
        applyLanguageByName(d.languageName);
      }
      if (d?.hotelId && user?.hotelId === d.hotelId) {
        loadLanguage(d.hotelId);
      }
    };
    window.addEventListener("language-changed" as never, onLanguageChange as never);
    return () =>
      window.removeEventListener("language-changed" as never, onLanguageChange as never);
  }, [loadLanguage, user?.hotelId, applyLanguageByName]);

  const t = useCallback(
    (key: string): string => {
      const dict = messages[locale] || messages.en;
      return dict[key] ?? messages.en?.[key] ?? key;
    },
    [locale]
  );

  const isRtl = useMemo(() => RTL_LOCALES.has(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      languageName,
      isRtl,
      t,
      loading,
      refreshLanguage,
    }),
    [locale, languageName, isRtl, t, loading, refreshLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "rtl" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (ctx === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
