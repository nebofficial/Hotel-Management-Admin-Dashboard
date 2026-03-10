"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaxTypeSelector } from "./TaxTypeSelector";
import { TaxPercentageSettings } from "./TaxPercentageSettings";
import { ApplyTaxScopeSelector } from "./ApplyTaxScopeSelector";
import { TaxPrioritySettings } from "./TaxPrioritySettings";

export type DraftTaxRule = {
  name: string;
  type: "GST" | "VAT" | "SERVICE" | "CITY";
  percentage?: number | string;
  scope: "rooms" | "services" | "both";
  cityTaxMode?: "per_night" | "per_guest" | "fixed" | "";
  cityTaxAmount?: number | string;
  priority?: number | string;
};

const defaultDraft: DraftTaxRule = {
  name: "",
  type: "GST",
  percentage: 0,
  scope: "rooms",
  cityTaxMode: "",
  cityTaxAmount: "",
  priority: 1,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: DraftTaxRule) => Promise<void>;
};

export function CreateTaxRuleModal({ open, onOpenChange, onCreate }: Props) {
  const [draft, setDraft] = useState<DraftTaxRule>(defaultDraft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!draft.name.trim()) {
      setError("Tax name is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onCreate(draft);
      setDraft(defaultDraft);
      onOpenChange(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create tax rule");
    } finally {
      setSubmitting(false);
    }
  };

  const isCity = draft.type === "CITY";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Create Tax Rule</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Tax Name</Label>
            <Input
              className="h-9 text-xs"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="GST on Rooms"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TaxTypeSelector
              value={draft.type}
              onChange={(type) =>
                setDraft((d) => ({
                  ...d,
                  type: type as DraftTaxRule["type"],
                }))
              }
            />
            <ApplyTaxScopeSelector
              value={draft.scope}
              onChange={(scope) => setDraft((d) => ({ ...d, scope: scope as DraftTaxRule["scope"] }))}
            />
          </div>

          {!isCity && (
            <TaxPercentageSettings
              value={draft.percentage ?? ""}
              onChange={(percentage) => setDraft((d) => ({ ...d, percentage }))}
            />
          )}

          {isCity && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">City Tax Mode</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
                  value={draft.cityTaxMode || ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      cityTaxMode: e.target.value as DraftTaxRule["cityTaxMode"],
                    }))
                  }
                >
                  <option value="">Select mode</option>
                  <option value="per_night">Per Night</option>
                  <option value="per_guest">Per Guest</option>
                  <option value="fixed">Fixed City Fee</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">City Tax Amount</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  className="h-9 text-xs"
                  value={draft.cityTaxAmount ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      cityTaxAmount: e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                  placeholder="e.g. 50"
                />
              </div>
            </div>
          )}

          <TaxPrioritySettings
            value={draft.priority ?? 1}
            onChange={(priority) => setDraft((d) => ({ ...d, priority }))}
          />

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

