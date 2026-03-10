"use client";

import { Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Settings Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of system configuration, integrations, and operational health.
        </p>
      </div>
      <div className="hidden md:flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 text-xs text-slate-100 shadow-inner shadow-emerald-500/40 border border-emerald-500/40">
        <Settings className="w-4 h-4 text-emerald-400" />
        <span>System Configuration Center</span>
      </div>
    </div>
  );
}

