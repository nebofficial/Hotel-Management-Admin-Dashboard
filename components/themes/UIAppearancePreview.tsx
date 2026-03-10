"use client";

import { Card } from "@/components/ui/card";

type Props = {
  themeName: string;
  mode: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fontFamily: string;
};

export function UIAppearancePreview({
  themeName,
  mode,
  brandColors,
  fontFamily,
}: Props) {
  const bg = brandColors.background || "#f8fafc";
  const primary = brandColors.primary || "#2563eb";
  const accent = brandColors.accent || "#22c55e";
  const secondary = brandColors.secondary || "#0f172a";

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <div className="p-4 border-b border-slate-700">
        <p className="text-sm font-semibold">UI Appearance Preview</p>
        <p className="text-[11px] text-slate-300">
          See how your dashboard will look with the current theme settings.
        </p>
      </div>
      <div className="p-4 text-xs">
        <div
          className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900"
          style={{ fontFamily }}
        >
          <div
            className="flex"
            style={{ backgroundColor: bg, color: secondary }}
          >
            <aside
              className="w-28 px-2 py-3 space-y-2 text-[10px]"
              style={{ backgroundColor: secondary, color: "#e5e7eb" }}
            >
              <div className="h-6 w-16 rounded-md bg-slate-700 mb-4" />
              <div className="space-y-1">
                <div className="h-2.5 w-20 rounded bg-slate-600" />
                <div className="h-2.5 w-18 rounded bg-slate-700" />
                <div className="h-2.5 w-16 rounded bg-slate-700" />
              </div>
            </aside>
            <main className="flex-1 p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <div className="h-3 w-32 rounded bg-slate-200" />
                  <div className="h-2 w-24 rounded bg-slate-100" />
                </div>
                <div className="flex gap-2">
                  <button
                    className="h-6 px-3 rounded-md text-[10px] font-medium shadow-sm"
                    style={{
                      backgroundColor: primary,
                      color: "#f9fafb",
                    }}
                  >
                    Primary
                  </button>
                  <button
                    className="h-6 px-3 rounded-md border text-[10px]"
                    style={{
                      borderColor: accent,
                      color: accent,
                    }}
                  >
                    Outline
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div
                  className="rounded-lg p-2 space-y-1"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
                >
                  <div className="h-2.5 w-16 rounded bg-slate-200" />
                  <div className="h-2 w-20 rounded bg-slate-100" />
                </div>
                <div
                  className="rounded-lg p-2 space-y-1"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
                >
                  <div className="h-2.5 w-18 rounded bg-slate-200" />
                  <div className="h-2 w-16 rounded bg-slate-100" />
                </div>
                <div
                  className="rounded-lg p-2 space-y-1"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
                >
                  <div className="h-2.5 w-14 rounded bg-slate-200" />
                  <div className="h-2 w-12 rounded bg-slate-100" />
                </div>
              </div>
            </main>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-300">
          Theme: <span className="font-semibold">{themeName}</span> · Mode:{" "}
          <span className="font-semibold">{mode}</span>
        </p>
      </div>
    </Card>
  );
}

