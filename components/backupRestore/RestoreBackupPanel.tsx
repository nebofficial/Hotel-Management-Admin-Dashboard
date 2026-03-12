"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Backup = {
  id: string;
  createdAt: string;
};

type Props = {
  backups: Backup[];
  onRestore: (id: string) => Promise<void>;
};

export function RestoreBackupPanel({ backups, onRestore }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    if (!selectedId) return;
    if (!window.confirm("Are you sure you want to restore from this backup?")) {
      return;
    }
    setRestoring(true);
    try {
      await onRestore(selectedId);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-400/10 backdrop-blur">
      <div className="p-4 border-b border-orange-400/40">
        <p className="text-sm font-semibold text-orange-900 dark:text-orange-50">
          Restore System from Backup
        </p>
        <p className="text-[11px] text-orange-900/70 dark:text-orange-100/80">
          Select a backup snapshot to restore system data.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs">Select Backup</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Choose backup...</option>
            {backups.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id.slice(0, 8)} ·{" "}
                {new Date(b.createdAt).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            className="bg-orange-600 text-white"
            disabled={!selectedId || restoring}
            onClick={handleRestore}
          >
            {restoring ? "Restoring..." : "Restore Backup"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

