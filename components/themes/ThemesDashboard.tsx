"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/auth-context";
import {
  fetchThemeSettings,
  updateThemeSettings,
  resetThemeDefaults,
} from "@/services/api/themeSettingsApi";
import { ThemeSelection } from "./ThemeSelection";
import { LightDarkModeToggle } from "./LightDarkModeToggle";
import { BrandColorSettings } from "./BrandColorSettings";
import { FontSettingsPanel } from "./FontSettings";
import { ButtonStyleSettings } from "./ButtonStyleSettings";
import { SidebarLayoutOptions } from "./SidebarLayoutOptions";
import { LogoUploader } from "./LogoUploader";
import { UIAppearancePreview } from "./UIAppearancePreview";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};

type FontSettings = {
  family: string;
  size: "small" | "medium" | "large";
  headingStyle: string;
  lineSpacing: number;
};

type ButtonSettings = {
  shape: "rounded" | "square";
  shadow: boolean;
  variants: string[];
};

type SidebarLayout = {
  variant: "collapsible" | "compact" | "icon-only";
  position: "fixed" | "floating";
};

type LogoConfig = {
  url: string | null;
  size: "sm" | "md" | "lg";
  position: "sidebar" | "topbar";
  faviconUrl?: string | null;
};

type ThemeState = {
  themeName: string;
  mode: "light" | "dark" | "system";
  brandColors: BrandColors;
  fontSettings: FontSettings;
  buttonSettings: ButtonSettings;
  sidebarLayout: SidebarLayout;
  logoConfig: LogoConfig;
};

const DEFAULT_STATE: ThemeState = {
  themeName: "modern",
  mode: "light",
  brandColors: {
    primary: "#2563eb",
    secondary: "#0f172a",
    accent: "#22c55e",
    background: "#f8fafc",
  },
  fontSettings: {
    family: "Inter",
    size: "medium",
    headingStyle: "semibold",
    lineSpacing: 1.5,
  },
  buttonSettings: {
    shape: "rounded",
    shadow: true,
    variants: ["solid", "outline"],
  },
  sidebarLayout: {
    variant: "collapsible",
    position: "fixed",
  },
  logoConfig: {
    url: null,
    size: "md",
    position: "sidebar",
    faviconUrl: null,
  },
};

export default function ThemesDashboard() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const [state, setState] = useState<ThemeState>(DEFAULT_STATE);
  const [initialState, setInitialState] = useState<ThemeState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyModeToDocument = useCallback((mode: ThemeState["mode"]) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.add("light");
    } else {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
    }
  }, []);

  const applyFontToDocument = useCallback((font: FontSettings) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const family =
      font.family === "Roboto"
        ? '"Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        : font.family === "Open Sans"
          ? '"Open Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          : '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const size =
      font.size === "small" ? "13px" : font.size === "large" ? "16px" : "14px";
    const headingWeight =
      font.headingStyle === "bold"
        ? "700"
        : font.headingStyle === "semibold"
          ? "600"
          : "400";

    root.style.setProperty("--font-sans", family);
    root.style.setProperty("--app-font-size", size);
    root.style.setProperty(
      "--app-line-height",
      String(font.lineSpacing || DEFAULT_STATE.fontSettings.lineSpacing),
    );
    root.style.setProperty("--app-heading-weight", headingWeight);
  }, []);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchThemeSettings(API_BASE, user.hotelId);
      const s = data.settings || data || {};
      const next: ThemeState = {
        themeName: s.themeName || DEFAULT_STATE.themeName,
        mode: (s.mode as ThemeState["mode"]) || DEFAULT_STATE.mode,
        brandColors: {
          ...DEFAULT_STATE.brandColors,
          ...(s.brandColors || {}),
        },
        fontSettings: {
          ...DEFAULT_STATE.fontSettings,
          ...(s.fontSettings || {}),
        },
        buttonSettings: {
          ...DEFAULT_STATE.buttonSettings,
          ...(s.buttonSettings || {}),
          variants:
            Array.isArray(s.buttonSettings?.variants) && s.buttonSettings.variants.length
              ? s.buttonSettings.variants
              : DEFAULT_STATE.buttonSettings.variants,
        },
        sidebarLayout: {
          ...DEFAULT_STATE.sidebarLayout,
          ...(s.sidebarLayout || {}),
        },
        logoConfig: {
          ...DEFAULT_STATE.logoConfig,
          ...(s.logoConfig || {}),
        },
      };
      setState(next);
      setInitialState(next);
      const themeMode = next.mode === "system" ? "system" : next.mode;
      setTheme(themeMode);
      applyModeToDocument(next.mode);
      applyFontToDocument(next.fontSettings);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load theme settings");
    } finally {
      setLoading(false);
    }
  }, [applyFontToDocument, setTheme, user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = (partial: Partial<ThemeState>) => {
    setState((prev) => ({ ...(prev || DEFAULT_STATE), ...partial }));
  };

  const handleSave = async () => {
    if (!user?.hotelId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        themeName: state.themeName,
        mode: state.mode,
        brandColors: state.brandColors,
        fontSettings: state.fontSettings,
        buttonSettings: state.buttonSettings,
        sidebarLayout: state.sidebarLayout,
        logoConfig: state.logoConfig,
      };
      const data = await updateThemeSettings(API_BASE, user.hotelId, payload);
      const s = data.settings || data || payload;
      const next = {
        ...state,
        ...s,
      } as ThemeState;
      setState(next);
      setInitialState(next);
      const themeMode = next.mode === "system" ? "system" : next.mode;
      setTheme(themeMode);
      applyModeToDocument(next.mode);
      applyFontToDocument(next.fontSettings);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save theme settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!user?.hotelId) return;
    setSaving(true);
    setError(null);
    try {
      const data = await resetThemeDefaults(API_BASE, user.hotelId);
      const s = data.settings || data || {};
      const next: ThemeState = {
        themeName: s.themeName || DEFAULT_STATE.themeName,
        mode: (s.mode as ThemeState["mode"]) || DEFAULT_STATE.mode,
        brandColors: { ...DEFAULT_STATE.brandColors, ...(s.brandColors || {}) },
        fontSettings: { ...DEFAULT_STATE.fontSettings, ...(s.fontSettings || {}) },
        buttonSettings: {
          ...DEFAULT_STATE.buttonSettings,
          ...(s.buttonSettings || {}),
          variants:
            Array.isArray(s.buttonSettings?.variants) && s.buttonSettings.variants.length
              ? s.buttonSettings.variants
              : DEFAULT_STATE.buttonSettings.variants,
        },
        sidebarLayout: { ...DEFAULT_STATE.sidebarLayout, ...(s.sidebarLayout || {}) },
        logoConfig: { ...DEFAULT_STATE.logoConfig, ...(s.logoConfig || {}) },
      };
      setState(next);
      setInitialState(next);
      const themeMode = next.mode === "system" ? "system" : next.mode;
      setTheme(themeMode);
      applyModeToDocument(next.mode);
      applyFontToDocument(next.fontSettings);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to reset theme settings");
    } finally {
      setSaving(false);
    }
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Themes</h1>
            <p className="text-xs text-muted-foreground">
              Customize the appearance of the system for each hotel.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to manage theme settings.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Themes</h1>
            <p className="text-xs text-muted-foreground">
              Customize the appearance of the system for each hotel.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Loading theme settings...</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Themes</h1>
          <p className="text-xs text-muted-foreground">
            Customize themes, fonts, colors, and layout to match your brand.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to Defaults
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white shadow-md"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Theme"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-4">
        <div className="space-y-3">
          <ThemeSelection
            value={state.themeName}
            onChange={(themeName) => patch({ themeName })}
          />
          <BrandColorSettings
            value={state.brandColors}
            onChange={(patchColors) =>
              patch({ brandColors: { ...state.brandColors, ...patchColors } })
            }
          />
          <FontSettingsPanel
            value={state.fontSettings}
            onChange={(patchFont) =>
              {
                const updated = { ...state.fontSettings, ...patchFont };
                patch({ fontSettings: updated });
                applyFontToDocument(updated);
              }
            }
          />
          <ButtonStyleSettings
            value={state.buttonSettings}
            onChange={(patchButtons) =>
              patch({ buttonSettings: { ...state.buttonSettings, ...patchButtons } })
            }
          />
        </div>

        <div className="space-y-3">
          <LightDarkModeToggle
            value={state.mode}
            onChange={(mode) => {
              patch({ mode });
              const themeMode = mode === "system" ? "system" : mode;
              setTheme(themeMode);
              applyModeToDocument(mode);
            }}
          />
          <SidebarLayoutOptions
            value={state.sidebarLayout}
            onChange={(patchLayout) =>
              patch({ sidebarLayout: { ...state.sidebarLayout, ...patchLayout } })
            }
          />
          <LogoUploader
            value={state.logoConfig}
            onChange={(patchLogo) =>
              patch({ logoConfig: { ...state.logoConfig, ...patchLogo } })
            }
          />
          <UIAppearancePreview
            themeName={state.themeName}
            mode={state.mode}
            brandColors={state.brandColors}
            fontFamily={state.fontSettings.family}
          />
        </div>
      </section>
    </main>
  );
}

