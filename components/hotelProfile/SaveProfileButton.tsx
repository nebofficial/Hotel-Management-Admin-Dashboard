"use client";

import { Button } from "@/components/ui/button";

type Props = {
  saving: boolean;
  onSave: () => void;
};

export function SaveProfileButton({ saving, onSave }: Props) {
  return (
    <div className="flex justify-end mt-2">
      <Button
        size="sm"
        onClick={onSave}
        disabled={saving}
        className="bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-lg shadow-emerald-500/30"
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

