"use client";

import { Button } from "@/components/ui/button";

type Props = {
  saving: boolean;
  onSave: () => void;
  onReset?: () => void;
};

export function SaveRulesButton({ saving, onSave, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <Button
        size="sm"
        onClick={onSave}
        disabled={saving}
        className="bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-lg shadow-emerald-500/30"
      >
        {saving ? "Saving..." : "Save Rules"}
      </Button>
      {onReset && (
        <Button type="button" variant="outline" size="sm" onClick={onReset} disabled={saving}>
          Reset Changes
        </Button>
      )}
    </div>
  );
}
