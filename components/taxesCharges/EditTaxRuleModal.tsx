"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaxTypeSelector } from "./TaxTypeSelector";
import { TaxPercentageSettings } from "./TaxPercentageSettings";
import { ApplyTaxScopeSelector } from "./ApplyTaxScopeSelector";
import { TaxPrioritySettings } from "./TaxPrioritySettings";
import { TaxStatusToggle } from "./TaxStatusToggle";

export type TaxRule = {
  id: string;
  name: string;
  type: "GST" | "VAT" | "SERVICE" | "CITY";
  percentage?: number;
  scope: "rooms" | "services" | "both";
  cityTaxMode?: "per_night" | "per_guest" | "fixed" | null;
  cityTaxAmount?: number | null;
  priority: number;
  active: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: TaxRule | null;
  onSave: (id: string, updates: Partial<TaxRule>) => Promise<void>;
};

export function EditTaxRuleModal({ open, onOpenChange, rule, onSave }: Props) {
  const [draft, setDraft] = useState<TaxRule | null>(rule);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(rule);
    setError(null);
    setSubmitting(false);
  }, [rule, open]);

  if (!draft) return null;

  const isCity = draft.type === "CITY";

  const handleSubmit = async () => {
    if (!draft.name.trim()) {
      setError("Tax name is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSave(draft.id, {
        name: draft.name,
        type: draft.type,
        percentage: draft.percentage,
        scope: draft.scope,
        cityTaxMode: draft.cityTaxMode,
        cityTaxAmount: draft.cityTaxAmount ?? null,
        priority: draft.priority,
        active: draft.active,
      });
      onOpenChange(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update tax rule");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Edit Tax Rule</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Tax Name</Label>
            <Input
              className="h-9 text-xs"
              value={draft.name}
              onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TaxTypeSelector
              value={draft.type}
              onChange={(type) =>
                setDraft((d) => (d ? { ...d, type: type as TaxRule["type"] } : d))
              }
            />
            <ApplyTaxScopeSelector
              value={draft.scope}
              onChange={(scope) =>
                setDraft((d) => (d ? { ...d, scope: scope as TaxRule["scope"] } : d))
              }
            />
          </div>

          {!isCity && (
            <TaxPercentageSettings
              value={draft.percentage ?? ""}
              onChange={(percentage) =>
                setDraft((d) => (d ? { ...d, percentage: percentage as number } : d))
              }
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
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            cityTaxMode: e.target.value
                              ? (e.target.value as TaxRule["cityTaxMode"])
                              : null,
                          }
                        : d
                    )
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
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            cityTaxAmount: e.target.value === "" ? null : Number(e.target.value),
                          }
                        : d
                    )
                  }
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <TaxPrioritySettings
              value={draft.priority}
              onChange={(priority) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        priority: typeof priority === "string" ? Number(priority || 1) : priority,
                      }
                    : d
                )
              }
            />
            <TaxStatusToggle
              active={draft.active}
              onChange={(active) => setDraft((d) => (d ? { ...d, active } : d))}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

