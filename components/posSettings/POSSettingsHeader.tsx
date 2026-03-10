"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
};

export function POSSettingsHeader({ onSave, onReset, saving }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">POS Settings</h1>
        <p className="text-xs text-muted-foreground">
          Configure POS terminals, printers, table layout, and receipt format.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onReset}
          disabled={saving}
        >
          Reset
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

