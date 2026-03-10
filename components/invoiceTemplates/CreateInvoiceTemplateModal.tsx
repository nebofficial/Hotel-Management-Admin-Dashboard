"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type DraftInvoiceTemplate = {
  name: string;
  layoutStyle: string;
  isDefault: boolean;
  active: boolean;
};

const defaultDraft: DraftInvoiceTemplate = {
  name: "",
  layoutStyle: "CLASSIC",
  isDefault: false,
  active: true,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (draft: DraftInvoiceTemplate) => Promise<void>;
};

export function CreateInvoiceTemplateModal({ open, onOpenChange, onCreate }: Props) {
  const [draft, setDraft] = useState<DraftInvoiceTemplate>(defaultDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!draft.name.trim()) {
      setError("Template name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onCreate(draft);
      setDraft(defaultDraft);
      onOpenChange(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Create Invoice Template</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Template Name</Label>
            <Input
              className="h-9 text-xs"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Classic Hotel Invoice"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Layout Style</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              value={draft.layoutStyle}
              onChange={(e) => setDraft((d) => ({ ...d, layoutStyle: e.target.value }))}
            >
              <option value="CLASSIC">Classic</option>
              <option value="COMPACT">Compact</option>
              <option value="DETAILED">Detailed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="defaultTemplate"
              type="checkbox"
              className="h-3 w-3"
              checked={draft.isDefault}
              onChange={(e) => setDraft((d) => ({ ...d, isDefault: e.target.checked }))}
            />
            <Label htmlFor="defaultTemplate" className="text-xs">
              Set as default template
            </Label>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

