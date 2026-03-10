"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type InvoiceTemplate = {
  id: string;
  name: string;
  layoutStyle: string;
  isDefault: boolean;
  active: boolean;
  taxDisplayMode: string;
  footerNotes?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: InvoiceTemplate | null;
  onSave: (id: string, updates: Partial<InvoiceTemplate>) => Promise<void>;
};

export function EditInvoiceTemplateModal({ open, onOpenChange, template, onSave }: Props) {
  const [draft, setDraft] = useState<InvoiceTemplate | null>(template);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(template);
    setError(null);
    setSaving(false);
  }, [template, open]);

  if (!draft) return null;

  const handleSave = async () => {
    if (!draft.name.trim()) {
      setError("Template name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(draft.id, {
        name: draft.name,
        layoutStyle: draft.layoutStyle,
        isDefault: draft.isDefault,
        active: draft.active,
        taxDisplayMode: draft.taxDisplayMode,
        footerNotes: draft.footerNotes ?? "",
      });
      onOpenChange(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Edit Invoice Template</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Template Name</Label>
            <Input
              className="h-9 text-xs"
              value={draft.name}
              onChange={(e) => setDraft((d) => (d ? { ...d, name: e.target.value } : d))}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Layout Style</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              value={draft.layoutStyle}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, layoutStyle: e.target.value } : d))
              }
            >
              <option value="CLASSIC">Classic</option>
              <option value="COMPACT">Compact</option>
              <option value="DETAILED">Detailed</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Tax Display</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              value={draft.taxDisplayMode}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, taxDisplayMode: e.target.value } : d))
              }
            >
              <option value="DETAILED">Detailed breakdown</option>
              <option value="TOTAL_ONLY">Show total tax only</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="editDefaultTemplate"
              type="checkbox"
              className="h-3 w-3"
              checked={draft.isDefault}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, isDefault: e.target.checked } : d))
              }
            />
            <Label htmlFor="editDefaultTemplate" className="text-xs">
              Set as default template
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="editTemplateActive"
              type="checkbox"
              className="h-3 w-3"
              checked={draft.active}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, active: e.target.checked } : d))
              }
            />
            <Label htmlFor="editTemplateActive" className="text-xs">
              Template is active
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

